package evaluations

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/lib/pq"
)

// ── PostgresEvaluationRepo ──────────────────────────

type PostgresEvaluationRepo struct {
	db *sql.DB
}

func NewPostgresEvaluationRepo(db *sql.DB) *PostgresEvaluationRepo {
	return &PostgresEvaluationRepo{db: db}
}

func (r *PostgresEvaluationRepo) Create(ctx context.Context, eval *Evaluation) error {
	const query = `
		INSERT INTO evaluations (title, description, type, duration_minutes, passing_score, max_score, created_by, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRowContext(ctx, query,
		eval.Title, eval.Description, eval.Type,
		eval.DurationMinutes, eval.PassingScore, eval.MaxScore,
		eval.CreatedBy, eval.IsActive,
	).Scan(&eval.ID, &eval.CreatedAt, &eval.UpdatedAt)
}

func (r *PostgresEvaluationRepo) FindByID(ctx context.Context, id string) (*Evaluation, error) {
	const query = `
		SELECT id, title, description, type, duration_minutes, passing_score, max_score, created_by, is_active, created_at, updated_at
		FROM evaluations WHERE id = $1
	`
	return scanEvaluation(r.db.QueryRowContext(ctx, query, id))
}

func (r *PostgresEvaluationRepo) List(ctx context.Context, filter EvaluationListFilter) ([]Evaluation, error) {
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}
	if filter.Offset < 0 {
		filter.Offset = 0
	}

	var conds []string
	var args []interface{}
	idx := 1

	if filter.Type != nil && *filter.Type != "" {
		conds = append(conds, fmt.Sprintf("type = $%d", idx))
		args = append(args, *filter.Type)
		idx++
	}
	if filter.IsActive != nil {
		conds = append(conds, fmt.Sprintf("is_active = $%d", idx))
		args = append(args, *filter.IsActive)
		idx++
	}
	if filter.CreatedBy != nil && *filter.CreatedBy != "" {
		conds = append(conds, fmt.Sprintf("created_by = $%d", idx))
		args = append(args, *filter.CreatedBy)
		idx++
	}

	where := ""
	if len(conds) > 0 {
		where = "WHERE " + strings.Join(conds, " AND ")
	}

	query := fmt.Sprintf(`
		SELECT id, title, description, type, duration_minutes, passing_score, max_score, created_by, is_active, created_at, updated_at
		FROM evaluations %s ORDER BY created_at DESC LIMIT $%d OFFSET $%d
	`, where, idx, idx+1)
	args = append(args, filter.Limit, filter.Offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("list evaluations: %w", err)
	}
	defer rows.Close()

	var evals []Evaluation
	for rows.Next() {
		e, err := scanEvaluationRow(rows)
		if err != nil {
			return nil, err
		}
		evals = append(evals, *e)
	}
	return evals, rows.Err()
}

func (r *PostgresEvaluationRepo) Update(ctx context.Context, eval *Evaluation) error {
	const query = `
		UPDATE evaluations
		SET title = $2, description = $3, type = $4, duration_minutes = $5,
		    passing_score = $6, max_score = $7, is_active = $8, updated_at = NOW()
		WHERE id = $1 RETURNING updated_at
	`
	err := r.db.QueryRowContext(ctx, query,
		eval.ID, eval.Title, eval.Description, eval.Type,
		eval.DurationMinutes, eval.PassingScore, eval.MaxScore, eval.IsActive,
	).Scan(&eval.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return ErrEvaluationNotFound
	}
	return err
}

func (r *PostgresEvaluationRepo) Delete(ctx context.Context, id string) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM evaluations WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete evaluation: %w", err)
	}
	if rows, _ := result.RowsAffected(); rows == 0 {
		return ErrEvaluationNotFound
	}
	return nil
}

// ── PostgresEvaluationResultRepo ────────────────────

type PostgresEvaluationResultRepo struct {
	db *sql.DB
}

func NewPostgresEvaluationResultRepo(db *sql.DB) *PostgresEvaluationResultRepo {
	return &PostgresEvaluationResultRepo{db: db}
}

func (r *PostgresEvaluationResultRepo) Create(ctx context.Context, result *EvaluationResult) error {
	const query = `
		INSERT INTO evaluation_results (evaluation_id, candidate_id, score, passed, answers, feedback, taken_at, completed_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
		RETURNING id, taken_at, completed_at, created_at, updated_at
	`
	err := r.db.QueryRowContext(ctx, query,
		result.EvaluationID, result.CandidateID, result.Score,
		result.Passed, result.Answers, result.Feedback,
	).Scan(&result.ID, &result.TakenAt, &result.CompletedAt, &result.CreatedAt, &result.UpdatedAt)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrAlreadySubmitted
		}
		return fmt.Errorf("create result: %w", err)
	}
	return nil
}

func (r *PostgresEvaluationResultRepo) FindByID(ctx context.Context, id string) (*EvaluationResult, error) {
	const query = `
		SELECT id, evaluation_id, candidate_id, score, passed, answers, feedback, taken_at, completed_at, created_at, updated_at
		FROM evaluation_results WHERE id = $1
	`
	return scanResult(r.db.QueryRowContext(ctx, query, id))
}

func (r *PostgresEvaluationResultRepo) FindByEvaluationAndCandidate(ctx context.Context, evalID, candidateID string) (*EvaluationResult, error) {
	const query = `
		SELECT id, evaluation_id, candidate_id, score, passed, answers, feedback, taken_at, completed_at, created_at, updated_at
		FROM evaluation_results WHERE evaluation_id = $1 AND candidate_id = $2
	`
	return scanResult(r.db.QueryRowContext(ctx, query, evalID, candidateID))
}

func (r *PostgresEvaluationResultRepo) ListByCandidateID(ctx context.Context, candidateID string, limit, offset int) ([]EvaluationResult, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	const query = `
		SELECT id, evaluation_id, candidate_id, score, passed, answers, feedback, taken_at, completed_at, created_at, updated_at
		FROM evaluation_results WHERE candidate_id = $1 ORDER BY taken_at DESC LIMIT $2 OFFSET $3
	`
	rows, err := r.db.QueryContext(ctx, query, candidateID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list results by candidate: %w", err)
	}
	defer rows.Close()
	return scanResults(rows)
}

func (r *PostgresEvaluationResultRepo) ListByEvaluationID(ctx context.Context, evalID string, limit, offset int) ([]EvaluationResult, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	const query = `
		SELECT id, evaluation_id, candidate_id, score, passed, answers, feedback, taken_at, completed_at, created_at, updated_at
		FROM evaluation_results WHERE evaluation_id = $1 ORDER BY score DESC LIMIT $2 OFFSET $3
	`
	rows, err := r.db.QueryContext(ctx, query, evalID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list results by evaluation: %w", err)
	}
	defer rows.Close()
	return scanResults(rows)
}

// ── Scanners ────────────────────────────────────────

func scanEvaluation(row *sql.Row) (*Evaluation, error) {
	var (
		e               Evaluation
		description     sql.NullString
		durationMinutes sql.NullInt64
		passingScore    sql.NullFloat64
		maxScore        sql.NullFloat64
		createdBy       sql.NullString
	)
	err := row.Scan(&e.ID, &e.Title, &description, &e.Type,
		&durationMinutes, &passingScore, &maxScore, &createdBy, &e.IsActive,
		&e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrEvaluationNotFound
		}
		return nil, fmt.Errorf("scan evaluation: %w", err)
	}
	e.Description = ns(description)
	e.DurationMinutes = ni(durationMinutes)
	e.PassingScore = nf(passingScore)
	e.MaxScore = nf(maxScore)
	e.CreatedBy = ns(createdBy)
	return &e, nil
}

func scanEvaluationRow(rows *sql.Rows) (*Evaluation, error) {
	var (
		e               Evaluation
		description     sql.NullString
		durationMinutes sql.NullInt64
		passingScore    sql.NullFloat64
		maxScore        sql.NullFloat64
		createdBy       sql.NullString
	)
	err := rows.Scan(&e.ID, &e.Title, &description, &e.Type,
		&durationMinutes, &passingScore, &maxScore, &createdBy, &e.IsActive,
		&e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("scan evaluation row: %w", err)
	}
	e.Description = ns(description)
	e.DurationMinutes = ni(durationMinutes)
	e.PassingScore = nf(passingScore)
	e.MaxScore = nf(maxScore)
	e.CreatedBy = ns(createdBy)
	return &e, nil
}

func scanResult(row *sql.Row) (*EvaluationResult, error) {
	var (
		r           EvaluationResult
		passed      sql.NullBool
		answers     sql.NullString
		feedback    sql.NullString
		takenAt     sql.NullTime
		completedAt sql.NullTime
	)
	err := row.Scan(&r.ID, &r.EvaluationID, &r.CandidateID, &r.Score,
		&passed, &answers, &feedback, &takenAt, &completedAt,
		&r.CreatedAt, &r.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrResultNotFound
		}
		return nil, fmt.Errorf("scan result: %w", err)
	}
	r.Passed = nb(passed)
	r.Answers = ns(answers)
	r.Feedback = ns(feedback)
	r.TakenAt = nt2(takenAt)
	r.CompletedAt = nt2(completedAt)
	return &r, nil
}

func scanResults(rows *sql.Rows) ([]EvaluationResult, error) {
	var results []EvaluationResult
	for rows.Next() {
		var (
			r           EvaluationResult
			passed      sql.NullBool
			answers     sql.NullString
			feedback    sql.NullString
			takenAt     sql.NullTime
			completedAt sql.NullTime
		)
		err := rows.Scan(&r.ID, &r.EvaluationID, &r.CandidateID, &r.Score,
			&passed, &answers, &feedback, &takenAt, &completedAt,
			&r.CreatedAt, &r.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("scan result row: %w", err)
		}
		r.Passed = nb(passed)
		r.Answers = ns(answers)
		r.Feedback = ns(feedback)
		r.TakenAt = nt2(takenAt)
		r.CompletedAt = nt2(completedAt)
		results = append(results, r)
	}
	return results, rows.Err()
}

// ── Helpers ─────────────────────────────────────────

func ns(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}
func ni(ni sql.NullInt64) *int {
	if ni.Valid {
		v := int(ni.Int64)
		return &v
	}
	return nil
}
func nf(nf sql.NullFloat64) *float64 {
	if nf.Valid {
		return &nf.Float64
	}
	return nil
}
func nb(nb sql.NullBool) *bool {
	if nb.Valid {
		return &nb.Bool
	}
	return nil
}
func nt2(nt sql.NullTime) *time.Time {
	if nt.Valid {
		return &nt.Time
	}
	return nil
}

func isUniqueViolation(err error) bool {
	var pqErr *pq.Error
	if errors.As(err, &pqErr) {
		return pqErr.Code == "23505"
	}
	return false
}
