package interviews

import "context"

type InterviewRepository interface {
	Create(ctx context.Context, iv *Interview) error
	FindByID(ctx context.Context, id string) (*Interview, error)
	ListByCandidateID(ctx context.Context, candidateID string, limit, offset int) ([]Interview, error)
	ListByRecruiterID(ctx context.Context, recruiterID string, limit, offset int) ([]Interview, error)
	ListByJobID(ctx context.Context, jobID string, limit, offset int) ([]Interview, error)
	Update(ctx context.Context, iv *Interview) error
	UpdateStatus(ctx context.Context, id, status string) (*Interview, error)
	Delete(ctx context.Context, id string) error
}
