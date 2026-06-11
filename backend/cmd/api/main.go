package main

import (
	"context"
	"database/sql"
	"log"

	"find-your-job/backend/internal/config"
	"find-your-job/backend/internal/database"
	"find-your-job/backend/internal/modules/applications"
	"find-your-job/backend/internal/modules/auth"
	"find-your-job/backend/internal/modules/certifications"
	"find-your-job/backend/internal/modules/evaluations"
	"find-your-job/backend/internal/modules/interviews"
	"find-your-job/backend/internal/modules/jobs"
	"find-your-job/backend/internal/modules/matching"
	"find-your-job/backend/internal/modules/users"
	"find-your-job/backend/internal/server"

	"github.com/gin-gonic/gin"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("[APP] Starting Find Your Job API...")

	// ── 1. Load configuration ───────────────────────
	cfg, err := config.Load(".env")
	if err != nil {
		log.Fatalf("[APP] Configuration error: %v", err)
	}

	// ── 2. Connect to database (optional) ───────────
	db, err := database.Connect(cfg.DB)
	if err != nil {
		log.Printf("[APP] WARNING: Database unavailable: %v", err)
		log.Println("[APP] Starting without database — /health/db will report not_configured")
		db = nil
	}

	// ── 3. Wire modules ─────────────────────────────
	var (
		authHandler    *auth.AuthHandler
		userHandler    *users.UserHandler
		jobHandler     *jobs.JobHandler
		appsHandler    *applications.ApplicationHandler
		evalHandler    *evaluations.EvaluationHandler
		matchHandler   *matching.MatchingHandler
		certHandler    *certifications.CertificationHandler
		ivHandler      *interviews.InterviewHandler
		authMiddleware gin.HandlerFunc
	)

	if db != nil {
		userRepo := users.NewPostgresUserRepo(db)
		profileRepo := users.NewPostgresCandidateProfileRepo(db)
		tokenSvc := auth.NewTokenService(cfg.JWT.Secret, cfg.JWT.AccessTTLMinutes, cfg.JWT.RefreshTTLDays)

		// Auth module
		authSvc := auth.NewService(userRepo, nil, tokenSvc)
		authHandler = auth.NewHandler(authSvc)

		// Users module
		userSvc := users.NewService(userRepo, profileRepo)
		userHandler = users.NewHandler(userSvc)

		// Jobs module
		jobsRepo := jobs.NewPostgresJobRepo(db)
		recruiterRepo := users.NewPostgresRecruiterRepo(db)
		jobsSvc := jobs.NewService(jobsRepo, recruiterRepo)
		jobHandler = jobs.NewHandler(jobsSvc)

		// Applications module
		appsRepo := applications.NewPostgresApplicationRepo(db)
		appsSvc := applications.NewService(appsRepo, jobsRepo, profileRepo, recruiterRepo)
		appsHandler = applications.NewHandler(appsSvc)

		// Evaluations module
		evalRepo := evaluations.NewPostgresEvaluationRepo(db)
		evalResultRepo := evaluations.NewPostgresEvaluationResultRepo(db)
		evalSvc := evaluations.NewService(evalRepo, evalResultRepo, profileRepo)
		evalHandler = evaluations.NewHandler(evalSvc)

		// Matching module
		matchStore := matching.NewPostgresMatchingStore(db)
		matchSvc := matching.NewService(matchStore)
		matchHandler = matching.NewHandler(matchSvc)

		// Certifications module
		certRepo := certifications.NewPostgresCertificationRepo(db)
		certSvc := certifications.NewService(certRepo, profileRepo)
		certHandler = certifications.NewHandler(certSvc)

		// Interviews module
		ivRepo := interviews.NewPostgresInterviewRepo(db)
		ivSvc := interviews.NewService(ivRepo, &appAdapter{db}, &recAdapter{db}, profileRepo, &jobAdapter{db})
		ivHandler = interviews.NewHandler(ivSvc)

		// Auth middleware (shared)
		authMiddleware = auth.AuthMiddleware(tokenSvc)

		log.Println("[APP] Modules wired — full stack + JWT")
	} else {
		log.Println("[APP] Modules skipped — no database")
	}

	// ── 4. Initialize server ────────────────────────
	srv := server.New(cfg, db, authHandler, userHandler, jobHandler, appsHandler, evalHandler, matchHandler, certHandler, ivHandler, authMiddleware)

	// ── 5. Run ──────────────────────────────────────
	if err := srv.Run(); err != nil {
		log.Fatalf("[APP] Server error: %v", err)
	}
}

// ── Adapters for interviews module ──────────────────

type appAdapter struct{ db *sql.DB }

func (a *appAdapter) FindByID(ctx context.Context, id string) (*interviews.AppInfo, error) {
	var info interviews.AppInfo
	err := a.db.QueryRowContext(ctx, `SELECT id, job_id, candidate_id FROM applications WHERE id = $1`, id).Scan(&info.ID, &info.JobID, &info.CandidateID)
	return &info, err
}

type recAdapter struct{ db *sql.DB }

func (a *recAdapter) FindByUserID(ctx context.Context, userID string) (*interviews.RecInfo, error) {
	var info interviews.RecInfo
	err := a.db.QueryRowContext(ctx, `SELECT id, company_id FROM recruiters WHERE user_id = $1`, userID).Scan(&info.ID, &info.CompanyID)
	return &info, err
}

type jobAdapter struct{ db *sql.DB }

func (a *jobAdapter) FindByID(ctx context.Context, id string) (*interviews.JobInfo, error) {
	var info interviews.JobInfo
	err := a.db.QueryRowContext(ctx, `SELECT id, company_id, recruiter_id FROM jobs WHERE id = $1`, id).Scan(&info.ID, &info.CompanyID, &info.RecruiterID)
	return &info, err
}
