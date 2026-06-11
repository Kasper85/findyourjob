package auth

import "github.com/gin-gonic/gin"

// RegisterRoutes registers all auth-related routes on the given router group.
//
// Routes:
//
//	POST /api/v1/auth/register — create a new user account
//	POST /api/v1/auth/login    — authenticate and receive tokens
func RegisterRoutes(rg *gin.RouterGroup, h *AuthHandler) {
	auth := rg.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
	}
}
