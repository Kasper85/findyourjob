package certifications

import "time"

// Certification represents a row in the certifications table.
type Certification struct {
	ID             string    `json:"id"`
	CandidateID    string    `json:"candidate_id"`
	Name           string    `json:"name"`
	Issuer         string    `json:"issuer"`
	IssueDate      *string   `json:"issue_date,omitempty"`
	ExpirationDate *string   `json:"expiration_date,omitempty"`
	CredentialID   *string   `json:"credential_id,omitempty"`
	CredentialURL  *string   `json:"credential_url,omitempty"`
	Verified       bool      `json:"verified"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type CreateCertificationInput struct {
	Name           string  `json:"name"            binding:"required"`
	Issuer         string  `json:"issuer"          binding:"required"`
	IssueDate      *string `json:"issue_date,omitempty"`
	ExpirationDate *string `json:"expiration_date,omitempty"`
	CredentialID   *string `json:"credential_id,omitempty"`
	CredentialURL  *string `json:"credential_url,omitempty"`
}

type UpdateCertificationInput struct {
	Name           *string `json:"name,omitempty"`
	Issuer         *string `json:"issuer,omitempty"`
	IssueDate      *string `json:"issue_date,omitempty"`
	ExpirationDate *string `json:"expiration_date,omitempty"`
	CredentialID   *string `json:"credential_id,omitempty"`
	CredentialURL  *string `json:"credential_url,omitempty"`
	Verified       *bool   `json:"verified,omitempty"`
}

type VerifyCertificationInput struct {
	Verified bool `json:"verified" binding:"required"`
}

type CertificationResponse struct {
	Certification Certification `json:"certification"`
}

type CertificationListResponse struct {
	Data   []Certification `json:"data"`
	Limit  int             `json:"limit"`
	Offset int             `json:"offset"`
}
