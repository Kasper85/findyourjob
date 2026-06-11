package interviews

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

type PostgresInterviewRepo struct {
	db *sql.DB
}

func NewPostgresInterviewRepo(db *sql.DB) *PostgresInterviewRepo {
	return &PostgresInterviewRepo{db: db}
}

func (r *PostgresInterviewRepo) Create(ctx context.Context, iv *Interview) error {
	const query = `INSERT INTO interviews (application_id, recruiter_id, candidate_id, scheduled_at, duration_minutes, type, location_or_link, status, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, created_at, updated_at`
	return r.db.QueryRowContext(ctx, query, iv.ApplicationID, iv.RecruiterID, iv.CandidateID, iv.ScheduledAt, iv.DurationMinutes, iv.Type, iv.LocationOrLink, iv.Status, iv.Notes).Scan(&iv.ID, &iv.CreatedAt, &iv.UpdatedAt)
}

func (r *PostgresInterviewRepo) FindByID(ctx context.Context, id string) (*Interview, error) {
	const q = `SELECT id, application_id, recruiter_id, candidate_id, scheduled_at, duration_minutes, type, location_or_link, status, notes, feedback, created_at, updated_at FROM interviews WHERE id = $1`
	return scanInterview(r.db.QueryRowContext(ctx, q, id))
}

func (r *PostgresInterviewRepo) ListByCandidateID(ctx context.Context, candidateID string, limit, offset int) ([]Interview, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	rows, err := r.db.QueryContext(ctx, `SELECT id, application_id, recruiter_id, candidate_id, scheduled_at, duration_minutes, type, location_or_link, status, notes, feedback, created_at, updated_at FROM interviews WHERE candidate_id = $1 ORDER BY scheduled_at DESC LIMIT $2 OFFSET $3`, candidateID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by candidate: %w", err)
	}
	defer rows.Close()
	return scanInterviews(rows)
}

func (r *PostgresInterviewRepo) ListByRecruiterID(ctx context.Context, recruiterID string, limit, offset int) ([]Interview, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	rows, err := r.db.QueryContext(ctx, `SELECT id, application_id, recruiter_id, candidate_id, scheduled_at, duration_minutes, type, location_or_link, status, notes, feedback, created_at, updated_at FROM interviews WHERE recruiter_id = $1 ORDER BY scheduled_at DESC LIMIT $2 OFFSET $3`, recruiterID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by recruiter: %w", err)
	}
	defer rows.Close()
	return scanInterviews(rows)
}

func (r *PostgresInterviewRepo) ListByJobID(ctx context.Context, jobID string, limit, offset int) ([]Interview, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	rows, err := r.db.QueryContext(ctx, `SELECT i.id, i.application_id, i.recruiter_id, i.candidate_id, i.scheduled_at, i.duration_minutes, i.type, i.location_or_link, i.status, i.notes, i.feedback, i.created_at, i.updated_at FROM interviews i JOIN applications a ON a.id = i.application_id WHERE a.job_id = $1 ORDER BY i.scheduled_at DESC LIMIT $2 OFFSET $3`, jobID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by job: %w", err)
	}
	defer rows.Close()
	return scanInterviews(rows)
}

func (r *PostgresInterviewRepo) Update(ctx context.Context, iv *Interview) error {
	const q = `UPDATE interviews SET scheduled_at=$2, duration_minutes=$3, type=$4, location_or_link=$5, notes=$6, feedback=$7, updated_at=NOW() WHERE id=$1 RETURNING updated_at`
	err := r.db.QueryRowContext(ctx, q, iv.ID, iv.ScheduledAt, iv.DurationMinutes, iv.Type, iv.LocationOrLink, iv.Notes, iv.Feedback).Scan(&iv.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return ErrInterviewNotFound
	}
	return err
}

func (r *PostgresInterviewRepo) UpdateStatus(ctx context.Context, id, status string) (*Interview, error) {
	const q = `UPDATE interviews SET status=$2, updated_at=NOW() WHERE id=$1 RETURNING id, application_id, recruiter_id, candidate_id, scheduled_at, duration_minutes, type, location_or_link, status, notes, feedback, created_at, updated_at`
	return scanInterview(r.db.QueryRowContext(ctx, q, id, status))
}

func (r *PostgresInterviewRepo) Delete(ctx context.Context, id string) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM interviews WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete interview: %w", err)
	}
	if rows, _ := result.RowsAffected(); rows == 0 {
		return ErrInterviewNotFound
	}
	return nil
}

func scanInterview(row *sql.Row) (*Interview, error) {
	var iv Interview
	var typ, loc, notes, feedback sql.NullString
	var sched time.Time
	err := row.Scan(&iv.ID, &iv.ApplicationID, &iv.RecruiterID, &iv.CandidateID, &sched, &iv.DurationMinutes, &typ, &loc, &iv.Status, &notes, &feedback, &iv.CreatedAt, &iv.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrInterviewNotFound
		}
		return nil, fmt.Errorf("scan interview: %w", err)
	}
	iv.ScheduledAt = sched
	if typ.Valid {
		iv.Type = &typ.String
	}
	if loc.Valid {
		iv.LocationOrLink = &loc.String
	}
	if notes.Valid {
		iv.Notes = &notes.String
	}
	if feedback.Valid {
		iv.Feedback = &feedback.String
	}
	return &iv, nil
}

func scanInterviews(rows *sql.Rows) ([]Interview, error) {
	var ivs []Interview
	for rows.Next() {
		var iv Interview
		var typ, loc, notes, feedback sql.NullString
		var sched time.Time
		if err := rows.Scan(&iv.ID, &iv.ApplicationID, &iv.RecruiterID, &iv.CandidateID, &sched, &iv.DurationMinutes, &typ, &loc, &iv.Status, &notes, &feedback, &iv.CreatedAt, &iv.UpdatedAt); err != nil {
			return nil, err
		}
		iv.ScheduledAt = sched
		if typ.Valid {
			iv.Type = &typ.String
		}
		if loc.Valid {
			iv.LocationOrLink = &loc.String
		}
		if notes.Valid {
			iv.Notes = &notes.String
		}
		if feedback.Valid {
			iv.Feedback = &feedback.String
		}
		ivs = append(ivs, iv)
	}
	return ivs, rows.Err()
}
