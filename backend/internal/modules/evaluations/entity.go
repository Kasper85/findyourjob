package evaluations

import (
	"fmt"
	"time"
)

// ── Evaluation ──────────────────────────────────────

// Evaluation represents a row in the evaluations table.
type Evaluation struct {
	ID              string    `json:"id"`
	Title           string    `json:"title"`
	Description     *string   `json:"description,omitempty"`
	Type            string    `json:"type"`
	DurationMinutes *int      `json:"duration_minutes,omitempty"`
	PassingScore    *float64  `json:"passing_score,omitempty"`
	MaxScore        *float64  `json:"max_score,omitempty"`
	CreatedBy       *string   `json:"created_by,omitempty"`
	IsActive        bool      `json:"is_active"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// CreateEvaluationInput is the payload for creating a new evaluation.
type CreateEvaluationInput struct {
	Title           string   `json:"title"            binding:"required"`
	Description     *string  `json:"description,omitempty"`
	Type            string   `json:"type"             binding:"required"`
	DurationMinutes *int     `json:"duration_minutes,omitempty"`
	PassingScore    *float64 `json:"passing_score,omitempty"`
	MaxScore        *float64 `json:"max_score,omitempty"`
}

func (i CreateEvaluationInput) Validate() error {
	if i.Title == "" {
		return fmt.Errorf("title is required")
	}
	if !validEvaluationTypes[i.Type] {
		return fmt.Errorf("invalid type: must be one of technical_test, soft_skills, language, personality, custom")
	}
	if i.DurationMinutes != nil && *i.DurationMinutes < 0 {
		return fmt.Errorf("duration_minutes must be >= 0")
	}
	if i.MaxScore != nil && *i.MaxScore <= 0 {
		return fmt.Errorf("max_score must be > 0")
	}
	if i.PassingScore != nil && *i.PassingScore < 0 {
		return fmt.Errorf("passing_score must be >= 0")
	}
	if i.PassingScore != nil && i.MaxScore != nil && *i.PassingScore > *i.MaxScore {
		return fmt.Errorf("passing_score must be <= max_score")
	}
	return nil
}

// UpdateEvaluationInput is the payload for updating an evaluation.
type UpdateEvaluationInput struct {
	Title           *string  `json:"title,omitempty"`
	Description     *string  `json:"description,omitempty"`
	Type            *string  `json:"type,omitempty"`
	DurationMinutes *int     `json:"duration_minutes,omitempty"`
	PassingScore    *float64 `json:"passing_score,omitempty"`
	MaxScore        *float64 `json:"max_score,omitempty"`
	IsActive        *bool    `json:"is_active,omitempty"`
}

// EvaluationResponse is the public API representation of an evaluation.
type EvaluationResponse struct {
	Evaluation Evaluation `json:"evaluation"`
}

// EvaluationListFilter holds optional filters for listing evaluations.
type EvaluationListFilter struct {
	Type      *string `form:"type"`
	IsActive  *bool   `form:"is_active"`
	CreatedBy *string `form:"created_by"`
	Limit     int     `form:"limit"`
	Offset    int     `form:"offset"`
}

// ── Evaluation Result ───────────────────────────────

// EvaluationResult represents a row in the evaluation_results table.
type EvaluationResult struct {
	ID           string     `json:"id"`
	EvaluationID string     `json:"evaluation_id"`
	CandidateID  string     `json:"candidate_id"`
	Score        float64    `json:"score"`
	Passed       *bool      `json:"passed,omitempty"`
	Answers      *string    `json:"answers,omitempty"`
	Feedback     *string    `json:"feedback,omitempty"`
	TakenAt      *time.Time `json:"taken_at,omitempty"`
	CompletedAt  *time.Time `json:"completed_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// SubmitEvaluationResultInput is the payload for submitting a result.
type SubmitEvaluationResultInput struct {
	Score   float64 `json:"score"    binding:"required"`
	Answers *string `json:"answers,omitempty"`
}

// EvaluationResultResponse is the public API representation of a result.
type EvaluationResultResponse struct {
	Result          EvaluationResult `json:"result"`
	EvaluationTitle *string          `json:"evaluation_title,omitempty"`
	CandidateName   *string          `json:"candidate_name,omitempty"`
}

// EvaluationResultListFilter holds optional filters.
type EvaluationResultListFilter struct {
	Limit  int `form:"limit"`
	Offset int `form:"offset"`
}

// ── Valid types ─────────────────────────────────────

var validEvaluationTypes = map[string]bool{
	"technical_test": true, "soft_skills": true, "language": true,
	"personality": true, "custom": true,
}
