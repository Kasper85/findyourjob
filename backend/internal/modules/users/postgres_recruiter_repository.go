package users

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
)

// PostgresRecruiterRepo implements RecruiterRepository backed by PostgreSQL.
type PostgresRecruiterRepo struct {
	db *sql.DB
}

// NewPostgresRecruiterRepo creates a PostgresRecruiterRepo.
func NewPostgresRecruiterRepo(db *sql.DB) *PostgresRecruiterRepo {
	return &PostgresRecruiterRepo{db: db}
}

// FindByUserID returns the recruiter record for the given user ID.
func (r *PostgresRecruiterRepo) FindByUserID(ctx context.Context, userID string) (*Recruiter, error) {
	const query = `
		SELECT id, user_id, company_id, position, phone, created_at, updated_at
		FROM recruiters
		WHERE user_id = $1
	`

	var (
		rec      Recruiter
		position sql.NullString
		phone    sql.NullString
	)

	err := r.db.QueryRowContext(ctx, query, userID).Scan(
		&rec.ID, &rec.UserID, &rec.CompanyID,
		&position, &phone,
		&rec.CreatedAt, &rec.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRecruiterNotFound
		}
		return nil, fmt.Errorf("find recruiter by user id: %w", err)
	}

	rec.Position = nullString(position)
	rec.Phone = nullString(phone)

	return &rec, nil
}
