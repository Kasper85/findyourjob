package applications

import "time"

// Application represents a row in the applications table.
type Application struct {
	ID                string     `json:"id"`
	JobID             string     `json:"job_id"`
	CandidateID       string     `json:"candidate_id"`
	Status            string     `json:"status"`
	CoverLetter       *string    `json:"cover_letter,omitempty"`
	ResumeSnapshotURL *string    `json:"resume_snapshot_url,omitempty"`
	AppliedAt         *time.Time `json:"applied_at,omitempty"`
	ReviewedAt        *time.Time `json:"reviewed_at,omitempty"`
	Notes             *string    `json:"notes,omitempty"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

// CreateApplicationInput is the payload for applying to a job.
type CreateApplicationInput struct {
	CoverLetter       *string `json:"cover_letter,omitempty"`
	ResumeSnapshotURL *string `json:"resume_snapshot_url,omitempty"`
}

// UpdateStatusInput is the payload for changing an application's status.
type UpdateStatusInput struct {
	Status string `json:"status" binding:"required"`
}

// Valid application statuses.
var validApplicationStatuses = map[string]bool{
	"pending": true, "reviewed": true, "shortlisted": true,
	"rejected": true, "offered": true, "accepted": true, "withdrawn": true,
}

// ApplicationResponse is the public API representation of an application.
type ApplicationResponse struct {
	Application   Application `json:"application"`
	JobTitle      *string     `json:"job_title,omitempty"`
	CandidateName *string     `json:"candidate_name,omitempty"`
}
