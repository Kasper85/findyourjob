package users

import "time"

// User represents a row in the users table.
type User struct {
	ID           string    `json:"id"            db:"id"`
	Email        string    `json:"email"         db:"email"`
	PasswordHash string    `json:"-"             db:"password_hash"`
	Role         string    `json:"role"          db:"role"`
	Name         string    `json:"name"          db:"name"`
	IsActive     bool      `json:"is_active"     db:"is_active"`
	CreatedAt    time.Time `json:"created_at"    db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"    db:"updated_at"`
}

// CandidateProfile represents a row in the candidate_profiles table.
type CandidateProfile struct {
	ID                string    `json:"id"                 db:"id"`
	UserID            string    `json:"user_id"            db:"user_id"`
	Phone             *string   `json:"phone,omitempty"    db:"phone"`
	Location          *string   `json:"location,omitempty" db:"location"`
	Summary           *string   `json:"summary,omitempty"  db:"summary"`
	ExperienceYears   int       `json:"experience_years"   db:"experience_years"`
	ResumeURL         *string   `json:"resume_url,omitempty"       db:"resume_url"`
	LinkedinURL       *string   `json:"linkedin_url,omitempty"     db:"linkedin_url"`
	GithubURL         *string   `json:"github_url,omitempty"       db:"github_url"`
	PortfolioURL      *string   `json:"portfolio_url,omitempty"    db:"portfolio_url"`
	PreferredRemote   bool      `json:"preferred_remote"   db:"preferred_remote"`
	PreferredLocation *string   `json:"preferred_location,omitempty" db:"preferred_location"`
	SalaryMin         *int      `json:"salary_min,omitempty"       db:"salary_min"`
	SalaryMax         *int      `json:"salary_max,omitempty"       db:"salary_max"`
	CreatedAt         time.Time `json:"created_at"         db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"         db:"updated_at"`
}

// Recruiter represents a row in the recruiters table.
type Recruiter struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	CompanyID string    `json:"company_id"`
	Position  *string   `json:"position,omitempty"`
	Phone     *string   `json:"phone,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// UpdateUserInput holds the fields allowed when updating a user profile.
type UpdateUserInput struct {
	Name              *string `json:"name,omitempty"`
	Phone             *string `json:"phone,omitempty"`
	Location          *string `json:"location,omitempty"`
	Summary           *string `json:"summary,omitempty"`
	LinkedinURL       *string `json:"linkedin_url,omitempty"`
	GithubURL         *string `json:"github_url,omitempty"`
	PortfolioURL      *string `json:"portfolio_url,omitempty"`
	PreferredRemote   *bool   `json:"preferred_remote,omitempty"`
	PreferredLocation *string `json:"preferred_location,omitempty"`
	SalaryMin         *int    `json:"salary_min,omitempty"`
	SalaryMax         *int    `json:"salary_max,omitempty"`
}

// UpdateProfileInput holds the fields allowed when updating a candidate profile.
type UpdateProfileInput struct {
	Location          *string `json:"location,omitempty"`
	Summary           *string `json:"summary,omitempty"`
	ExperienceYears   *int    `json:"experience_years,omitempty"`
	ResumeURL         *string `json:"resume_url,omitempty"`
	LinkedinURL       *string `json:"linkedin_url,omitempty"`
	GithubURL         *string `json:"github_url,omitempty"`
	PortfolioURL      *string `json:"portfolio_url,omitempty"`
	PreferredRemote   *bool   `json:"preferred_remote,omitempty"`
	PreferredLocation *string `json:"preferred_location,omitempty"`
	SalaryMin         *int    `json:"salary_min,omitempty"`
	SalaryMax         *int    `json:"salary_max,omitempty"`
}

// Validate returns an error if the input fails business rules.
func (i UpdateProfileInput) Validate() error {
	if i.ExperienceYears != nil && *i.ExperienceYears < 0 {
		return ErrInvalidExperienceYears
	}
	if i.SalaryMin != nil && *i.SalaryMin < 0 {
		return ErrInvalidSalary
	}
	if i.SalaryMax != nil && *i.SalaryMax < 0 {
		return ErrInvalidSalary
	}
	if i.SalaryMin != nil && i.SalaryMax != nil && *i.SalaryMax < *i.SalaryMin {
		return ErrSalaryRangeInvalid
	}
	return nil
}
