package interviews

import "github.com/gin-gonic/gin"

func RegisterRoutes(rg *gin.RouterGroup, h *InterviewHandler, authMiddleware gin.HandlerFunc) {
	rg.POST("/applications/:id/interviews", authMiddleware, h.Create)
	rg.GET("/interviews/me", authMiddleware, h.ListMine)
	rg.GET("/interviews/:id", authMiddleware, h.Get)
	rg.PUT("/interviews/:id", authMiddleware, h.Update)
	rg.PATCH("/interviews/:id/status", authMiddleware, h.UpdateStatus)
	rg.DELETE("/interviews/:id", authMiddleware, h.Delete)
	rg.GET("/jobs/:id/interviews", authMiddleware, h.ListByJob)
}
