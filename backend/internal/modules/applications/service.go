package applications

import (
	"context"
	"fmt"
	"strconv"

	"find-your-job/backend/internal/modules/jobs"
	"find-your-job/backend/internal/modules/users"
)

// ApplicationService defines the business-logic contract.
type ApplicationService interface {
	Apply(ctx context.Context, userID, jobID string, input CreateApplicationInput) (*ApplicationResponse, error)
	ListByCandidate(ctx context.Context, userID string, limit, offset int) (*ApplicationListResponse, error)
	ListByJob(ctx context.Context, userID, jobID string, limit, offset int) (*ApplicationListResponse, error)
	UpdateStatus(ctx context.Context, userID, id string, input UpdateStatusInput) (*ApplicationResponse, error)
}

// JobStore is the minimal job interface needed by applications.
type JobStore interface {
	FindByID(ctx context.Context, id string) (*jobs.Job, error)
}

// CandidateProfileStore is the minimal candidate profile interface.
type CandidateProfileStore interface {
	FindByUserID(ctx context.Context, userID string) (*users.CandidateProfile, error)
}

// RecruiterStore is the minimal recruiter interface for ownership checks.
type RecruiterStore interface {
	FindByUserID(ctx context.Context, userID string) (*users.Recruiter, error)
}

// ApplicationListResponse wraps a paginated list of applications.
type ApplicationListResponse struct {
	Data   []ApplicationResponse `json:"data"`
	Limit  int                   `json:"limit"`
	Offset int                   `json:"offset"`
}

// applicationService is the concrete implementation.
type applicationService struct {
	repo       ApplicationRepository
	jobs       JobStore
	candidates CandidateProfileStore
	recruiters RecruiterStore
}

// NewService creates an ApplicationService.
func NewService(repo ApplicationRepository, jobs JobStore, candidates CandidateProfileStore, recruiters RecruiterStore) ApplicationService {
	return &applicationService{repo: repo, jobs: jobs, candidates: candidates, recruiters: recruiters}
}

// Apply submits a job application for the authenticated candidate.
func (s *applicationService) Apply(ctx context.Context, userID, jobID string, input CreateApplicationInput) (*ApplicationResponse, error) {
	profile, err := s.candidates.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("candidate profile: %w", err)
	}
	job, err := s.jobs.FindByID(ctx, jobID)
	if err != nil {
		return nil, fmt.Errorf("job: %w", err)
	}
	if job.Status != "published" {
		return nil, fmt.Errorf("can only apply to published jobs")
	}

	app := &Application{
		JobID:             jobID,
		CandidateID:       profile.ID,
		Status:            "pending",
		CoverLetter:       input.CoverLetter,
		ResumeSnapshotURL: input.ResumeSnapshotURL,
	}
	if err := s.repo.Create(ctx, app); err != nil {
		return nil, err
	}
	return &ApplicationResponse{Application: *app, JobTitle: &job.Title}, nil
}

// ListByCandidate returns the authenticated candidate's applications.
func (s *applicationService) ListByCandidate(ctx context.Context, userID string, limit, offset int) (*ApplicationListResponse, error) {
	profile, err := s.candidates.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("candidate profile: %w", err)
	}

	apps, err := s.repo.ListByCandidateID(ctx, profile.ID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by candidate: %w", err)
	}
	if apps == nil {
		apps = []Application{}
	}

	// Enrich with job titles
	responses := make([]ApplicationResponse, len(apps))
	for i, a := range apps {
		responses[i] = ApplicationResponse{Application: a}
		if job, err := s.jobs.FindByID(ctx, a.JobID); err == nil {
			responses[i].JobTitle = &job.Title
		}
	}

	return &ApplicationListResponse{Data: responses, Limit: limit, Offset: offset}, nil
}

// ListByJob returns applications for a job. Recruiter must own the job.
func (s *applicationService) ListByJob(ctx context.Context, userID, jobID string, limit, offset int) (*ApplicationListResponse, error) {
	rec, err := s.recruiters.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("recruiter: %w", err)
	}

	job, err := s.jobs.FindByID(ctx, jobID)
	if err != nil {
		return nil, fmt.Errorf("job: %w", err)
	}

	// Ownership check
	if job.CompanyID != rec.CompanyID && (job.RecruiterID == nil || *job.RecruiterID != rec.ID) {
		return nil, fmt.Errorf("not authorized to view applications for this job")
	}

	apps, err := s.repo.ListByJobID(ctx, jobID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by job: %w", err)
	}
	if apps == nil {
		apps = []Application{}
	}

	responses := make([]ApplicationResponse, len(apps))
	for i, a := range apps {
		responses[i] = ApplicationResponse{Application: a}
	}

	return &ApplicationListResponse{Data: responses, Limit: limit, Offset: offset}, nil
}

func (s *applicationService) UpdateStatus(ctx context.Context, userID, id string, input UpdateStatusInput) (*ApplicationResponse, error) {
	// Validate status
	if !validApplicationStatuses[input.Status] {
		return nil, fmt.Errorf("invalid status: must be one of pending, reviewed, shortlisted, rejected, offered, accepted, withdrawn")
	}

	// Find application
	app, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Find associated job
	job, err := s.jobs.FindByID(ctx, app.JobID)
	if err != nil {
		return nil, fmt.Errorf("job: %w", err)
	}

	// Verify recruiter ownership
	rec, err := s.recruiters.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("recruiter: %w", err)
	}
	if job.CompanyID != rec.CompanyID && (job.RecruiterID == nil || *job.RecruiterID != rec.ID) {
		return nil, fmt.Errorf("not authorized to update this application")
	}

	// Update
	if err := s.repo.UpdateStatus(ctx, id, input.Status); err != nil {
		return nil, err
	}
	app.Status = input.Status

	return &ApplicationResponse{Application: *app, JobTitle: &job.Title}, nil
}

func clampLimit(limit int) int {
	if limit <= 0 || limit > 100 {
		return 20
	}
	return limit
}

func clampOffset(offset int) int {
	if offset < 0 {
		return 0
	}
	return offset
}

func mustAtoi(s string, def int) int {
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return v
}
