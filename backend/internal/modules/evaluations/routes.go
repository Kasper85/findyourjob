package evaluations

import "github.com/gin-gonic/gin"

// RegisterRoutes registers all evaluation-related routes.
//
// Access plan:
//
//	GET    /api/v1/evaluations               — JWT (any authenticated)
//	GET    /api/v1/evaluations/:id           — JWT
//	POST   /api/v1/evaluations               — recruiter, admin
//	PUT    /api/v1/evaluations/:id           — recruiter, admin
//	DELETE /api/v1/evaluations/:id           — recruiter, admin
//	POST   /api/v1/evaluations/:id/results   — candidate
//	GET    /api/v1/evaluation-results/me      — candidate
//	GET    /api/v1/evaluations/:id/results    — recruiter, admin
func RegisterRoutes(rg *gin.RouterGroup, h *EvaluationHandler, authMiddleware gin.HandlerFunc) {
	evals := rg.Group("/evaluations")
	evals.Use(authMiddleware)
	{
		evals.GET("", h.List)
		evals.GET("/:id", h.Get)
		evals.POST("", h.Create)
		evals.PUT("/:id", h.Update)
		evals.DELETE("/:id", h.Delete)
		evals.POST("/:id/results", h.SubmitResult)
		evals.GET("/:id/results", h.ListResults)
	}

	results := rg.Group("/evaluation-results")
	results.Use(authMiddleware)
	{
		results.GET("/me", h.ListMyResults)
	}
}
