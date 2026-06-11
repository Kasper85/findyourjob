package server

import (
	"database/sql"

	"find-your-job/backend/internal/modules/applications"
	"find-your-job/backend/internal/modules/auth"
	"find-your-job/backend/internal/modules/certifications"
	"find-your-job/backend/internal/modules/evaluations"
	"find-your-job/backend/internal/modules/interviews"
	"find-your-job/backend/internal/modules/jobs"
	"find-your-job/backend/internal/modules/matching"
	"find-your-job/backend/internal/modules/users"

	"github.com/gin-gonic/gin"
)

// registerRoutes defines all API routes.
func registerRoutes(
	r *gin.Engine,
	db *sql.DB,
	authHandler *auth.AuthHandler,
	userHandler *users.UserHandler,
	jobHandler *jobs.JobHandler,
	appsHandler *applications.ApplicationHandler,
	evalHandler *evaluations.EvaluationHandler,
	matchHandler *matching.MatchingHandler,
	certHandler *certifications.CertificationHandler,
	ivHandler *interviews.InterviewHandler,
	authMiddleware gin.HandlerFunc,
) {
	// ── Health ──────────────────────────────────────
	r.GET("/health", healthCheck)
	r.GET("/health/db", healthDBCheck(db))

	// ── API v1 ──────────────────────────────────────
	v1 := r.Group("/api/v1")

	// ── Auth module (public) ────────────────────────
	if authHandler != nil {
		auth.RegisterRoutes(v1, authHandler)
	}

	// ── Users module (protected) ────────────────────
	if userHandler != nil && authMiddleware != nil {
		users.RegisterRoutes(v1, userHandler, authMiddleware)
	}

	// ── Jobs module (public read, protected write) ──
	if jobHandler != nil {
		jobs.RegisterRoutes(v1, jobHandler, authMiddleware)
	}

	// ── Applications module (protected) ─────────────
	if appsHandler != nil && authMiddleware != nil {
		applications.RegisterRoutes(v1, appsHandler, authMiddleware)
	}

	// ── Evaluations module (protected) ──────────────
	if evalHandler != nil && authMiddleware != nil {
		evaluations.RegisterRoutes(v1, evalHandler, authMiddleware)
	}

	// ── Matching module (protected) ─────────────────
	if matchHandler != nil && authMiddleware != nil {
		matching.RegisterRoutes(v1, matchHandler, authMiddleware)
	}

	// ── Certifications module (protected) ───────────
	if certHandler != nil && authMiddleware != nil {
		certifications.RegisterRoutes(v1, certHandler, authMiddleware)
	}

	// ── Interviews module (protected) ───────────────
	if ivHandler != nil && authMiddleware != nil {
		interviews.RegisterRoutes(v1, ivHandler, authMiddleware)
	}
}
