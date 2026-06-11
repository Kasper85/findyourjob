package certifications

import "context"

type CertificationRepository interface {
	Create(ctx context.Context, cert *Certification) error
	FindByID(ctx context.Context, id string) (*Certification, error)
	ListByCandidateID(ctx context.Context, candidateID string, limit, offset int) ([]Certification, error)
	List(ctx context.Context, limit, offset int) ([]Certification, error)
	Update(ctx context.Context, cert *Certification) error
	UpdateVerified(ctx context.Context, id string, verified bool) (*Certification, error)
	Delete(ctx context.Context, id string) error
}
