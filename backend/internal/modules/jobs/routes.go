package jobs

import "github.com/gin-gonic/gin"

// RegisterRoutes registers all job-related routes.
func RegisterRoutes(rg *gin.RouterGroup, h *JobHandler, authMiddleware gin.HandlerFunc) {
	jobs := rg.Group("/jobs")
	{
		jobs.GET("", h.List)
		jobs.GET("/:id", h.Get)
		jobs.POST("", authMiddleware, h.Create)
		jobs.PUT("/:id", authMiddleware, h.Update)
		jobs.DELETE("/:id", authMiddleware, h.Delete)
	}
}
