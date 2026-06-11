package certifications

import "github.com/gin-gonic/gin"

func RegisterRoutes(rg *gin.RouterGroup, h *CertificationHandler, authMiddleware gin.HandlerFunc) {
	certs := rg.Group("/certifications")
	certs.Use(authMiddleware)
	{
		certs.GET("", h.List)
		certs.GET("/:id", h.Get)
		certs.POST("", h.Create)
		certs.PUT("/:id", h.Update)
		certs.DELETE("/:id", h.Delete)
		certs.PATCH("/:id/verify", h.Verify)
	}

	candidate := rg.Group("/candidate")
	candidate.Use(authMiddleware)
	{
		candidate.GET("/certifications", h.ListMine)
	}
}
