package jobs

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"
)

// PostgresJobRepo implements JobRepository backed by PostgreSQL.
type PostgresJobRepo struct {
	db *sql.DB
}

// NewPostgresJobRepo creates a PostgresJobRepo.
func NewPostgresJobRepo(db *sql.DB) *PostgresJobRepo {
	return &PostgresJobRepo{db: db}
}

// ── Create ──────────────────────────────────────────

func (r *PostgresJobRepo) Create(ctx context.Context, job *Job) error {
	const query = `
		INSERT INTO jobs (
			company_id, recruiter_id, title, description, requirements,
			responsibilities, location, is_remote, salary_min, salary_max,
			currency, job_type, status, expires_at, source
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING id, created_at, updated_at
	`

	return r.db.QueryRowContext(ctx, query,
		job.CompanyID, job.RecruiterID, job.Title,
		job.Description, job.Requirements, job.Responsibilities,
		job.Location, job.IsRemote, job.SalaryMin, job.SalaryMax,
		job.Currency, job.JobType, job.Status,
		job.ExpiresAt, job.Source,
	).Scan(&job.ID, &job.CreatedAt, &job.UpdatedAt)
}

// ── FindByID ────────────────────────────────────────

func (r *PostgresJobRepo) FindByID(ctx context.Context, id string) (*Job, error) {
	const query = `
		SELECT id, company_id, recruiter_id, title, description, requirements,
		       responsibilities, location, is_remote, salary_min, salary_max,
		       currency, job_type, status, posted_at, expires_at, external_url, source,
		       created_at, updated_at
		FROM jobs WHERE id = $1
	`

	return scanJob(r.db.QueryRowContext(ctx, query, id))
}

// ── List ────────────────────────────────────────────

func (r *PostgresJobRepo) List(ctx context.Context, filter JobListFilter) ([]Job, error) {
	// Clamp pagination
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}
	if filter.Offset < 0 {
		filter.Offset = 0
	}

	var (
		conditions []string
		args       []interface{}
		paramIdx   = 1
	)

	addCond := func(col, op string, val interface{}) {
		conditions = append(conditions, fmt.Sprintf("%s %s $%d", col, op, paramIdx))
		args = append(args, val)
		paramIdx++
	}

	if filter.Status != nil && *filter.Status != "" {
		addCond("status", "=", *filter.Status)
	}
	if filter.CompanyID != nil && *filter.CompanyID != "" {
		addCond("company_id", "=", *filter.CompanyID)
	}
	if filter.RecruiterID != nil && *filter.RecruiterID != "" {
		addCond("recruiter_id", "=", *filter.RecruiterID)
	}
	if filter.JobType != nil && *filter.JobType != "" {
		addCond("job_type", "=", *filter.JobType)
	}
	if filter.Location != nil && *filter.Location != "" {
		addCond("location", "ILIKE", "%"+*filter.Location+"%")
	}
	if filter.IsRemote != nil {
		addCond("is_remote", "=", *filter.IsRemote)
	}
	if filter.Search != nil && *filter.Search != "" {
		searchTerm := "%" + *filter.Search + "%"
		conditions = append(conditions,
			fmt.Sprintf("(title ILIKE $%d OR description ILIKE $%d)", paramIdx, paramIdx))
		args = append(args, searchTerm)
		paramIdx++
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	query := fmt.Sprintf(`
		SELECT id, company_id, recruiter_id, title, description, requirements,
		       responsibilities, location, is_remote, salary_min, salary_max,
		       currency, job_type, status, posted_at, expires_at, external_url, source,
		       created_at, updated_at
		FROM jobs
		%s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, paramIdx, paramIdx+1)

	args = append(args, filter.Limit, filter.Offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("list jobs: %w", err)
	}
	defer rows.Close()

	return scanJobs(rows)
}

// ── Update ──────────────────────────────────────────

func (r *PostgresJobRepo) Update(ctx context.Context, job *Job) error {
	const query = `
		UPDATE jobs
		SET title = $2, description = $3, requirements = $4, responsibilities = $5,
		    location = $6, is_remote = $7, salary_min = $8, salary_max = $9,
		    currency = $10, job_type = $11, status = $12, expires_at = $13,
		    source = $14, updated_at = NOW()
		WHERE id = $1
		RETURNING updated_at
	`

	err := r.db.QueryRowContext(ctx, query,
		job.ID, job.Title, job.Description, job.Requirements,
		job.Responsibilities, job.Location, job.IsRemote,
		job.SalaryMin, job.SalaryMax, job.Currency, job.JobType,
		job.Status, job.ExpiresAt, job.Source,
	).Scan(&job.UpdatedAt)

	if errors.Is(err, sql.ErrNoRows) {
		return ErrJobNotFound
	}
	return err
}

// ── Delete ──────────────────────────────────────────

func (r *PostgresJobRepo) Delete(ctx context.Context, id string) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM jobs WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete job: %w", err)
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return ErrJobNotFound
	}
	return nil
}

// ── Skills ──────────────────────────────────────────

func (r *PostgresJobRepo) AddSkill(ctx context.Context, js *JobSkill) error {
	const query = `
		INSERT INTO job_skills (job_id, skill_id, is_required, importance)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (job_id, skill_id) DO UPDATE
		SET is_required = $3, importance = $4
	`
	_, err := r.db.ExecContext(ctx, query, js.JobID, js.SkillID, js.IsRequired, js.Importance)
	return err
}

func (r *PostgresJobRepo) RemoveSkill(ctx context.Context, jobID, skillID string) error {
	_, err := r.db.ExecContext(ctx,
		`DELETE FROM job_skills WHERE job_id = $1 AND skill_id = $2`,
		jobID, skillID,
	)
	return err
}

func (r *PostgresJobRepo) ListSkillsByJobID(ctx context.Context, jobID string) ([]JobSkill, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT job_id, skill_id, is_required, importance
		 FROM job_skills WHERE job_id = $1`, jobID,
	)
	if err != nil {
		return nil, fmt.Errorf("list job skills: %w", err)
	}
	defer rows.Close()

	var skills []JobSkill
	for rows.Next() {
		var js JobSkill
		if err := rows.Scan(&js.JobID, &js.SkillID, &js.IsRequired, &js.Importance); err != nil {
			return nil, fmt.Errorf("scan job skill: %w", err)
		}
		skills = append(skills, js)
	}
	return skills, rows.Err()
}

// ── Scanners ────────────────────────────────────────

func scanJob(row *sql.Row) (*Job, error) {
	var (
		j                Job
		recruiterID      sql.NullString
		description      sql.NullString
		requirements     sql.NullString
		responsibilities sql.NullString
		location         sql.NullString
		salaryMin        sql.NullInt64
		salaryMax        sql.NullInt64
		jobType          sql.NullString
		postedAt         sql.NullTime
		expiresAt        sql.NullTime
		externalURL      sql.NullString
		source           sql.NullString
	)

	err := row.Scan(
		&j.ID, &j.CompanyID, &recruiterID,
		&j.Title, &description, &requirements, &responsibilities,
		&location, &j.IsRemote, &salaryMin, &salaryMax,
		&j.Currency, &jobType, &j.Status,
		&postedAt, &expiresAt, &externalURL, &source,
		&j.CreatedAt, &j.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrJobNotFound
		}
		return nil, fmt.Errorf("scan job: %w", err)
	}

	j.RecruiterID = ns(recruiterID)
	j.Description = ns(description)
	j.Requirements = ns(requirements)
	j.Responsibilities = ns(responsibilities)
	j.Location = ns(location)
	j.SalaryMin = ni(salaryMin)
	j.SalaryMax = ni(salaryMax)
	j.JobType = ns(jobType)
	j.PostedAt = nt(postedAt)
	j.ExpiresAt = nt(expiresAt)
	j.ExternalURL = ns(externalURL)
	j.Source = ns(source)

	return &j, nil
}

func scanJobs(rows *sql.Rows) ([]Job, error) {
	var jobs []Job
	for rows.Next() {
		var (
			j                Job
			recruiterID      sql.NullString
			description      sql.NullString
			requirements     sql.NullString
			responsibilities sql.NullString
			location         sql.NullString
			salaryMin        sql.NullInt64
			salaryMax        sql.NullInt64
			jobType          sql.NullString
			postedAt         sql.NullTime
			expiresAt        sql.NullTime
			externalURL      sql.NullString
			source           sql.NullString
		)

		err := rows.Scan(
			&j.ID, &j.CompanyID, &recruiterID,
			&j.Title, &description, &requirements, &responsibilities,
			&location, &j.IsRemote, &salaryMin, &salaryMax,
			&j.Currency, &jobType, &j.Status,
			&postedAt, &expiresAt, &externalURL, &source,
			&j.CreatedAt, &j.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan job row: %w", err)
		}

		j.RecruiterID = ns(recruiterID)
		j.Description = ns(description)
		j.Requirements = ns(requirements)
		j.Responsibilities = ns(responsibilities)
		j.Location = ns(location)
		j.SalaryMin = ni(salaryMin)
		j.SalaryMax = ni(salaryMax)
		j.JobType = ns(jobType)
		j.PostedAt = nt(postedAt)
		j.ExpiresAt = nt(expiresAt)
		j.ExternalURL = ns(externalURL)
		j.Source = ns(source)

		jobs = append(jobs, j)
	}
	return jobs, rows.Err()
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

func nt(nt sql.NullTime) *time.Time {
	if nt.Valid {
		return &nt.Time
	}
	return nil
}
