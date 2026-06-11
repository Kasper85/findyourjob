package evaluations

import (
	"context"
	"fmt"
	"strings"

	"find-your-job/backend/internal/modules/users"

	"github.com/google/uuid"
)

// EvaluationService defines the business-logic contract.
type EvaluationService interface {
	CreateEvaluation(ctx context.Context, userID, role string, input CreateEvaluationInput) (*EvaluationResponse, error)
	GetEvaluation(ctx context.Context, id string) (*EvaluationResponse, error)
	ListEvaluations(ctx context.Context, filter EvaluationListFilter) (*EvaluationListResponse, error)
	UpdateEvaluation(ctx context.Context, userID, role, id string, input UpdateEvaluationInput) (*EvaluationResponse, error)
	DeleteEvaluation(ctx context.Context, userID, role, id string) error

	SubmitResult(ctx context.Context, userID, evalID string, input SubmitEvaluationResultInput) (*EvaluationResultResponse, error)
	ListMyResults(ctx context.Context, userID string, limit, offset int) (*ResultListResponse, error)
	ListEvaluationResults(ctx context.Context, userID, role, evalID string, limit, offset int) (*ResultListResponse, error)
}

// CandidateProfileStore is the minimal interface for looking up candidate profiles.
type CandidateProfileStore interface {
	FindByUserID(ctx context.Context, userID string) (*users.CandidateProfile, error)
}

type EvaluationListResponse struct {
	Data   []EvaluationResponse `json:"data"`
	Limit  int                  `json:"limit"`
	Offset int                  `json:"offset"`
}

type ResultListResponse struct {
	Data   []EvaluationResultResponse `json:"data"`
	Limit  int                        `json:"limit"`
	Offset int                        `json:"offset"`
}

type evaluationService struct {
	repo       EvaluationRepository
	resultRepo EvaluationResultRepository
	candidates CandidateProfileStore
}

func NewService(repo EvaluationRepository, resultRepo EvaluationResultRepository, candidates CandidateProfileStore) EvaluationService {
	return &evaluationService{repo: repo, resultRepo: resultRepo, candidates: candidates}
}

func (s *evaluationService) ListEvaluations(ctx context.Context, filter EvaluationListFilter) (*EvaluationListResponse, error) {
	evals, err := s.repo.List(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("list evaluations: %w", err)
	}
	if evals == nil {
		evals = []Evaluation{}
	}
	responses := make([]EvaluationResponse, len(evals))
	for i, e := range evals {
		responses[i] = EvaluationResponse{Evaluation: e}
	}
	return &EvaluationListResponse{Data: responses, Limit: filter.Limit, Offset: filter.Offset}, nil
}

func (s *evaluationService) GetEvaluation(ctx context.Context, id string) (*EvaluationResponse, error) {
	if _, err := uuid.Parse(id); err != nil {
		return nil, fmt.Errorf("%w: invalid evaluation id", ErrEvaluationNotFound)
	}
	eval, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return &EvaluationResponse{Evaluation: *eval}, nil
}

func (s *evaluationService) CreateEvaluation(ctx context.Context, userID, role string, input CreateEvaluationInput) (*EvaluationResponse, error) {
	if role != "recruiter" && role != "admin" {
		return nil, fmt.Errorf("only recruiters and admins can create evaluations")
	}
	if err := input.Validate(); err != nil {
		return nil, err
	}
	eval := &Evaluation{
		Title:       strings.TrimSpace(input.Title),
		Description: input.Description,
		Type:        input.Type,
		CreatedBy:   &userID,
		IsActive:    true,
	}
	if input.DurationMinutes != nil {
		eval.DurationMinutes = input.DurationMinutes
	}
	if input.PassingScore != nil {
		eval.PassingScore = input.PassingScore
	}
	if input.MaxScore != nil {
		eval.MaxScore = input.MaxScore
	}
	if err := s.repo.Create(ctx, eval); err != nil {
		return nil, fmt.Errorf("create evaluation: %w", err)
	}
	return &EvaluationResponse{Evaluation: *eval}, nil
}

func (s *evaluationService) UpdateEvaluation(ctx context.Context, userID, role, id string, input UpdateEvaluationInput) (*EvaluationResponse, error) {
	eval, err := s.authorizeModify(ctx, userID, role, id)
	if err != nil {
		return nil, err
	}
	if input.Title != nil {
		eval.Title = strings.TrimSpace(*input.Title)
	}
	if input.Description != nil {
		eval.Description = input.Description
	}
	if input.Type != nil {
		if !validEvaluationTypes[*input.Type] {
			return nil, fmt.Errorf("invalid type")
		}
		eval.Type = *input.Type
	}
	if input.DurationMinutes != nil {
		if *input.DurationMinutes < 0 {
			return nil, fmt.Errorf("duration_minutes must be >= 0")
		}
		eval.DurationMinutes = input.DurationMinutes
	}
	if input.PassingScore != nil {
		if *input.PassingScore < 0 {
			return nil, fmt.Errorf("passing_score must be >= 0")
		}
		eval.PassingScore = input.PassingScore
	}
	if input.MaxScore != nil {
		if *input.MaxScore <= 0 {
			return nil, fmt.Errorf("max_score must be > 0")
		}
		eval.MaxScore = input.MaxScore
	}
	if eval.PassingScore != nil && eval.MaxScore != nil && *eval.PassingScore > *eval.MaxScore {
		return nil, fmt.Errorf("passing_score must be <= max_score")
	}
	if input.IsActive != nil {
		eval.IsActive = *input.IsActive
	}
	if err := s.repo.Update(ctx, eval); err != nil {
		return nil, fmt.Errorf("update evaluation: %w", err)
	}
	return &EvaluationResponse{Evaluation: *eval}, nil
}

func (s *evaluationService) DeleteEvaluation(ctx context.Context, userID, role, id string) error {
	if _, err := s.authorizeModify(ctx, userID, role, id); err != nil {
		return err
	}
	return s.repo.Delete(ctx, id)
}

// SubmitResult records a candidate's evaluation result.
func (s *evaluationService) SubmitResult(ctx context.Context, userID, evalID string, input SubmitEvaluationResultInput) (*EvaluationResultResponse, error) {
	// Look up candidate profile
	profile, err := s.candidates.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("candidate profile: %w", err)
	}

	// Validate evaluation
	eval, err := s.repo.FindByID(ctx, evalID)
	if err != nil {
		return nil, err
	}
	if !eval.IsActive {
		return nil, fmt.Errorf("cannot submit to an inactive evaluation")
	}

	// Validate score
	if input.Score < 0 {
		return nil, fmt.Errorf("score must be >= 0")
	}
	if eval.MaxScore != nil && input.Score > *eval.MaxScore {
		return nil, fmt.Errorf("score must be <= max_score (%v)", *eval.MaxScore)
	}

	// Calculate passed
	var passed *bool
	if eval.PassingScore != nil {
		p := input.Score >= *eval.PassingScore
		passed = &p
	}

	result := &EvaluationResult{
		EvaluationID: evalID,
		CandidateID:  profile.ID,
		Score:        input.Score,
		Passed:       passed,
		Answers:      input.Answers,
	}

	if err := s.resultRepo.Create(ctx, result); err != nil {
		return nil, err
	}

	return &EvaluationResultResponse{
		Result:          *result,
		EvaluationTitle: &eval.Title,
	}, nil
}

func (s *evaluationService) ListMyResults(ctx context.Context, userID string, limit, offset int) (*ResultListResponse, error) {
	profile, err := s.candidates.FindByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("candidate profile: %w", err)
	}

	results, err := s.resultRepo.ListByCandidateID(ctx, profile.ID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list my results: %w", err)
	}
	if results == nil {
		results = []EvaluationResult{}
	}

	responses := make([]EvaluationResultResponse, len(results))
	for i, r := range results {
		responses[i] = EvaluationResultResponse{Result: r}
		if eval, err := s.repo.FindByID(ctx, r.EvaluationID); err == nil {
			responses[i].EvaluationTitle = &eval.Title
		}
	}

	return &ResultListResponse{Data: responses, Limit: limit, Offset: offset}, nil
}

func (s *evaluationService) ListEvaluationResults(ctx context.Context, userID, role, evalID string, limit, offset int) (*ResultListResponse, error) {
	if role != "recruiter" && role != "admin" {
		return nil, fmt.Errorf("only recruiters and admins can view results")
	}

	eval, err := s.repo.FindByID(ctx, evalID)
	if err != nil {
		return nil, err
	}

	if role == "recruiter" && (eval.CreatedBy == nil || *eval.CreatedBy != userID) {
		return nil, fmt.Errorf("not authorized to view results for this evaluation")
	}

	results, err := s.resultRepo.ListByEvaluationID(ctx, evalID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list evaluation results: %w", err)
	}
	if results == nil {
		results = []EvaluationResult{}
	}

	responses := make([]EvaluationResultResponse, len(results))
	for i, r := range results {
		responses[i] = EvaluationResultResponse{Result: r}
	}

	return &ResultListResponse{Data: responses, Limit: limit, Offset: offset}, nil
}

func (s *evaluationService) authorizeModify(ctx context.Context, userID, role, id string) (*Evaluation, error) {
	if role != "recruiter" && role != "admin" {
		return nil, fmt.Errorf("only recruiters and admins can modify evaluations")
	}
	eval, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if role == "recruiter" && (eval.CreatedBy == nil || *eval.CreatedBy != userID) {
		return nil, fmt.Errorf("not authorized to modify this evaluation")
	}
	return eval, nil
}
