package auth

import (
	"fmt"
	"time"

	"find-your-job/backend/internal/modules/users"

	"github.com/golang-jwt/jwt/v5"
)

// ── Claims ───────────────────────────────────────────

// CustomClaims holds the JWT payload for both access and refresh tokens.
type CustomClaims struct {
	Email     string `json:"email"`
	Role      string `json:"role"`
	TokenType string `json:"token_type"` // "access" or "refresh"
	jwt.RegisteredClaims
}

// ── Token Service ────────────────────────────────────

// TokenService generates and validates JWT tokens.
type TokenService struct {
	secret     []byte
	accessTTL  time.Duration
	refreshTTL time.Duration
}

// NewTokenService creates a TokenService with the given configuration.
func NewTokenService(secret string, accessTTLMinutes, refreshTTLDays int) *TokenService {
	return &TokenService{
		secret:     []byte(secret),
		accessTTL:  time.Duration(accessTTLMinutes) * time.Minute,
		refreshTTL: time.Duration(refreshTTLDays) * 24 * time.Hour,
	}
}

// GenerateTokenPair creates an access token and a refresh token for the given user.
func (ts *TokenService) GenerateTokenPair(user *users.User) (*TokenPair, error) {
	now := time.Now()

	// ── Access token ─────────────────────────────────
	accessClaims := CustomClaims{
		Email:     user.Email,
		Role:      user.Role,
		TokenType: "access",
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   user.ID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(ts.accessTTL)),
		},
	}

	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString(ts.secret)
	if err != nil {
		return nil, fmt.Errorf("sign access token: %w", err)
	}

	// ── Refresh token ────────────────────────────────
	refreshClaims := CustomClaims{
		Email:     user.Email,
		Role:      user.Role,
		TokenType: "refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   user.ID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(ts.refreshTTL)),
		},
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString(ts.secret)
	if err != nil {
		return nil, fmt.Errorf("sign refresh token: %w", err)
	}

	return &TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
	}, nil
}

// ValidateAccessToken parses and validates an access token, returning its claims.
func (ts *TokenService) ValidateAccessToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return ts.secret, nil
	})
	if err != nil {
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	if claims.TokenType != "access" {
		return nil, ErrInvalidToken
	}

	return claims, nil
}
