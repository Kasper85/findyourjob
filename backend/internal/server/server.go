package server

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"find-your-job/backend/internal/config"
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

// Server wraps the HTTP server and its dependencies.
type Server struct {
	cfg    *config.Config
	db     *sql.DB
	engine *gin.Engine
	srv    *http.Server
}

// New creates a new Server instance with the given dependencies.
func New(
	cfg *config.Config,
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
) *Server {
	// ── Setup Gin engine ────────────────────────────
	gin.SetMode(ginMode(cfg.AppEnv))
	engine := gin.New()
	engine.Use(gin.Logger(), gin.Recovery())
	engine.Use(corsMiddleware(cfg.AppEnv))

	// ── Register routes ─────────────────────────────
	registerRoutes(engine, db, authHandler, userHandler, jobHandler, appsHandler, evalHandler, matchHandler, certHandler, ivHandler, authMiddleware)

	// ── HTTP server ─────────────────────────────────
	srv := &http.Server{
		Addr:    ":" + cfg.AppPort,
		Handler: engine,
	}

	return &Server{
		cfg:    cfg,
		db:     db,
		engine: engine,
		srv:    srv,
	}
}

// Run starts the HTTP server and blocks until a shutdown signal is received.
func (s *Server) Run() error {
	// ── Start server in background ──────────────────
	go func() {
		log.Printf("[SERVER] Environment: %s", s.cfg.AppEnv)
		log.Printf("[SERVER] Listening on http://localhost:%s", s.cfg.AppPort)
		if err := s.srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("[SERVER] Failed to start: %v", err)
		}
	}()

	// ── Graceful shutdown ───────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[SERVER] Shutting down gracefully...")
	return s.Shutdown()
}

// Shutdown gracefully stops the server with a 10-second timeout.
func (s *Server) Shutdown() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := s.srv.Shutdown(ctx); err != nil {
		return fmt.Errorf("forced shutdown: %w", err)
	}

	if s.db != nil {
		s.db.Close()
		log.Println("[DB] Connection closed")
	}

	log.Println("[SERVER] Server stopped")
	return nil
}

// ginMode maps our APP_ENV to Gin's mode strings.
func ginMode(env string) string {
	switch env {
	case "production":
		return gin.ReleaseMode
	case "test":
		return gin.TestMode
	default:
		return gin.DebugMode
	}
}

func corsMiddleware(env string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")

		// Set CORS headers for all responses
		if env != "production" && (origin == "" || strings.HasPrefix(origin, "http://localhost:") || strings.HasPrefix(origin, "http://127.0.0.1:")) {
			c.Header("Access-Control-Allow-Origin", origin)
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, Accept")
		c.Header("Access-Control-Max-Age", "86400")

		// Handle preflight
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
