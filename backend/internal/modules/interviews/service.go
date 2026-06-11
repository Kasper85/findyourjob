package interviews

import (
	"context"
	"fmt"
	"time"

	"find-your-job/backend/internal/modules/users"
)

type InterviewService interface {
	Create(ctx context.Context, userID, role, appID string, input CreateInterviewInput) (*InterviewResponse, error)
	Get(ctx context.Context, userID, role, id string) (*InterviewResponse, error)
	ListMine(ctx context.Context, userID, role string, limit, offset int) (*InterviewListResponse, error)
	ListByJob(ctx context.Context, userID, role, jobID string, limit, offset int) (*InterviewListResponse, error)
	Update(ctx context.Context, userID, role, id string, input UpdateInterviewInput) (*InterviewResponse, error)
	UpdateStatus(ctx context.Context, userID, role, id string, input UpdateStatusInput) (*InterviewResponse, error)
	Delete(ctx context.Context, userID, role, id string) error
}

type ApplicationStore interface {
	FindByID(ctx context.Context, id string) (*AppInfo, error)
}

type RecruiterStore interface {
	FindByUserID(ctx context.Context, userID string) (*RecInfo, error)
}

type CandidateProfileStore interface {
	FindByUserID(ctx context.Context, userID string) (*users.CandidateProfile, error)
}

type JobOwnershipStore interface {
	FindByID(ctx context.Context, id string) (*JobInfo, error)
}

type AppInfo struct {
	ID          string
	JobID       string
	CandidateID string
}

type RecInfo struct {
	ID        string
	CompanyID string
}

type JobInfo struct {
	ID          string
	CompanyID   string
	RecruiterID *string
}

type interviewService struct {
	repo       InterviewRepository
	apps       ApplicationStore
	recruiters RecruiterStore
	candidates CandidateProfileStore
	jobs       JobOwnershipStore
}

func NewService(repo InterviewRepository, apps ApplicationStore, recruiters RecruiterStore, candidates CandidateProfileStore, jobs JobOwnershipStore) InterviewService {
	return &interviewService{repo: repo, apps: apps, recruiters: recruiters, candidates: candidates, jobs: jobs}
}

func (s *interviewService) Create(ctx context.Context, userID, role, appID string, input CreateInterviewInput) (*InterviewResponse, error) {
	if role != "recruiter" && role != "admin" {
		return nil, fmt.Errorf("only recruiters and admins can create interviews")
	}
	app, err := s.apps.FindByID(ctx, appID)
	if err != nil {
		return nil, fmt.Errorf("application: %w", err)
	}
	if role == "recruiter" {
		if err := s.validateOwnership(ctx, userID, app.JobID); err != nil {
			return nil, err
		}
	}
	rec, err := s.recruiters.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("recruiter: %w", err)
	}
	scheduled, err := time.Parse(time.RFC3339, input.ScheduledAt)
	if err != nil {
		return nil, fmt.Errorf("invalid scheduled_at format, use RFC3339")
	}
	dur := 60
	if input.DurationMinutes != nil {
		dur = *input.DurationMinutes
	}
	if dur <= 0 {
		return nil, fmt.Errorf("duration_minutes must be > 0")
	}
	if input.Type != nil && *input.Type != "" && !validInterviewTypes[*input.Type] {
		return nil, fmt.Errorf("invalid type")
	}
	iv := &Interview{
		ApplicationID: appID, RecruiterID: rec.ID, CandidateID: app.CandidateID,
		ScheduledAt: scheduled, DurationMinutes: dur, Type: input.Type,
		LocationOrLink: input.LocationOrLink, Status: "scheduled", Notes: input.Notes,
	}
	if err := s.repo.Create(ctx, iv); err != nil {
		return nil, fmt.Errorf("create interview: %w", err)
	}
	return &InterviewResponse{Interview: *iv}, nil
}

func (s *interviewService) Get(ctx context.Context, userID, role, id string) (*InterviewResponse, error) {
	iv, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if role == "candidate" {
		profile, err := s.candidates.FindByUserID(ctx, userID)
		if err != nil {
			return nil, fmt.Errorf("candidate profile: %w", err)
		}
		if profile.ID != iv.CandidateID {
			return nil, fmt.Errorf("not authorized")
		}
	} else if role == "recruiter" {
		app, err := s.apps.FindByID(ctx, iv.ApplicationID)
		if err != nil {
			return nil, err
		}
		if err := s.validateOwnership(ctx, userID, app.JobID); err != nil {
			return nil, err
		}
	}
	_ = userID
	return &InterviewResponse{Interview: *iv}, nil
}

func (s *interviewService) ListMine(ctx context.Context, userID, role string, limit, offset int) (*InterviewListResponse, error) {
	if role == "candidate" {
		profile, err := s.candidates.FindByUserID(ctx, userID)
		if err != nil {
			return nil, fmt.Errorf("candidate profile: %w", err)
		}
		ivs, err := s.repo.ListByCandidateID(ctx, profile.ID, limit, offset)
		if err != nil {
			return nil, err
		}
		if ivs == nil {
			ivs = []Interview{}
		}
		return &InterviewListResponse{Data: ivs, Limit: limit, Offset: offset}, nil
	}

	if role == "recruiter" {
		rec, err := s.recruiters.FindByUserID(ctx, userID)
		if err != nil {
			return nil, fmt.Errorf("recruiter: %w", err)
		}
		ivs, err := s.repo.ListByRecruiterID(ctx, rec.ID, limit, offset)
		if err != nil {
			return nil, err
		}
		if ivs == nil {
			ivs = []Interview{}
		}
		return &InterviewListResponse{Data: ivs, Limit: limit, Offset: offset}, nil
	}

	if role == "admin" {
		return &InterviewListResponse{Data: []Interview{}, Limit: limit, Offset: offset}, nil
	}

	return nil, fmt.Errorf("unsupported role")
}

func (s *interviewService) ListByJob(ctx context.Context, userID, role, jobID string, limit, offset int) (*InterviewListResponse, error) {
	if role == "recruiter" {
		if err := s.validateOwnership(ctx, userID, jobID); err != nil {
			return nil, err
		}
	} else if role != "admin" {
		return nil, fmt.Errorf("only recruiters and admins can view job interviews")
	}
	ivs, err := s.repo.ListByJobID(ctx, jobID, limit, offset)
	if err != nil {
		return nil, err
	}
	if ivs == nil {
		ivs = []Interview{}
	}
	return &InterviewListResponse{Data: ivs, Limit: limit, Offset: offset}, nil
}

func (s *interviewService) Update(ctx context.Context, userID, role, id string, input UpdateInterviewInput) (*InterviewResponse, error) {
	iv, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if role == "recruiter" {
		app, err := s.apps.FindByID(ctx, iv.ApplicationID)
		if err != nil {
			return nil, err
		}
		if err := s.validateOwnership(ctx, userID, app.JobID); err != nil {
			return nil, err
		}
	}
	if input.ScheduledAt != nil {
		t, err := time.Parse(time.RFC3339, *input.ScheduledAt)
		if err != nil {
			return nil, fmt.Errorf("invalid scheduled_at")
		}
		iv.ScheduledAt = t
	}
	if input.DurationMinutes != nil {
		if *input.DurationMinutes <= 0 {
			return nil, fmt.Errorf("duration_minutes must be > 0")
		}
		iv.DurationMinutes = *input.DurationMinutes
	}
	if input.Type != nil {
		if *input.Type != "" && !validInterviewTypes[*input.Type] {
			return nil, fmt.Errorf("invalid type")
		}
		iv.Type = input.Type
	}
	if input.LocationOrLink != nil {
		iv.LocationOrLink = input.LocationOrLink
	}
	if input.Notes != nil {
		iv.Notes = input.Notes
	}
	if input.Feedback != nil {
		iv.Feedback = input.Feedback
	}
	if err := s.repo.Update(ctx, iv); err != nil {
		return nil, err
	}
	return &InterviewResponse{Interview: *iv}, nil
}

func (s *interviewService) UpdateStatus(ctx context.Context, userID, role, id string, input UpdateStatusInput) (*InterviewResponse, error) {
	if !validInterviewStatuses[input.Status] {
		return nil, fmt.Errorf("invalid status")
	}
	iv, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if role == "recruiter" {
		app, err := s.apps.FindByID(ctx, iv.ApplicationID)
		if err != nil {
			return nil, err
		}
		if err := s.validateOwnership(ctx, userID, app.JobID); err != nil {
			return nil, err
		}
	}
	iv, err = s.repo.UpdateStatus(ctx, id, input.Status)
	if err != nil {
		return nil, err
	}
	return &InterviewResponse{Interview: *iv}, nil
}

func (s *interviewService) Delete(ctx context.Context, userID, role, id string) error {
	iv, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if role == "recruiter" {
		app, err := s.apps.FindByID(ctx, iv.ApplicationID)
		if err != nil {
			return err
		}
		if err := s.validateOwnership(ctx, userID, app.JobID); err != nil {
			return err
		}
	}
	return s.repo.Delete(ctx, id)
}

func (s *interviewService) validateOwnership(ctx context.Context, userID, jobID string) error {
	rec, err := s.recruiters.FindByUserID(ctx, userID)
	if err != nil {
		return fmt.Errorf("recruiter: %w", err)
	}
	job, err := s.jobs.FindByID(ctx, jobID)
	if err != nil {
		return fmt.Errorf("job: %w", err)
	}
	if job.CompanyID != rec.CompanyID && (job.RecruiterID == nil || *job.RecruiterID != rec.ID) {
		return fmt.Errorf("not authorized for this job")
	}
	return nil
}
