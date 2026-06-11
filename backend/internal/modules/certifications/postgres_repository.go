package certifications

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
)

type PostgresCertificationRepo struct {
	db *sql.DB
}

func NewPostgresCertificationRepo(db *sql.DB) *PostgresCertificationRepo {
	return &PostgresCertificationRepo{db: db}
}

func (r *PostgresCertificationRepo) Create(ctx context.Context, cert *Certification) error {
	const query = `
		INSERT INTO certifications (candidate_id, name, issuer, issue_date, expiration_date, credential_id, credential_url, verified)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRowContext(ctx, query,
		cert.CandidateID, cert.Name, cert.Issuer,
		cert.IssueDate, cert.ExpirationDate, cert.CredentialID, cert.CredentialURL, cert.Verified,
	).Scan(&cert.ID, &cert.CreatedAt, &cert.UpdatedAt)
}

func (r *PostgresCertificationRepo) FindByID(ctx context.Context, id string) (*Certification, error) {
	const query = `SELECT id, candidate_id, name, issuer, issue_date, expiration_date, credential_id, credential_url, verified, created_at, updated_at FROM certifications WHERE id = $1`
	return scanCert(r.db.QueryRowContext(ctx, query, id))
}

func (r *PostgresCertificationRepo) List(ctx context.Context, limit, offset int) ([]Certification, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	rows, err := r.db.QueryContext(ctx, `SELECT id, candidate_id, name, issuer, issue_date, expiration_date, credential_id, credential_url, verified, created_at, updated_at FROM certifications ORDER BY created_at DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list certifications: %w", err)
	}
	defer rows.Close()
	return scanCerts(rows)
}

func (r *PostgresCertificationRepo) ListByCandidateID(ctx context.Context, candidateID string, limit, offset int) ([]Certification, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	rows, err := r.db.QueryContext(ctx, `SELECT id, candidate_id, name, issuer, issue_date, expiration_date, credential_id, credential_url, verified, created_at, updated_at FROM certifications WHERE candidate_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`, candidateID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list by candidate: %w", err)
	}
	defer rows.Close()
	return scanCerts(rows)
}

func (r *PostgresCertificationRepo) Update(ctx context.Context, cert *Certification) error {
	const query = `
		UPDATE certifications SET name = $2, issuer = $3, issue_date = $4, expiration_date = $5, credential_id = $6, credential_url = $7, verified = $8, updated_at = NOW()
		WHERE id = $1 RETURNING updated_at
	`
	err := r.db.QueryRowContext(ctx, query, cert.ID, cert.Name, cert.Issuer, cert.IssueDate, cert.ExpirationDate, cert.CredentialID, cert.CredentialURL, cert.Verified).Scan(&cert.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return ErrCertificationNotFound
	}
	return err
}

func (r *PostgresCertificationRepo) Delete(ctx context.Context, id string) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM certifications WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete certification: %w", err)
	}
	if rows, _ := result.RowsAffected(); rows == 0 {
		return ErrCertificationNotFound
	}
	return nil
}

func (r *PostgresCertificationRepo) UpdateVerified(ctx context.Context, id string, verified bool) (*Certification, error) {
	const query = `UPDATE certifications SET verified = $2, updated_at = NOW() WHERE id = $1 RETURNING id, candidate_id, name, issuer, issue_date, expiration_date, credential_id, credential_url, verified, created_at, updated_at`
	return scanCert(r.db.QueryRowContext(ctx, query, id, verified))
}

func scanCert(row *sql.Row) (*Certification, error) {
	var c Certification
	var issueDate, expirationDate, credentialID, credentialURL sql.NullString
	err := row.Scan(&c.ID, &c.CandidateID, &c.Name, &c.Issuer, &issueDate, &expirationDate, &credentialID, &credentialURL, &c.Verified, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrCertificationNotFound
		}
		return nil, fmt.Errorf("scan certification: %w", err)
	}
	c.IssueDate = ns(issueDate)
	c.ExpirationDate = ns(expirationDate)
	c.CredentialID = ns(credentialID)
	c.CredentialURL = ns(credentialURL)
	return &c, nil
}

func scanCerts(rows *sql.Rows) ([]Certification, error) {
	var certs []Certification
	for rows.Next() {
		var c Certification
		var issueDate, expirationDate, credentialID, credentialURL sql.NullString
		if err := rows.Scan(&c.ID, &c.CandidateID, &c.Name, &c.Issuer, &issueDate, &expirationDate, &credentialID, &credentialURL, &c.Verified, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		c.IssueDate = ns(issueDate)
		c.ExpirationDate = ns(expirationDate)
		c.CredentialID = ns(credentialID)
		c.CredentialURL = ns(credentialURL)
		certs = append(certs, c)
	}
	return certs, rows.Err()
}

func ns(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}
