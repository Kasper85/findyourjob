package auth

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"find-your-job/backend/internal/modules/users"

	"golang.org/x/crypto/bcrypt"
)

// ── Interfaces ──────────────────────────────────────

// AuthService defines the business-logic contract for authentication.
type AuthService interface {
	Register(ctx context.Context, input RegisterInput) (*AuthResponse, error)
	Login(ctx context.Context, input LoginInput) (*AuthResponse, error)
}

// UserStore is the minimal user-storage interface required by the auth module.
// It is satisfied by users.UserRepository — no implementation coupling.
type UserStore interface {
	FindByEmail(ctx context.Context, email string) (*users.User, error)
	Create(ctx context.Context, user *users.User) error
}

// ── Implementation ──────────────────────────────────

// authService is the concrete implementation of AuthService.
type authService struct {
	users    UserStore
	tokens   AuthRepository
	tokenSvc *TokenService
}

// NewService creates an AuthService with the given dependencies.
// userStore is typically the users.UserRepository.
// tokenRepo handles refresh-token persistence (may be nil during MVP).
// tokenSvc generates and validates JWT tokens.
func NewService(userStore UserStore, tokenRepo AuthRepository, tokenSvc *TokenService) AuthService {
	return &authService{
		users:    userStore,
		tokens:   tokenRepo,
		tokenSvc: tokenSvc,
	}
}

// ── Register ────────────────────────────────────────

// Register creates a new user with a hashed password and returns JWT tokens.
func (s *authService) Register(ctx context.Context, input RegisterInput) (*AuthResponse, error) {
	// ── Normalize ───────────────────────────────────
	email := strings.TrimSpace(strings.ToLower(input.Email))

	// ── Check duplicate ─────────────────────────────
	existing, err := s.users.FindByEmail(ctx, email)
	if err != nil && !errors.Is(err, users.ErrUserNotFound) {
		return nil, fmt.Errorf("register: check email: %w", err)
	}
	if existing != nil {
		return nil, users.ErrEmailAlreadyExists
	}

	// ── Hash password ───────────────────────────────
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("register: hash password: %w", err)
	}

	// ── Create user ─────────────────────────────────
	user := &users.User{
		Email:        email,
		PasswordHash: string(hash),
		Role:         input.Role,
		Name:         strings.TrimSpace(input.Name),
		IsActive:     true,
	}

	if err := s.users.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("register: create user: %w", err)
	}

	// ── Generate tokens ─────────────────────────────
	tokens, err := s.tokenSvc.GenerateTokenPair(user)
	if err != nil {
		return nil, fmt.Errorf("register: generate tokens: %w", err)
	}

	return &AuthResponse{
		User:  *user,
		Token: *tokens,
	}, nil
}

// ── Login ───────────────────────────────────────────

// Login authenticates a user and returns JWT tokens.
func (s *authService) Login(ctx context.Context, input LoginInput) (*AuthResponse, error) {
	// ── Normalize ───────────────────────────────────
	email := strings.TrimSpace(strings.ToLower(input.Email))

	// ── Find user ───────────────────────────────────
	user, err := s.users.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, users.ErrUserNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, fmt.Errorf("login: find user: %w", err)
	}

	// ── Check active ────────────────────────────────
	if !user.IsActive {
		return nil, ErrInactiveUser
	}

	// ── Verify password ─────────────────────────────
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	// ── Generate tokens ─────────────────────────────
	tokens, err := s.tokenSvc.GenerateTokenPair(user)
	if err != nil {
		return nil, fmt.Errorf("login: generate tokens: %w", err)
	}

	return &AuthResponse{
		User:  *user,
		Token: *tokens,
	}, nil
}
