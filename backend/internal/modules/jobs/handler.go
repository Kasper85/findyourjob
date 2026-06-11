package jobs

import (
	"errors"
	"net/http"
	"strings"

	"find-your-job/backend/internal/modules/users"

	"github.com/gin-gonic/gin"
)

// JobHandler handles HTTP requests for job operations.
type JobHandler struct {
	service JobService
}

// NewHandler creates a JobHandler with the given service.
func NewHandler(service JobService) *JobHandler {
	return &JobHandler{service: service}
}

func (h *JobHandler) List(c *gin.Context) {
	var filter JobListFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}
	if filter.Offset < 0 {
		filter.Offset = 0
	}
	resp, err := h.service.ListJobs(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *JobHandler) Get(c *gin.Context) {
	id := c.Param("id")
	resp, err := h.service.GetJob(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, ErrJobNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *JobHandler) Create(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return // middleware handles 401
	}
	var input CreateJobInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.CreateJob(c.Request.Context(), userID, role, input)
	if err != nil {
		c.JSON(jobErrorStatus(err), gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

// Update updates an existing job. Recruiter only, owns job.
func (h *JobHandler) Update(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	id := c.Param("id")
	var input UpdateJobInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.UpdateJob(c.Request.Context(), userID, role, id, input)
	if err != nil {
		c.JSON(jobErrorStatus(err), gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

// Delete deletes a job. Recruiter only, owns job.
func (h *JobHandler) Delete(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	id := c.Param("id")
	if err := h.service.DeleteJob(c.Request.Context(), userID, role, id); err != nil {
		c.JSON(jobErrorStatus(err), gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// ── Helpers ─────────────────────────────────────────

func getUserContext(c *gin.Context) (userID, role string) {
	uid, _ := c.Get("user_id")
	r, _ := c.Get("role")
	if uid == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return "", ""
	}
	return uid.(string), r.(string)
}

func jobErrorStatus(err error) int {
	msg := err.Error()
	switch {
	case errors.Is(err, ErrJobNotFound) || errors.Is(err, users.ErrRecruiterNotFound):
		return http.StatusNotFound
	case strings.Contains(msg, "only recruiters") || strings.Contains(msg, "not authorized"):
		return http.StatusForbidden
	case strings.Contains(msg, "required") || strings.Contains(msg, "invalid") || strings.Contains(msg, "salary"):
		return http.StatusBadRequest
	default:
		return http.StatusInternalServerError
	}
}
