package interviews

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type InterviewHandler struct {
	service InterviewService
}

func NewHandler(service InterviewService) *InterviewHandler {
	return &InterviewHandler{service: service}
}

func getUser(c *gin.Context) (string, string) {
	uid, _ := c.Get("user_id")
	r, _ := c.Get("role")
	if uid == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return "", ""
	}
	return uid.(string), r.(string)
}

func clamp(s string, def, min, max int) int {
	if s == "" {
		return def
	}
	v := 0
	for _, ch := range s {
		if ch < '0' || ch > '9' {
			return def
		}
		v = v*10 + int(ch-'0')
	}
	if v < min {
		return def
	}
	if v > max {
		return max
	}
	return v
}

func (h *InterviewHandler) Create(c *gin.Context) {
	uid, role := getUser(c)
	if uid == "" {
		return
	}
	appID := c.Param("id")
	var input CreateInterviewInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.Create(c.Request.Context(), uid, role, appID, input)
	if err != nil {
		switch {
		case strings.Contains(err.Error(), "only recruiters") || strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "application") || strings.Contains(err.Error(), "recruiter"):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "format") || strings.Contains(err.Error(), "duration") || strings.Contains(err.Error(), "type"):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusCreated, resp)
}

func (h *InterviewHandler) ListMine(c *gin.Context) {
	uid, role := getUser(c)
	if uid == "" {
		return
	}
	lim := clamp(c.Query("limit"), 20, 1, 100)
	off := clamp(c.Query("offset"), 0, 0, 9999)
	resp, err := h.service.ListMine(c.Request.Context(), uid, role, lim, off)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *InterviewHandler) ListByJob(c *gin.Context) {
	uid, role := getUser(c)
	if uid == "" {
		return
	}
	jobID := c.Param("id")
	lim := clamp(c.Query("limit"), 20, 1, 100)
	off := clamp(c.Query("offset"), 0, 0, 9999)
	resp, err := h.service.ListByJob(c.Request.Context(), uid, role, jobID, lim, off)
	if err != nil {
		if strings.Contains(err.Error(), "not authorized") || strings.Contains(err.Error(), "only recruiters") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *InterviewHandler) Get(c *gin.Context) {
	uid, role := getUser(c)
	if uid == "" {
		return
	}
	resp, err := h.service.Get(c.Request.Context(), uid, role, c.Param("id"))
	if err != nil {
		if errors.Is(err, ErrInterviewNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "interview not found"})
		} else if strings.Contains(err.Error(), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *InterviewHandler) Update(c *gin.Context) {
	uid, role := getUser(c)
	if uid == "" {
		return
	}
	var input UpdateInterviewInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.Update(c.Request.Context(), uid, role, c.Param("id"), input)
	if err != nil {
		switch {
		case errors.Is(err, ErrInterviewNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "interview not found"})
		case strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "duration"):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *InterviewHandler) UpdateStatus(c *gin.Context) {
	uid, role := getUser(c)
	if uid == "" {
		return
	}
	var input UpdateStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.UpdateStatus(c.Request.Context(), uid, role, c.Param("id"), input)
	if err != nil {
		if errors.Is(err, ErrInterviewNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "interview not found"})
		} else if strings.Contains(err.Error(), "invalid") {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else if strings.Contains(err.Error(), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *InterviewHandler) Delete(c *gin.Context) {
	uid, role := getUser(c)
	if uid == "" {
		return
	}
	if err := h.service.Delete(c.Request.Context(), uid, role, c.Param("id")); err != nil {
		if errors.Is(err, ErrInterviewNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "interview not found"})
		} else if strings.Contains(err.Error(), "not authorized") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
