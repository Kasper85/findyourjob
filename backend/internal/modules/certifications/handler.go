package certifications

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type CertificationHandler struct {
	service CertificationService
}

func NewHandler(service CertificationService) *CertificationHandler {
	return &CertificationHandler{service: service}
}

func (h *CertificationHandler) List(c *gin.Context) {
	limit := clampInt(c.Query("limit"), 20, 1, 100)
	offset := clampMin(c.Query("offset"), 0)
	resp, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *CertificationHandler) Get(c *gin.Context) {
	id := c.Param("id")
	resp, err := h.service.Get(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, ErrCertificationNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "certification not found"})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *CertificationHandler) Create(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	var input CreateCertificationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// candidateID is the authenticated user's candidate_profile ID — derived in service if needed
	// For now, pass userID as candidateID; service will resolve
	resp, err := h.service.Create(c.Request.Context(), "", userID.(string), role.(string), input)
	if err != nil {
		switch {
		case strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "invalid"):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusCreated, resp)
}

func (h *CertificationHandler) Update(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	id := c.Param("id")
	var input UpdateCertificationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.Update(c.Request.Context(), id, userID.(string), role.(string), input)
	if err != nil {
		switch {
		case errors.Is(err, ErrCertificationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "certification not found"})
		case strings.Contains(err.Error(), "not authorized") || strings.Contains(err.Error(), "only admins"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "required"):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *CertificationHandler) Delete(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	id := c.Param("id")
	if err := h.service.Delete(c.Request.Context(), id, userID.(string), role.(string)); err != nil {
		switch {
		case errors.Is(err, ErrCertificationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "certification not found"})
		case strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (h *CertificationHandler) ListMine(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if role != "candidate" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only candidates can view their certifications"})
		return
	}
	limit := clampInt(c.Query("limit"), 20, 1, 100)
	offset := clampMin(c.Query("offset"), 0)
	resp, err := h.service.ListMine(c.Request.Context(), userID.(string), limit, offset)
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

func (h *CertificationHandler) Verify(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can verify certifications"})
		return
	}
	id := c.Param("id")
	var input VerifyCertificationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.Verify(c.Request.Context(), id, userID.(string), role.(string), input)
	if err != nil {
		switch {
		case errors.Is(err, ErrCertificationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "certification not found"})
		case strings.Contains(err.Error(), "only admins"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func clampInt(s string, def, min, max int) int {
	if s == "" {
		return def
	}
	v := 0
	for _, c := range s {
		if c < '0' || c > '9' {
			return def
		}
		v = v*10 + int(c-'0')
	}
	if v < min {
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
	v := 0
	for _, c := range s {
		if c < '0' || c > '9' {
			return def
		}
		v = v*10 + int(c-'0')
	}
	if v < def {
		return def
	}
	return v
}
