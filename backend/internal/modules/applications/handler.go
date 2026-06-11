package applications

import (
	"errors"
	"net/http"
	"strings"

	"find-your-job/backend/internal/modules/jobs"
	"find-your-job/backend/internal/modules/users"

	"github.com/gin-gonic/gin"
)

// ApplicationHandler handles HTTP requests for application operations.
type ApplicationHandler struct {
	service ApplicationService
}

func NewHandler(service ApplicationService) *ApplicationHandler {
	return &ApplicationHandler{service: service}
}

func (h *ApplicationHandler) Apply(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	if role != "candidate" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only candidates can apply to jobs"})
		return
	}
	jobID := c.Param("id")
	var input CreateApplicationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.Apply(c.Request.Context(), userID, jobID, input)
	if err != nil {
		c.JSON(appErrorStatus(err), gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

// ListMine returns the authenticated candidate's applications.
func (h *ApplicationHandler) ListMine(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	if role != "candidate" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only candidates can view their applications"})
		return
	}
	limit := clampLimit(mustAtoi(c.Query("limit"), 20))
	offset := clampOffset(mustAtoi(c.Query("offset"), 0))

	resp, err := h.service.ListByCandidate(c.Request.Context(), userID, limit, offset)
	if err != nil {
		if errors.Is(err, users.ErrProfileNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "candidate profile not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

// ListByJob returns applications for a specific job.
func (h *ApplicationHandler) ListByJob(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	if role != "recruiter" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only recruiters can view job applications"})
		return
	}
	jobID := c.Param("id")
	limit := clampLimit(mustAtoi(c.Query("limit"), 20))
	offset := clampOffset(mustAtoi(c.Query("offset"), 0))

	resp, err := h.service.ListByJob(c.Request.Context(), userID, jobID, limit, offset)
	if err != nil {
		switch {
		case errors.Is(err, jobs.ErrJobNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		case errors.Is(err, users.ErrRecruiterNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "recruiter profile not found"})
		case strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *ApplicationHandler) UpdateStatus(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	if role != "recruiter" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only recruiters can update application status"})
		return
	}

	id := c.Param("id")
	var input UpdateStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.UpdateStatus(c.Request.Context(), userID, id, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrApplicationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "application not found"})
		case errors.Is(err, jobs.ErrJobNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		case errors.Is(err, users.ErrRecruiterNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "recruiter profile not found"})
		case strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "invalid status"):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func getUserContext(c *gin.Context) (userID, role string) {
	uid, _ := c.Get("user_id")
	r, _ := c.Get("role")
	if uid == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return "", ""
	}
	return uid.(string), r.(string)
}

func appErrorStatus(err error) int {
	msg := err.Error()
	switch {
	case errors.Is(err, ErrAlreadyApplied):
		return http.StatusConflict
	case errors.Is(err, users.ErrProfileNotFound), errors.Is(err, jobs.ErrJobNotFound):
		return http.StatusNotFound
	case strings.Contains(msg, "published"):
		return http.StatusForbidden
	default:
		return http.StatusInternalServerError
	}
}
