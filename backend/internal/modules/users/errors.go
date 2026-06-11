package users

import "errors"

// Domain errors for the users module.
var (
	// ErrUserNotFound is returned when a user does not exist.
	ErrUserNotFound = errors.New("user not found")

	// ErrEmailAlreadyExists is returned when trying to create a user
	// with an email that already exists in the database.
	ErrEmailAlreadyExists = errors.New("email already exists")

	// ErrProfileNotFound is returned when a candidate profile does not exist.
	ErrProfileNotFound = errors.New("candidate profile not found")

	// ErrRecruiterNotFound is returned when a recruiter does not exist.
	ErrRecruiterNotFound = errors.New("recruiter not found")

	// ErrInvalidExperienceYears is returned when experience_years is negative.
	ErrInvalidExperienceYears = errors.New("experience_years must be >= 0")

	// ErrInvalidSalary is returned when salary values are negative.
	ErrInvalidSalary = errors.New("salary values must be >= 0")

	// ErrSalaryRangeInvalid is returned when salary_max < salary_min.
	ErrSalaryRangeInvalid = errors.New("salary_max must be >= salary_min")
)
