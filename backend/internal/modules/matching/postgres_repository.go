package matching

import (
	"context"
	"database/sql"
	"fmt"
)

type PostgresMatchingStore struct {
	db *sql.DB
}

func NewPostgresMatchingStore(db *sql.DB) *PostgresMatchingStore {
	return &PostgresMatchingStore{db: db}
}

func (s *PostgresMatchingStore) FindCandidateByUserID(ctx context.Context, userID string) (*CandidateInfo, error) {
	const query = `
		SELECT cp.id, u.name, cp.experience_years
		FROM candidate_profiles cp JOIN users u ON u.id = cp.user_id WHERE cp.user_id = $1
	`
	var c CandidateInfo
	if err := s.db.QueryRowContext(ctx, query, userID).Scan(&c.ID, &c.Name, &c.ExperienceYears); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("candidate profile not found")
		}
		return nil, fmt.Errorf("find candidate: %w", err)
	}
	return &c, nil
}

func (s *PostgresMatchingStore) FindJobByID(ctx context.Context, jobID string) (*JobInfo, error) {
	const query = `SELECT id, title, status, company_id, location, is_remote, job_type FROM jobs WHERE id = $1`
	var j JobInfo
	if err := s.db.QueryRowContext(ctx, query, jobID).Scan(&j.ID, &j.Title, &j.Status, &j.CompanyID, &j.Location, &j.IsRemote, &j.JobType); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("job not found")
		}
		return nil, fmt.Errorf("find job: %w", err)
	}
	return &j, nil
}

func (s *PostgresMatchingStore) GetCandidateSkills(ctx context.Context, candidateID string) ([]SkillInfo, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT sk.id, sk.name FROM candidate_skills cs JOIN skills sk ON sk.id = cs.skill_id WHERE cs.candidate_id = $1`, candidateID)
	if err != nil {
		return nil, fmt.Errorf("candidate skills: %w", err)
	}
	defer rows.Close()
	var skills []SkillInfo
	for rows.Next() {
		var sk SkillInfo
		if err := rows.Scan(&sk.ID, &sk.Name); err != nil {
			return nil, err
		}
		skills = append(skills, sk)
	}
	return skills, rows.Err()
}

func (s *PostgresMatchingStore) GetJobSkills(ctx context.Context, jobID string) ([]SkillInfo, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT sk.id, sk.name FROM job_skills js JOIN skills sk ON sk.id = js.skill_id WHERE js.job_id = $1`, jobID)
	if err != nil {
		return nil, fmt.Errorf("job skills: %w", err)
	}
	defer rows.Close()
	var skills []SkillInfo
	for rows.Next() {
		var sk SkillInfo
		if err := rows.Scan(&sk.ID, &sk.Name); err != nil {
			return nil, err
		}
		skills = append(skills, sk)
	}
	return skills, rows.Err()
}

func (s *PostgresMatchingStore) GetCandidateEvalSummary(ctx context.Context, candidateID string) (*EvalSummary, error) {
	var avg float64
	if err := s.db.QueryRowContext(ctx, `SELECT COALESCE(AVG(score), 0) FROM evaluation_results WHERE candidate_id = $1`, candidateID).Scan(&avg); err != nil {
		return nil, fmt.Errorf("eval summary: %w", err)
	}
	return &EvalSummary{AvgScore: avg}, nil
}

func (s *PostgresMatchingStore) GetCandidateCertSummary(ctx context.Context, candidateID string) (*CertSummary, error) {
	const query = `SELECT COALESCE(SUM(CASE WHEN verified THEN 1 ELSE 0 END), 0), COALESCE(SUM(CASE WHEN NOT verified THEN 1 ELSE 0 END), 0) FROM certifications WHERE candidate_id = $1`
	var c CertSummary
	if err := s.db.QueryRowContext(ctx, query, candidateID).Scan(&c.VerifiedCount, &c.UnverifiedCount); err != nil {
		return nil, fmt.Errorf("cert summary: %w", err)
	}
	return &c, nil
}

func (s *PostgresMatchingStore) ListPublishedJobs(ctx context.Context, excludeCandidateID string, includeApplied bool, limit, offset int) ([]JobInfo, error) {
	if limit <= 0 || limit > 50 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}
	var query string
	var args []interface{}
	if includeApplied {
		query = `SELECT id, title, status, company_id, location, is_remote, job_type FROM jobs WHERE status = 'published' ORDER BY created_at DESC LIMIT $1 OFFSET $2`
		args = []interface{}{limit, offset}
	} else {
		query = fmt.Sprintf(`SELECT j.id, j.title, j.status, j.company_id, j.location, j.is_remote, j.job_type FROM jobs j WHERE j.status = 'published' AND NOT EXISTS (SELECT 1 FROM applications a WHERE a.job_id = j.id AND a.candidate_id = $1) ORDER BY j.created_at DESC LIMIT $2 OFFSET $3`)
		args = []interface{}{excludeCandidateID, limit, offset}
	}
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("list published jobs: %w", err)
	}
	defer rows.Close()
	var jobs []JobInfo
	for rows.Next() {
		var j JobInfo
		if err := rows.Scan(&j.ID, &j.Title, &j.Status, &j.CompanyID, &j.Location, &j.IsRemote, &j.JobType); err != nil {
			return nil, err
		}
		jobs = append(jobs, j)
	}
	return jobs, rows.Err()
}

func (s *PostgresMatchingStore) HasCandidateApplied(ctx context.Context, candidateID, jobID string) (bool, error) {
	var exists bool
	err := s.db.QueryRowContext(ctx, `SELECT EXISTS(SELECT 1 FROM applications WHERE candidate_id = $1 AND job_id = $2)`, candidateID, jobID).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("check applied: %w", err)
	}
	return exists, nil
}

func (s *PostgresMatchingStore) GetRecruiterByUserID(ctx context.Context, userID string) (*RecruiterInfo, error) {
	const query = `SELECT id, company_id FROM recruiters WHERE user_id = $1`
	var r RecruiterInfo
	if err := s.db.QueryRowContext(ctx, query, userID).Scan(&r.ID, &r.CompanyID); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("recruiter not found")
		}
		return nil, fmt.Errorf("find recruiter: %w", err)
	}
	return &r, nil
}

func (s *PostgresMatchingStore) ListApplicantsForJob(ctx context.Context, jobID, status string, limit, offset int) ([]ApplicantInfo, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	var query string
	var args []interface{}

	if status != "" {
		query = `SELECT a.id, a.status, a.applied_at, cp.id, u.id, u.name, u.email, cp.experience_years FROM applications a JOIN candidate_profiles cp ON cp.id = a.candidate_id JOIN users u ON u.id = cp.user_id WHERE a.job_id = $1 AND a.status = $2 ORDER BY a.applied_at DESC LIMIT $3 OFFSET $4`
		args = []interface{}{jobID, status, limit, offset}
	} else {
		query = `SELECT a.id, a.status, a.applied_at, cp.id, u.id, u.name, u.email, cp.experience_years FROM applications a JOIN candidate_profiles cp ON cp.id = a.candidate_id JOIN users u ON u.id = cp.user_id WHERE a.job_id = $1 ORDER BY a.applied_at DESC LIMIT $2 OFFSET $3`
		args = []interface{}{jobID, limit, offset}
	}

	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("list applicants: %w", err)
	}
	defer rows.Close()

	var applicants []ApplicantInfo
	for rows.Next() {
		var a ApplicantInfo
		if err := rows.Scan(&a.ApplicationID, &a.ApplicationStatus, &a.AppliedAt, &a.CandidateID, &a.UserID, &a.Name, &a.Email, &a.ExperienceYears); err != nil {
			return nil, err
		}
		applicants = append(applicants, a)
	}
	return applicants, rows.Err()
}
