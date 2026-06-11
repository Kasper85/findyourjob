package auth

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Context keys set by AuthMiddleware.
// Consumers read these via c.GetString("user_id"), etc.
const (
	ContextUserID = "user_id"
	ContextEmail  = "email"
	ContextRole   = "role"
)

// AuthMiddleware returns a Gin middleware that validates JWT access tokens.
//
// It reads the Authorization header (Bearer <token>), validates the token,
// and stores the claims in the request context.
//
// Context keys set:
//   - "user_id"  (string) — the subject claim
//   - "email"    (string)
//   - "role"     (string)
func AuthMiddleware(tokenSvc *TokenService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// ── Read header ─────────────────────────────
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "missing authorization header",
			})
			return
		}

		// ── Parse Bearer ────────────────────────────
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "invalid authorization format, expected: Bearer <token>",
			})
			return
		}

		// ── Validate token ──────────────────────────
		claims, err := tokenSvc.ValidateAccessToken(parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "invalid or expired token",
			})
			return
		}

		// ── Store claims ────────────────────────────
		c.Set(ContextUserID, claims.Subject)
		c.Set(ContextEmail, claims.Email)
		c.Set(ContextRole, claims.Role)

		c.Next()
	}
}
