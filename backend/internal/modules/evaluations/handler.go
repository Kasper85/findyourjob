package evaluations

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type EvaluationHandler struct {
	service EvaluationService
}

func NewHandler(service EvaluationService) *EvaluationHandler {
	return &EvaluationHandler{service: service}
}

func (h *EvaluationHandler) List(c *gin.Context) {
	var filter EvaluationListFilter
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
	resp, err := h.service.ListEvaluations(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *EvaluationHandler) Get(c *gin.Context) {
	id := c.Param("id")
	resp, err := h.service.GetEvaluation(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, ErrEvaluationNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "evaluation not found"})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *EvaluationHandler) Create(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}
	var input CreateEvaluationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.CreateEvaluation(c.Request.Context(), userID.(string), role.(string), input)
	if err != nil {
		switch {
		case strings.Contains(err.Error(), "only recruiters"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "score"):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusCreated, resp)
}

func (h *EvaluationHandler) Update(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	id := c.Param("id")
	var input UpdateEvaluationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.UpdateEvaluation(c.Request.Context(), userID, role, id, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrEvaluationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "evaluation not found"})
		case strings.Contains(err.Error(), "only recruiters") || strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "score"):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *EvaluationHandler) Delete(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	id := c.Param("id")
	if err := h.service.DeleteEvaluation(c.Request.Context(), userID, role, id); err != nil {
		switch {
		case errors.Is(err, ErrEvaluationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "evaluation not found"})
		case strings.Contains(err.Error(), "only recruiters") || strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func getUserContext(c *gin.Context) (string, string) {
	uid, _ := c.Get("user_id")
	r, _ := c.Get("role")
	if uid == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return "", ""
	}
	return uid.(string), r.(string)
}

func clampLimit(limit int) int {
	if limit <= 0 || limit > 100 {
		return 20
	}
	return limit
}
func clampOffset(offset int) int {
	if offset < 0 {
		return 0
	}
	return offset
}
func mustAtoi(s string, def int) int {
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return v
}
func (h *EvaluationHandler) SubmitResult(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	if role != "candidate" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only candidates can submit results"})
		return
	}
	evalID := c.Param("id")
	var input SubmitEvaluationResultInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.service.SubmitResult(c.Request.Context(), userID, evalID, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrEvaluationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "evaluation not found"})
		case errors.Is(err, ErrAlreadySubmitted):
			c.JSON(http.StatusConflict, gin.H{"error": "already submitted this evaluation"})
		case strings.Contains(err.Error(), "inactive"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "score"):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		case strings.Contains(err.Error(), "candidate profile"):
			c.JSON(http.StatusNotFound, gin.H{"error": "candidate profile not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusCreated, resp)
}
func (h *EvaluationHandler) ListMyResults(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	if role != "candidate" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only candidates can view their results"})
		return
	}
	limit := clampLimit(mustAtoi(c.Query("limit"), 20))
	offset := clampOffset(mustAtoi(c.Query("offset"), 0))

	resp, err := h.service.ListMyResults(c.Request.Context(), userID, limit, offset)
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

func (h *EvaluationHandler) ListResults(c *gin.Context) {
	userID, role := getUserContext(c)
	if userID == "" {
		return
	}
	evalID := c.Param("id")
	limit := clampLimit(mustAtoi(c.Query("limit"), 20))
	offset := clampOffset(mustAtoi(c.Query("offset"), 0))

	resp, err := h.service.ListEvaluationResults(c.Request.Context(), userID, role, evalID, limit, offset)
	if err != nil {
		switch {
		case errors.Is(err, ErrEvaluationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "evaluation not found"})
		case strings.Contains(err.Error(), "only recruiters") || strings.Contains(err.Error(), "not authorized"):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, resp)
}
