package applications

import "context"

// ApplicationRepository defines the data-access contract for the applications table.
type ApplicationRepository interface {
	Create(ctx context.Context, app *Application) error
	FindByID(ctx context.Context, id string) (*Application, error)
	FindByJobAndCandidate(ctx context.Context, jobID, candidateID string) (*Application, error)
	ListByCandidateID(ctx context.Context, candidateID string, limit, offset int) ([]Application, error)
	ListByJobID(ctx context.Context, jobID string, limit, offset int) ([]Application, error)
	UpdateStatus(ctx context.Context, id, status string) error
}
