package auth

import "find-your-job/backend/internal/modules/users"

// RegisterInput is the expected payload for POST /api/v1/auth/register.
type RegisterInput struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Name     string `json:"name"     binding:"required"`
	Role     string `json:"role"     binding:"required,oneof=candidate recruiter"`
}

// LoginInput is the expected payload for POST /api/v1/auth/login.
type LoginInput struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// TokenPair holds the access and refresh tokens returned after authentication.
type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	TokenType    string `json:"token_type"` // always "Bearer"
}

// AuthResponse is returned after successful registration or login.
type AuthResponse struct {
	User  users.User `json:"user"`
	Token TokenPair  `json:"token"`
}
