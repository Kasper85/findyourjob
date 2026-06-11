package jobs

import (
	"errors"
)

// Domain errors for the jobs module.
var (
	ErrJobNotFound = errors.New("job not found")
)
