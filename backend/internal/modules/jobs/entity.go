package jobs

import (
	"fmt"
	"time"
)

// Job represents a row in the jobs table.
type Job struct {
	ID               string     `json:"id"`
	CompanyID        string     `json:"company_id"`
	RecruiterID      *string    `json:"recruiter_id,omitempty"`
	Title            string     `json:"title"`
	Description      *string    `json:"description,omitempty"`
	Requirements     *string    `json:"requirements,omitempty"`
	Responsibilities *string    `json:"responsibilities,omitempty"`
	Location         *string    `json:"location,omitempty"`
	IsRemote         bool       `json:"is_remote"`
	SalaryMin        *int       `json:"salary_min,omitempty"`
	SalaryMax        *int       `json:"salary_max,omitempty"`
	Currency         string     `json:"currency"`
	JobType          *string    `json:"job_type,omitempty"`
	Status           string     `json:"status"`
	PostedAt         *time.Time `json:"posted_at,omitempty"`
	ExpiresAt        *time.Time `json:"expires_at,omitempty"`
	ExternalURL      *string    `json:"external_url,omitempty"`
	Source           *string    `json:"source,omitempty"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
}

// JobSkill represents a row in the job_skills table.
type JobSkill struct {
	JobID      string `json:"job_id"`
	SkillID    string `json:"skill_id"`
	IsRequired bool   `json:"is_required"`
	Importance int    `json:"importance"`
}

// CreateJobInput is the payload for creating a new job.
type CreateJobInput struct {
	Title            string   `json:"title"             binding:"required"`
	Description      *string  `json:"description,omitempty"`
	Requirements     *string  `json:"requirements,omitempty"`
	Responsibilities *string  `json:"responsibilities,omitempty"`
	Location         *string  `json:"location,omitempty"`
	IsRemote         *bool    `json:"is_remote,omitempty"`
	SalaryMin        *int     `json:"salary_min,omitempty"`
	SalaryMax        *int     `json:"salary_max,omitempty"`
	Currency         *string  `json:"currency,omitempty"`
	JobType          *string  `json:"job_type,omitempty"`
	ExpiresAt        *string  `json:"expires_at,omitempty"`
	Source           *string  `json:"source,omitempty"`
	SkillIDs         []string `json:"skill_ids,omitempty"`
}

// Valid job types.
var validJobTypes = map[string]bool{
	"full_time": true, "part_time": true, "contract": true, "freelance": true, "internship": true,
}

// Validate checks the input against business rules.
func (i CreateJobInput) Validate() error {
	if i.Title == "" {
		return fmt.Errorf("title is required")
	}
	if i.Description == nil || *i.Description == "" {
		return fmt.Errorf("description is required")
	}
	if i.JobType == nil || *i.JobType == "" {
		return fmt.Errorf("job_type is required")
	}
	if !validJobTypes[*i.JobType] {
		return fmt.Errorf("invalid job_type: must be one of full_time, part_time, contract, freelance, internship")
	}
	if i.SalaryMin != nil && *i.SalaryMin < 0 {
		return fmt.Errorf("salary_min must be >= 0")
	}
	if i.SalaryMax != nil && *i.SalaryMax < 0 {
		return fmt.Errorf("salary_max must be >= 0")
	}
	if i.SalaryMin != nil && i.SalaryMax != nil && *i.SalaryMax < *i.SalaryMin {
		return fmt.Errorf("salary_max must be >= salary_min")
	}
	return nil
}

// UpdateJobInput is the payload for updating an existing job.
type UpdateJobInput struct {
	Title            *string `json:"title,omitempty"`
	Description      *string `json:"description,omitempty"`
	Requirements     *string `json:"requirements,omitempty"`
	Responsibilities *string `json:"responsibilities,omitempty"`
	Location         *string `json:"location,omitempty"`
	IsRemote         *bool   `json:"is_remote,omitempty"`
	SalaryMin        *int    `json:"salary_min,omitempty"`
	SalaryMax        *int    `json:"salary_max,omitempty"`
	Currency         *string `json:"currency,omitempty"`
	JobType          *string `json:"job_type,omitempty"`
	Status           *string `json:"status,omitempty"`
	ExpiresAt        *string `json:"expires_at,omitempty"`
	Source           *string `json:"source,omitempty"`
}

// JobListFilter holds optional filters for listing jobs.
type JobListFilter struct {
	Status      *string `form:"status"`
	CompanyID   *string `form:"company_id"`
	RecruiterID *string `form:"recruiter_id"`
	JobType     *string `form:"job_type"`
	Location    *string `form:"location"`
	IsRemote    *bool   `form:"is_remote"`
	Search      *string `form:"search"`
	Limit       int     `form:"limit"`
	Offset      int     `form:"offset"`
}

// JobResponse is the public API representation of a job.
type JobResponse struct {
	Job    Job        `json:"job"`
	Skills []JobSkill `json:"skills,omitempty"`
}
