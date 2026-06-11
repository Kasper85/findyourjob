package auth

import "errors"

// Domain errors for the auth module.
var (
	// ErrInvalidCredentials is returned when login email/password don't match.
	ErrInvalidCredentials = errors.New("invalid credentials")

	// ErrInactiveUser is returned when an inactive user attempts to log in.
	ErrInactiveUser = errors.New("user account is inactive")

	// ErrInvalidToken is returned when a JWT cannot be validated.
	ErrInvalidToken = errors.New("invalid or expired token")
)
