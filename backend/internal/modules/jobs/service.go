package jobs

import (
	"context"
	"fmt"
	"strings"
	"time"

	"find-your-job/backend/internal/modules/users"

	"github.com/google/uuid"
)

// JobService defines the business-logic contract for job operations.
type JobService interface {
	CreateJob(ctx context.Context, userID, role string, input CreateJobInput) (*JobResponse, error)
	GetJob(ctx context.Context, id string) (*JobResponse, error)
	ListJobs(ctx context.Context, filter JobListFilter) (*JobListResponse, error)
	UpdateJob(ctx context.Context, userID, role, id string, input UpdateJobInput) (*JobResponse, error)
	DeleteJob(ctx context.Context, userID, role, id string) error
}

// RecruiterStore is the minimal interface needed to look up a recruiter's company.
type RecruiterStore interface {
	FindByUserID(ctx context.Context, userID string) (*users.Recruiter, error)
}

// JobListResponse wraps a paginated list of jobs.
type JobListResponse struct {
	Data   []Job `json:"data"`
	Limit  int   `json:"limit"`
	Offset int   `json:"offset"`
}

// jobService is the concrete implementation of JobService.
type jobService struct {
	repo       JobRepository
	recruiters RecruiterStore
}

// NewService creates a JobService with the given dependencies.
func NewService(repo JobRepository, recruiters RecruiterStore) JobService {
	return &jobService{repo: repo, recruiters: recruiters}
}

// ListJobs returns jobs matching the given filters with pagination metadata.
func (s *jobService) ListJobs(ctx context.Context, filter JobListFilter) (*JobListResponse, error) {
	jobs, err := s.repo.List(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("list jobs: %w", err)
	}
	if jobs == nil {
		jobs = []Job{}
	}
	return &JobListResponse{
		Data:   jobs,
		Limit:  filter.Limit,
		Offset: filter.Offset,
	}, nil
}

// GetJob returns a job by ID with its skills.
func (s *jobService) GetJob(ctx context.Context, id string) (*JobResponse, error) {
	if _, err := uuid.Parse(id); err != nil {
		return nil, fmt.Errorf("%w: invalid job id", ErrJobNotFound)
	}
	job, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	skills, err := s.repo.ListSkillsByJobID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get job skills: %w", err)
	}
	if skills == nil {
		skills = []JobSkill{}
	}
	return &JobResponse{Job: *job, Skills: skills}, nil
}

// CreateJob creates a new job listing.
func (s *jobService) CreateJob(ctx context.Context, userID, role string, input CreateJobInput) (*JobResponse, error) {
	if role != "recruiter" {
		return nil, fmt.Errorf("only recruiters can create jobs")
	}
	if err := input.Validate(); err != nil {
		return nil, err
	}
	rec, err := s.getRecruiter(ctx, userID)
	if err != nil {
		return nil, err
	}

	job := &Job{
		CompanyID:   rec.CompanyID,
		RecruiterID: &rec.ID,
		Title:       strings.TrimSpace(input.Title),
		Description: input.Description,
		IsRemote:    false,
		Currency:    "USD",
		Status:      "draft",
		Source:      strPtr("manual"),
	}
	if input.IsRemote != nil {
		job.IsRemote = *input.IsRemote
	}
	if input.Location != nil {
		job.Location = input.Location
	}
	if input.SalaryMin != nil {
		job.SalaryMin = input.SalaryMin
	}
	if input.SalaryMax != nil {
		job.SalaryMax = input.SalaryMax
	}
	if input.Currency != nil && *input.Currency != "" {
		job.Currency = strings.ToUpper(*input.Currency)
	}
	if input.JobType != nil {
		job.JobType = input.JobType
	}
	if input.ExpiresAt != nil {
		job.ExpiresAt = parseOptionalTime(*input.ExpiresAt)
	}
	if input.Source != nil {
		job.Source = input.Source
	}

	if err := s.repo.Create(ctx, job); err != nil {
		return nil, fmt.Errorf("create job: %w", err)
	}
	return &JobResponse{Job: *job, Skills: []JobSkill{}}, nil
}

// UpdateJob updates an existing job. Only the owning recruiter (or same company) can update.
func (s *jobService) UpdateJob(ctx context.Context, userID, role, id string, input UpdateJobInput) (*JobResponse, error) {
	job, rec, err := s.authorizeJobAction(ctx, userID, role, id)
	if err != nil {
		return nil, err
	}

	// Apply changes
	if input.Title != nil {
		job.Title = strings.TrimSpace(*input.Title)
	}
	if input.Description != nil {
		job.Description = input.Description
	}
	if input.Requirements != nil {
		job.Requirements = input.Requirements
	}
	if input.Responsibilities != nil {
		job.Responsibilities = input.Responsibilities
	}
	if input.Location != nil {
		job.Location = input.Location
	}
	if input.IsRemote != nil {
		job.IsRemote = *input.IsRemote
	}
	if input.SalaryMin != nil {
		if *input.SalaryMin < 0 {
			return nil, fmt.Errorf("salary_min must be >= 0")
		}
		job.SalaryMin = input.SalaryMin
	}
	if input.SalaryMax != nil {
		if *input.SalaryMax < 0 {
			return nil, fmt.Errorf("salary_max must be >= 0")
		}
		job.SalaryMax = input.SalaryMax
	}
	// Cross-field validation after applying both
	if job.SalaryMin != nil && job.SalaryMax != nil && *job.SalaryMax < *job.SalaryMin {
		return nil, fmt.Errorf("salary_max must be >= salary_min")
	}
	if input.Currency != nil && *input.Currency != "" {
		job.Currency = strings.ToUpper(*input.Currency)
	}
	if input.JobType != nil {
		if !validJobTypes[*input.JobType] {
			return nil, fmt.Errorf("invalid job_type: must be one of full_time, part_time, contract, freelance, internship")
		}
		job.JobType = input.JobType
	}
	if input.Status != nil {
		if !validJobStatus(*input.Status) {
			return nil, fmt.Errorf("invalid status: must be one of draft, published, closed, archived")
		}
		job.Status = *input.Status
	}
	if input.ExpiresAt != nil {
		job.ExpiresAt = parseOptionalTime(*input.ExpiresAt)
	}
	if input.Source != nil {
		job.Source = input.Source
	}

	if err := s.repo.Update(ctx, job); err != nil {
		return nil, fmt.Errorf("update job: %w", err)
	}

	skills, _ := s.repo.ListSkillsByJobID(ctx, job.ID)
	if skills == nil {
		skills = []JobSkill{}
	}

	_ = rec // used for ownership check
	return &JobResponse{Job: *job, Skills: skills}, nil
}

// DeleteJob deletes a job by ID. Only the owning recruiter (or same company) can delete.
func (s *jobService) DeleteJob(ctx context.Context, userID, role, id string) error {
	_, _, err := s.authorizeJobAction(ctx, userID, role, id)
	if err != nil {
		return err
	}
	if err := s.repo.Delete(ctx, id); err != nil {
		return fmt.Errorf("delete job: %w", err)
	}
	return nil
}

// ── Helpers ─────────────────────────────────────────

// getRecruiter validates the role and looks up the recruiter record.
func (s *jobService) getRecruiter(ctx context.Context, userID string) (*users.Recruiter, error) {
	if s.recruiters == nil {
		return nil, fmt.Errorf("recruiter repository not configured")
	}
	rec, err := s.recruiters.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find recruiter: %w", err)
	}
	return rec, nil
}

// authorizeJobAction checks role, fetches job and recruiter, and validates ownership.
func (s *jobService) authorizeJobAction(ctx context.Context, userID, role, id string) (*Job, *users.Recruiter, error) {
	if role != "recruiter" {
		return nil, nil, fmt.Errorf("only recruiters can modify jobs")
	}
	if _, err := uuid.Parse(id); err != nil {
		return nil, nil, fmt.Errorf("%w: invalid job id", ErrJobNotFound)
	}

	rec, err := s.getRecruiter(ctx, userID)
	if err != nil {
		return nil, nil, err
	}

	job, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, nil, err
	}

	// Ownership: same recruiter OR same company
	if job.CompanyID != rec.CompanyID && (job.RecruiterID == nil || *job.RecruiterID != rec.ID) {
		return nil, nil, fmt.Errorf("not authorized to modify this job")
	}

	return job, rec, nil
}

func strPtr(s string) *string { return &s }

func parseOptionalTime(s string) *time.Time {
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return nil
	}
	return &t
}

func validJobStatus(s string) bool {
	switch s {
	case "draft", "published", "closed", "archived":
		return true
	}
	return false
}
