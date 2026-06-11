package users

import "github.com/gin-gonic/gin"

// RegisterRoutes registers all user-related routes on the given router group.
//
// Routes:
//
//	GET  /api/v1/me       — authenticated user's profile
//	GET  /api/v1/profile   — authenticated user's profile
//	PUT  /api/v1/me       — update authenticated user's profile
//
// Planned for future:
//
//	GET  /api/v1/users/:id — public user profile (commented out)
func RegisterRoutes(rg *gin.RouterGroup, h *UserHandler, authMiddleware gin.HandlerFunc) {
	protected := rg.Group("")
	protected.Use(authMiddleware)
	{
		protected.GET("/me", h.GetMe)
		protected.GET("/profile", h.GetProfile)
		protected.PUT("/me", h.UpdateMe)
		protected.PUT("/profile", h.UpdateProfile)
	}

	// Future route — uncomment when ready:
	// rg.GET("/users/:id", h.GetByID)
}
