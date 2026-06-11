package evaluations

import "context"

// EvaluationRepository defines the data-access contract for evaluations.
type EvaluationRepository interface {
	Create(ctx context.Context, eval *Evaluation) error
	FindByID(ctx context.Context, id string) (*Evaluation, error)
	List(ctx context.Context, filter EvaluationListFilter) ([]Evaluation, error)
	Update(ctx context.Context, eval *Evaluation) error
	Delete(ctx context.Context, id string) error
}

// EvaluationResultRepository defines the data-access contract for results.
type EvaluationResultRepository interface {
	Create(ctx context.Context, result *EvaluationResult) error
	FindByID(ctx context.Context, id string) (*EvaluationResult, error)
	FindByEvaluationAndCandidate(ctx context.Context, evalID, candidateID string) (*EvaluationResult, error)
	ListByCandidateID(ctx context.Context, candidateID string, limit, offset int) ([]EvaluationResult, error)
	ListByEvaluationID(ctx context.Context, evalID string, limit, offset int) ([]EvaluationResult, error)
}
