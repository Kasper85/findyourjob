package server

import (
	"database/sql"
	"net/http"
	"time"

	"find-your-job/backend/internal/database"

	"github.com/gin-gonic/gin"
)

// ── Health Handlers ─────────────────────────────────

// healthCheck returns the overall application status.
// This endpoint does not depend on any external service.
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "ok",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// healthDBCheck returns a handler that verifies the PostgreSQL connection.
// If db is nil, it reports "not_configured".
// If the ping fails, it reports "unreachable" with the error.
func healthDBCheck(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if db == nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"status":    "error",
				"database":  "not_configured",
				"timestamp": time.Now().UTC().Format(time.RFC3339),
			})
			return
		}

		if err := database.Ping(db); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"status":    "error",
				"database":  "unreachable",
				"error":     err.Error(),
				"timestamp": time.Now().UTC().Format(time.RFC3339),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status":    "ok",
			"database":  "healthy",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	}
}
