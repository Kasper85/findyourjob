package users

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

// UserHandler handles HTTP requests for user operations.
// It depends on UserService for business logic.
type UserHandler struct {
	service UserService
}

// NewHandler creates a UserHandler with the given service.
func NewHandler(service UserService) *UserHandler {
	return &UserHandler{service: service}
}

// GetMe returns the authenticated user's profile.
// GET /api/v1/me
func (h *UserHandler) GetMe(c *gin.Context) {
	h.getProfile(c)
}

// GetProfile returns the authenticated user's profile.
// GET /api/v1/profile
func (h *UserHandler) GetProfile(c *gin.Context) {
	h.getProfile(c)
}

// UpdateProfile updates the authenticated user's candidate profile.
// Creates the profile if it doesn't exist.
// PUT /api/v1/profile
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	var input UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.UpdateProfile(c.Request.Context(), userID.(string), input)
	if err != nil {
		switch {
		case errors.Is(err, ErrInvalidExperienceYears),
			errors.Is(err, ErrInvalidSalary),
			errors.Is(err, ErrSalaryRangeInvalid):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}

	c.JSON(http.StatusOK, resp)
}

// UpdateMe updates the authenticated user's profile.
// PUT /api/v1/me
// TODO: implement in Phase 7.2
func (h *UserHandler) UpdateMe(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"message": "PUT /api/v1/me — not implemented yet",
	})
}

// getProfile is the shared implementation for GetMe and GetProfile.
func (h *UserHandler) getProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	resp, err := h.service.GetProfile(c.Request.Context(), userID.(string))
	if err != nil {
		switch {
		case errors.Is(err, ErrUserNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}

	c.JSON(http.StatusOK, resp)
}

// GetByID returns a user by ID.
// GET /api/v1/users/:id
// This route is planned for future use.
// func (h *UserHandler) GetByID(c *gin.Context) { ... }
