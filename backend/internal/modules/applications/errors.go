package applications

import "errors"

// Domain errors for the applications module.
var (
	ErrApplicationNotFound = errors.New("application not found")
	ErrAlreadyApplied      = errors.New("already applied to this job")
)
