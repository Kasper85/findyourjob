package applications

import "github.com/gin-gonic/gin"

// RegisterRoutes registers all application-related routes.
func RegisterRoutes(rg *gin.RouterGroup, h *ApplicationHandler, authMiddleware gin.HandlerFunc) {
	// Candidate routes (protected)
	jobs := rg.Group("/jobs")
	jobs.Use(authMiddleware)
	{
		jobs.POST("/:id/apply", h.Apply)
		jobs.GET("/:id/applications", h.ListByJob)
	}

	apps := rg.Group("/applications")
	apps.Use(authMiddleware)
	{
		apps.GET("/me", h.ListMine)
		apps.PATCH("/:id/status", h.UpdateStatus)
	}
}
