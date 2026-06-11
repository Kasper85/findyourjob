package auth

import "context"

// AuthRepository defines the data-access contract for auth-specific persistence.
// This includes refresh tokens and token blacklisting — NOT user CRUD
// (user storage is owned by the users module).
type AuthRepository interface {
	SaveRefreshToken(ctx context.Context, userID, tokenHash string) error
	FindRefreshToken(ctx context.Context, tokenHash string) (userID string, err error)
	DeleteRefreshToken(ctx context.Context, tokenHash string) error
	DeleteAllUserTokens(ctx context.Context, userID string) error
}
