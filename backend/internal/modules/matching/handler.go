package matching

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type MatchingHandler struct {
	service MatchingService
}

func NewHandler(service MatchingService) *MatchingHandler {
	return &MatchingHandler{service: service}
}

func (h *MatchingHandler) GetMatch(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if role != "candidate" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only candidates can view match scores"})
		return
	}
	jobID := c.Param("id")
	resp, err := h.service.GetMatch(c.Request.Context(), userID.(string), jobID)
	if err != nil {
		c.JSON(matchErrorStatus(err), gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *MatchingHandler) GetRecommendations(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if role != "candidate" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only candidates can get recommendations"})
		return
	}
	limit := clampInt(c.Query("limit"), 10, 1, 50)
	offset := clampMin(c.Query("offset"), 0)
	minScore := parseFloat(c.Query("min_score"), 0)
	includeApplied := c.Query("include_applied") == "true"
	resp, err := h.service.GetRecommendations(c.Request.Context(), userID.(string), minScore, includeApplied, limit, offset)
	if err != nil {
		if strings.Contains(err.Error(), "candidate profile") {
			c.JSON(http.StatusNotFound, gin.H{"error": "candidate profile not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *MatchingHandler) GetApplicants(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if role != "recruiter" && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only recruiters and admins can view applicants"})
		return
	}
	jobID := c.Param("id")
	limit := clampInt(c.Query("limit"), 20, 1, 100)
	offset := clampMin(c.Query("offset"), 0)
	minScore := parseFloat(c.Query("min_score"), 0)
	statusFilter := c.Query("status")

	validStatuses := map[string]bool{"pending": true, "reviewed": true, "shortlisted": true, "rejected": true, "offered": true, "accepted": true, "withdrawn": true}
	if statusFilter != "" && !validStatuses[statusFilter] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status filter"})
		return
	}

	resp, err := h.service.GetApplicants(c.Request.Context(), userID.(string), role.(string), jobID, statusFilter, minScore, limit, offset)
	if err != nil {
		switch {
		case strings.Contains(err.Error(), "only recruiters") || strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "job:") || strings.Contains(err.Error(), "job not found"):
			c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func matchErrorStatus(err error) int {
	msg := err.Error()
	if strings.Contains(msg, "candidate profile") || strings.Contains(msg, "job not found") {
		return http.StatusNotFound
	}
	return http.StatusInternalServerError
}

func clampInt(s string, def, min, max int) int {
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil || v < min {
		return def
	}
	if v > max {
		return max
	}
	return v
}

func clampMin(s string, def int) int {
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil || v < def {
		return def
	}
	return v
}

func parseFloat(s string, def float64) float64 {
	if s == "" {
		return def
	}
	v, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return def
	}
	return v
}
