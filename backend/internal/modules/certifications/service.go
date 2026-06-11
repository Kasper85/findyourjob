package certifications

import (
	"context"
	"fmt"
	"net/url"
	"strings"

	"find-your-job/backend/internal/modules/users"
)

type CertificationService interface {
	Create(ctx context.Context, candidateID, userID, role string, input CreateCertificationInput) (*CertificationResponse, error)
	Get(ctx context.Context, id string) (*CertificationResponse, error)
	List(ctx context.Context, limit, offset int) (*CertificationListResponse, error)
	ListByCandidate(ctx context.Context, candidateID string, limit, offset int) (*CertificationListResponse, error)
	ListMine(ctx context.Context, userID string, limit, offset int) (*CertificationListResponse, error)
	Update(ctx context.Context, id, userID, role string, input UpdateCertificationInput) (*CertificationResponse, error)
	Verify(ctx context.Context, id, userID, role string, input VerifyCertificationInput) (*CertificationResponse, error)
	Delete(ctx context.Context, id, userID, role string) error
}

type CandidateProfileStore interface {
	FindByUserID(ctx context.Context, userID string) (*users.CandidateProfile, error)
}

type certificationService struct {
	repo       CertificationRepository
	candidates CandidateProfileStore
}

func NewService(repo CertificationRepository, candidates CandidateProfileStore) CertificationService {
	return &certificationService{repo: repo, candidates: candidates}
}

func (s *certificationService) Create(ctx context.Context, candidateID, userID, role string, input CreateCertificationInput) (*CertificationResponse, error) {
	_ = role
	if err := validateCreate(input); err != nil {
		return nil, err
	}
	// Resolve candidateID from userID if candidates store is available
	if candidateID == "" && s.candidates != nil {
		profile, err := s.candidates.FindByUserID(ctx, userID)
		if err != nil {
			return nil, fmt.Errorf("candidate profile not found")
		}
		candidateID = profile.ID
	}
	cert := &Certification{
		CandidateID:    candidateID,
		Name:           strings.TrimSpace(input.Name),
		Issuer:         strings.TrimSpace(input.Issuer),
		IssueDate:      input.IssueDate,
		ExpirationDate: input.ExpirationDate,
		CredentialID:   input.CredentialID,
		CredentialURL:  input.CredentialURL,
	}
	if err := s.repo.Create(ctx, cert); err != nil {
		return nil, fmt.Errorf("create certification: %w", err)
	}
	return &CertificationResponse{Certification: *cert}, nil
}

func (s *certificationService) Get(ctx context.Context, id string) (*CertificationResponse, error) {
	cert, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return &CertificationResponse{Certification: *cert}, nil
}

func (s *certificationService) List(ctx context.Context, limit, offset int) (*CertificationListResponse, error) {
	certs, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list certifications: %w", err)
	}
	if certs == nil {
		certs = []Certification{}
	}
	return &CertificationListResponse{Data: certs, Limit: limit, Offset: offset}, nil
}

func (s *certificationService) ListByCandidate(ctx context.Context, candidateID string, limit, offset int) (*CertificationListResponse, error) {
	certs, err := s.repo.ListByCandidateID(ctx, candidateID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by candidate: %w", err)
	}
	if certs == nil {
		certs = []Certification{}
	}
	return &CertificationListResponse{Data: certs, Limit: limit, Offset: offset}, nil
}

func (s *certificationService) ListMine(ctx context.Context, userID string, limit, offset int) (*CertificationListResponse, error) {
	if s.candidates == nil {
		return nil, fmt.Errorf("candidate profile store not configured")
	}
	profile, err := s.candidates.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("candidate profile not found")
	}
	return s.ListByCandidate(ctx, profile.ID, limit, offset)
}

func (s *certificationService) Update(ctx context.Context, id, userID, role string, input UpdateCertificationInput) (*CertificationResponse, error) {
	cert, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	// Ownership: candidate owns their certs, admin can modify any
	if role != "admin" && cert.CandidateID != id {
		if s.candidates == nil {
			return nil, fmt.Errorf("not authorized")
		}
		profile, err := s.candidates.FindByUserID(ctx, userID)
		if err != nil || profile.ID != cert.CandidateID {
			return nil, fmt.Errorf("not authorized to update this certification")
		}
	}
	// Only admin can change verified
	if input.Verified != nil && role != "admin" {
		return nil, fmt.Errorf("only admins can change verification status")
	}
	if input.Name != nil {
		cert.Name = strings.TrimSpace(*input.Name)
	}
	if input.Issuer != nil {
		cert.Issuer = strings.TrimSpace(*input.Issuer)
	}
	if input.IssueDate != nil {
		cert.IssueDate = input.IssueDate
	}
	if input.ExpirationDate != nil {
		cert.ExpirationDate = input.ExpirationDate
	}
	if input.CredentialID != nil {
		cert.CredentialID = input.CredentialID
	}
	if input.CredentialURL != nil {
		if _, err := url.ParseRequestURI(*input.CredentialURL); err != nil {
			return nil, fmt.Errorf("invalid credential_url")
		}
		cert.CredentialURL = input.CredentialURL
	}
	if input.Verified != nil {
		cert.Verified = *input.Verified
	}
	if err := s.repo.Update(ctx, cert); err != nil {
		return nil, fmt.Errorf("update certification: %w", err)
	}
	return &CertificationResponse{Certification: *cert}, nil
}

func (s *certificationService) Delete(ctx context.Context, id, userID, role string) error {
	cert, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if role != "admin" {
		if s.candidates == nil {
			return fmt.Errorf("not authorized")
		}
		profile, err := s.candidates.FindByUserID(ctx, userID)
		if err != nil || profile.ID != cert.CandidateID {
			return fmt.Errorf("not authorized to delete this certification")
		}
	}
	return s.repo.Delete(ctx, id)
}

func (s *certificationService) Verify(ctx context.Context, id, userID, role string, input VerifyCertificationInput) (*CertificationResponse, error) {
	if role != "admin" {
		return nil, fmt.Errorf("only admins can verify certifications")
	}
	_ = userID
	cert, err := s.repo.UpdateVerified(ctx, id, input.Verified)
	if err != nil {
		return nil, err
	}
	return &CertificationResponse{Certification: *cert}, nil
}

func validateCreate(input CreateCertificationInput) error {
	if strings.TrimSpace(input.Name) == "" {
		return fmt.Errorf("name is required")
	}
	if strings.TrimSpace(input.Issuer) == "" {
		return fmt.Errorf("issuer is required")
	}
	if input.CredentialURL != nil && *input.CredentialURL != "" {
		if _, err := url.ParseRequestURI(*input.CredentialURL); err != nil {
			return fmt.Errorf("invalid credential_url")
		}
	}
	return nil
}
