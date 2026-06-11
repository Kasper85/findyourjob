package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"find-your-job/backend/internal/config"

	_ "github.com/lib/pq"
)

// Connect establishes a connection pool to PostgreSQL.
// It pings the database to verify connectivity and configures the pool.
func Connect(cfg config.DBConfig) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.DSN())
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(cfg.MaxOpenConns)
	db.SetMaxIdleConns(cfg.MaxIdleConns)
	db.SetConnMaxLifetime(cfg.ConnMaxLifetime)

	// Verify connectivity with a timeout
	if err := pingWithRetry(db, 3, 2*time.Second); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("[DB] PostgreSQL connection established")
	return db, nil
}

// pingWithRetry attempts to ping the database multiple times.
// This handles race conditions where the app starts before the DB is ready.
func pingWithRetry(db *sql.DB, maxRetries int, delay time.Duration) error {
	var lastErr error
	for i := range maxRetries {
		if err := db.Ping(); err != nil {
			lastErr = err
			log.Printf("[DB] Ping attempt %d/%d failed: %v", i+1, maxRetries, err)
			time.Sleep(delay)
			continue
		}
		return nil
	}
	return fmt.Errorf("database unreachable after %d attempts: %w", maxRetries, lastErr)
}

// Ping checks if the database connection is alive.
func Ping(db *sql.DB) error {
	return db.Ping()
}
