package applications

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/lib/pq"
)

// PostgresApplicationRepo implements ApplicationRepository backed by PostgreSQL.
type PostgresApplicationRepo struct {
	db *sql.DB
}

// NewPostgresApplicationRepo creates a PostgresApplicationRepo.
func NewPostgresApplicationRepo(db *sql.DB) *PostgresApplicationRepo {
	return &PostgresApplicationRepo{db: db}
}

// ── Create ──────────────────────────────────────────

func (r *PostgresApplicationRepo) Create(ctx context.Context, app *Application) error {
	const query = `
		INSERT INTO applications (job_id, candidate_id, status, cover_letter, resume_snapshot_url, applied_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING id, applied_at, created_at, updated_at
	`

	err := r.db.QueryRowContext(ctx, query,
		app.JobID, app.CandidateID, app.Status,
		app.CoverLetter, app.ResumeSnapshotURL,
	).Scan(&app.ID, &app.AppliedAt, &app.CreatedAt, &app.UpdatedAt)

	if err != nil {
		if isUniqueViolation(err) {
			return ErrAlreadyApplied
		}
		return fmt.Errorf("create application: %w", err)
	}
	return nil
}

// ── FindByID ────────────────────────────────────────

func (r *PostgresApplicationRepo) FindByID(ctx context.Context, id string) (*Application, error) {
	const query = `
		SELECT id, job_id, candidate_id, status, cover_letter,
		       resume_snapshot_url, applied_at, reviewed_at, notes,
		       created_at, updated_at
		FROM applications WHERE id = $1
	`
	return scanApplication(r.db.QueryRowContext(ctx, query, id))
}

// ── FindByJobAndCandidate ───────────────────────────

func (r *PostgresApplicationRepo) FindByJobAndCandidate(ctx context.Context, jobID, candidateID string) (*Application, error) {
	const query = `
		SELECT id, job_id, candidate_id, status, cover_letter,
		       resume_snapshot_url, applied_at, reviewed_at, notes,
		       created_at, updated_at
		FROM applications
		WHERE job_id = $1 AND candidate_id = $2
	`
	return scanApplication(r.db.QueryRowContext(ctx, query, jobID, candidateID))
}

// ── ListByCandidateID ───────────────────────────────

func (r *PostgresApplicationRepo) ListByCandidateID(ctx context.Context, candidateID string, limit, offset int) ([]Application, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	const query = `
		SELECT id, job_id, candidate_id, status, cover_letter,
		       resume_snapshot_url, applied_at, reviewed_at, notes,
		       created_at, updated_at
		FROM applications
		WHERE candidate_id = $1
		ORDER BY applied_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.QueryContext(ctx, query, candidateID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by candidate: %w", err)
	}
	defer rows.Close()
	return scanApplications(rows)
}

// ── ListByJobID ─────────────────────────────────────

func (r *PostgresApplicationRepo) ListByJobID(ctx context.Context, jobID string, limit, offset int) ([]Application, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	const query = `
		SELECT id, job_id, candidate_id, status, cover_letter,
		       resume_snapshot_url, applied_at, reviewed_at, notes,
		       created_at, updated_at
		FROM applications
		WHERE job_id = $1
		ORDER BY applied_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.QueryContext(ctx, query, jobID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by job: %w", err)
	}
	defer rows.Close()
	return scanApplications(rows)
}

// ── UpdateStatus ────────────────────────────────────

func (r *PostgresApplicationRepo) UpdateStatus(ctx context.Context, id, status string) error {
	// Determine if reviewed_at should be set based on the new status
	setReviewedAt := status == "reviewed" || status == "shortlisted" || status == "rejected" || status == "offered"

	const query = `
		UPDATE applications
		SET status = $2,
		    reviewed_at = CASE WHEN $3 THEN NOW() ELSE reviewed_at END,
		    updated_at = NOW()
		WHERE id = $1
	`

	result, err := r.db.ExecContext(ctx, query, id, status, setReviewedAt)
	if err != nil {
		return fmt.Errorf("update status: %w", err)
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return ErrApplicationNotFound
	}
	return nil
}

// ── Scanners ────────────────────────────────────────

func scanApplication(row *sql.Row) (*Application, error) {
	var (
		a                 Application
		coverLetter       sql.NullString
		resumeSnapshotURL sql.NullString
		appliedAt         sql.NullTime
		reviewedAt        sql.NullTime
		notes             sql.NullString
	)

	err := row.Scan(
		&a.ID, &a.JobID, &a.CandidateID, &a.Status,
		&coverLetter, &resumeSnapshotURL,
		&appliedAt, &reviewedAt, &notes,
		&a.CreatedAt, &a.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrApplicationNotFound
		}
		return nil, fmt.Errorf("scan application: %w", err)
	}

	a.CoverLetter = ns(coverLetter)
	a.ResumeSnapshotURL = ns(resumeSnapshotURL)
	a.AppliedAt = nt(appliedAt)
	a.ReviewedAt = nt(reviewedAt)
	a.Notes = ns(notes)

	return &a, nil
}

func scanApplications(rows *sql.Rows) ([]Application, error) {
	var apps []Application
	for rows.Next() {
		var (
			a                 Application
			coverLetter       sql.NullString
			resumeSnapshotURL sql.NullString
			appliedAt         sql.NullTime
			reviewedAt        sql.NullTime
			notes             sql.NullString
		)

		err := rows.Scan(
			&a.ID, &a.JobID, &a.CandidateID, &a.Status,
			&coverLetter, &resumeSnapshotURL,
			&appliedAt, &reviewedAt, &notes,
			&a.CreatedAt, &a.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan app row: %w", err)
		}

		a.CoverLetter = ns(coverLetter)
		a.ResumeSnapshotURL = ns(resumeSnapshotURL)
		a.AppliedAt = nt(appliedAt)
		a.ReviewedAt = nt(reviewedAt)
		a.Notes = ns(notes)

		apps = append(apps, a)
	}
	return apps, rows.Err()
}

// ── Helpers ─────────────────────────────────────────

func ns(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}

func nt(nt sql.NullTime) *time.Time {
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
