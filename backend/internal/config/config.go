package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application.
type Config struct {
	AppEnv  string
	AppPort string
	DB      DBConfig
	JWT     JWTConfig
}

// DBConfig holds PostgreSQL connection configuration.
type DBConfig struct {
	Host            string
	Port            string
	User            string
	Password        string
	Name            string
	SSLMode         string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
}

// JWTConfig holds JSON Web Token configuration.
type JWTConfig struct {
	Secret           string
	AccessTTLMinutes int
	RefreshTTLDays   int
}

// DSN returns the PostgreSQL connection string.
func (d DBConfig) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		d.Host, d.Port, d.User, d.Password, d.Name, d.SSLMode,
	)
}

// Load reads configuration from a .env file and environment variables.
func Load(envPath string) (*Config, error) {
	if envPath == "" {
		envPath = ".env"
	}

	_ = godotenv.Load(envPath)

	cfg := &Config{
		AppEnv:  getEnv("APP_ENV", "development"),
		AppPort: getEnv("APP_PORT", "8080"),
		DB: DBConfig{
			Host:            getEnv("DB_HOST", "localhost"),
			Port:            getEnv("DB_PORT", "5432"),
			User:            getEnv("DB_USER", "postgres"),
			Password:        getEnv("DB_PASSWORD", "postgres"),
			Name:            getEnv("DB_NAME", "findyourjob"),
			SSLMode:         getEnv("DB_SSLMODE", "disable"),
			MaxOpenConns:    getEnvInt("DB_MAX_OPEN_CONNS", 25),
			MaxIdleConns:    getEnvInt("DB_MAX_IDLE_CONNS", 10),
			ConnMaxLifetime: getEnvDuration("DB_CONN_MAX_LIFETIME", 5*time.Minute),
		},
		JWT: JWTConfig{
			Secret:           getEnv("JWT_SECRET", ""),
			AccessTTLMinutes: getEnvInt("JWT_ACCESS_TTL_MINUTES", 60),
			RefreshTTLDays:   getEnvInt("JWT_REFRESH_TTL_DAYS", 30),
		},
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("invalid configuration: %w", err)
	}

	return cfg, nil
}

// Validate checks that all required configuration values are present and valid.
func (c *Config) Validate() error {
	// ── Application ──────────────────────────────────
	if c.AppPort == "" {
		return fmt.Errorf("APP_PORT is required")
	}
	if _, err := strconv.Atoi(c.AppPort); err != nil {
		return fmt.Errorf("APP_PORT must be a valid integer: %q", c.AppPort)
	}
	if port, _ := strconv.Atoi(c.AppPort); port < 1 || port > 65535 {
		return fmt.Errorf("APP_PORT must be between 1 and 65535: %d", port)
	}

	// ── JWT ──────────────────────────────────────────
	if c.JWT.Secret == "" {
		if c.AppEnv == "production" {
			return fmt.Errorf("JWT_SECRET is required in production")
		}
		// Development fallback — explicit default for local dev safety
		c.JWT.Secret = "find-your-job-dev-secret-change-in-production"
	}
	if len(c.JWT.Secret) < 16 {
		return fmt.Errorf("JWT_SECRET must be at least 16 characters (got %d)", len(c.JWT.Secret))
	}

	// ── Database (required for production, optional for development) ──
	if c.AppEnv == "production" {
		if c.DB.Host == "" {
			return fmt.Errorf("DB_HOST is required in production")
		}
		if c.DB.Port == "" {
			return fmt.Errorf("DB_PORT is required in production")
		}
		if c.DB.User == "" {
			return fmt.Errorf("DB_USER is required in production")
		}
		if c.DB.Password == "" {
			return fmt.Errorf("DB_PASSWORD is required in production")
		}
		if c.DB.Name == "" {
			return fmt.Errorf("DB_NAME is required in production")
		}
	}

	// ── Database optional validations (any environment) ──
	if c.DB.Port != "" {
		if _, err := strconv.Atoi(c.DB.Port); err != nil {
			return fmt.Errorf("DB_PORT must be a valid integer: %q", c.DB.Port)
		}
	}
	if c.DB.SSLMode != "" {
		validModes := map[string]bool{
			"disable": true, "allow": true, "prefer": true,
			"require": true, "verify-ca": true, "verify-full": true,
		}
		if !validModes[c.DB.SSLMode] {
			return fmt.Errorf("DB_SSLMODE must be one of: disable, allow, prefer, require, verify-ca, verify-full, got: %q", c.DB.SSLMode)
		}
	}

	return nil
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	val := getEnv(key, "")
	if val == "" {
		return fallback
	}
	n, err := strconv.Atoi(val)
	if err != nil {
		return fallback
	}
	return n
}

func getEnvDuration(key string, fallback time.Duration) time.Duration {
	val := getEnv(key, "")
	if val == "" {
		return fallback
	}
	d, err := time.ParseDuration(val)
	if err != nil {
		return fallback
	}
	return d
}
