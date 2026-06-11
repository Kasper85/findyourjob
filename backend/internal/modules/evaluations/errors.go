package evaluations

import "errors"

var (
	ErrEvaluationNotFound = errors.New("evaluation not found")
	ErrResultNotFound     = errors.New("evaluation result not found")
	ErrAlreadySubmitted   = errors.New("already submitted this evaluation")
)
