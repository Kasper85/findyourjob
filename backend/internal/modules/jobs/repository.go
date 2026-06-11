package jobs

import "context"

// JobRepository defines the data-access contract for the jobs table.
type JobRepository interface {
	Create(ctx context.Context, job *Job) error
	FindByID(ctx context.Context, id string) (*Job, error)
	List(ctx context.Context, filter JobListFilter) ([]Job, error)
	Update(ctx context.Context, job *Job) error
	Delete(ctx context.Context, id string) error

	// Skills
	AddSkill(ctx context.Context, js *JobSkill) error
	RemoveSkill(ctx context.Context, jobID, skillID string) error
	ListSkillsByJobID(ctx context.Context, jobID string) ([]JobSkill, error)
}
