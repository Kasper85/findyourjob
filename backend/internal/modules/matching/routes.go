package matching

import "github.com/gin-gonic/gin"

// RegisterRoutes registers all matching-related routes.
//
// Access plan:
//
//	GET /api/v1/matching/jobs/:id/me        — candidate only
//	GET /api/v1/matching/recommendations     — candidate only
//	GET /api/v1/matching/jobs/:id/applicants — recruiter, admin
func RegisterRoutes(rg *gin.RouterGroup, h *MatchingHandler, authMiddleware gin.HandlerFunc) {
	m := rg.Group("/matching")
	m.Use(authMiddleware)
	{
		m.GET("/jobs/:id/me", h.GetMatch)
		m.GET("/recommendations", h.GetRecommendations)
		m.GET("/jobs/:id/applicants", h.GetApplicants)
	}
}
