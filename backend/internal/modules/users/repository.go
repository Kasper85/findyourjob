package users

import "context"

// UserRepository defines the data-access contract for the users table.
//
// The concrete implementation will use database/sql (or sqlx) to query PostgreSQL.
type UserRepository interface {
	Create(ctx context.Context, user *User) error
	FindByID(ctx context.Context, id string) (*User, error)
	FindByEmail(ctx context.Context, email string) (*User, error)
	Update(ctx context.Context, user *User) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, limit, offset int) ([]User, error)
}

// CandidateProfileRepository defines the data-access contract for
// the candidate_profiles table (1:1 extension of users).
type CandidateProfileRepository interface {
	Create(ctx context.Context, profile *CandidateProfile) error
	FindByID(ctx context.Context, id string) (*CandidateProfile, error)
	FindByUserID(ctx context.Context, userID string) (*CandidateProfile, error)
	Update(ctx context.Context, profile *CandidateProfile) error
}

// RecruiterRepository defines the data-access contract for the recruiters table.
type RecruiterRepository interface {
	FindByUserID(ctx context.Context, userID string) (*Recruiter, error)
}
