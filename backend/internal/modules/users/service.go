package users

import (
	"context"
	"errors"
	"fmt"
)

// UserService defines the business-logic contract for user operations.
type UserService interface {
	GetProfile(ctx context.Context, userID string) (*UserProfileResponse, error)
	UpdateProfile(ctx context.Context, userID string, input UpdateProfileInput) (*UpdateProfileResponse, error)
}

// UserProfileResponse is the public API representation of a user's full profile.
type UserProfileResponse struct {
	User    User              `json:"user"`
	Profile *CandidateProfile `json:"profile,omitempty"`
}

// UpdateProfileResponse is returned after a successful profile update.
type UpdateProfileResponse struct {
	Message string            `json:"message"`
	Profile *CandidateProfile `json:"profile"`
}

// userService is the concrete implementation of UserService.
// It depends on UserRepository and CandidateProfileRepository.
type userService struct {
	users    UserRepository
	profiles CandidateProfileRepository
}

// NewService creates a UserService with the given repositories.
func NewService(users UserRepository, profiles CandidateProfileRepository) UserService {
	return &userService{
		users:    users,
		profiles: profiles,
	}
}

// GetProfile returns the user and their candidate profile by user ID.
func (s *userService) GetProfile(ctx context.Context, userID string) (*UserProfileResponse, error) {
	user, err := s.users.FindByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get profile: %w", err)
	}

	var profile *CandidateProfile
	if s.profiles != nil {
		p, err := s.profiles.FindByUserID(ctx, userID)
		if err != nil && !errors.Is(err, ErrProfileNotFound) {
			return nil, fmt.Errorf("get profile: %w", err)
		}
		if p != nil {
			profile = p
		}
	}

	return &UserProfileResponse{
		User:    *user,
		Profile: profile,
	}, nil
}

// UpdateProfile creates or updates the candidate profile for the given user.
func (s *userService) UpdateProfile(ctx context.Context, userID string, input UpdateProfileInput) (*UpdateProfileResponse, error) {
	// ── Validate ────────────────────────────────────
	if err := input.Validate(); err != nil {
		return nil, err
	}

	// ── Find existing profile ───────────────────────
	profile, err := s.profiles.FindByUserID(ctx, userID)
	if err != nil && !errors.Is(err, ErrProfileNotFound) {
		return nil, fmt.Errorf("update profile: find: %w", err)
	}

	// ── Create if not exists ────────────────────────
	if profile == nil {
		profile = &CandidateProfile{
			UserID:          userID,
			PreferredRemote: true, // default
		}
		s.applyInput(profile, input)

		if err := s.profiles.Create(ctx, profile); err != nil {
			return nil, fmt.Errorf("update profile: create: %w", err)
		}

		return &UpdateProfileResponse{
			Message: "profile created",
			Profile: profile,
		}, nil
	}

	// ── Update existing ─────────────────────────────
	s.applyInput(profile, input)

	if err := s.profiles.Update(ctx, profile); err != nil {
		return nil, fmt.Errorf("update profile: update: %w", err)
	}

	return &UpdateProfileResponse{
		Message: "profile updated",
		Profile: profile,
	}, nil
}

// applyInput copies non-nil fields from input to profile.
func (s *userService) applyInput(profile *CandidateProfile, input UpdateProfileInput) {
	if input.Location != nil {
		profile.Location = input.Location
	}
	if input.Summary != nil {
		profile.Summary = input.Summary
	}
	if input.ExperienceYears != nil {
		profile.ExperienceYears = *input.ExperienceYears
	}
	if input.ResumeURL != nil {
		profile.ResumeURL = input.ResumeURL
	}
	if input.LinkedinURL != nil {
		profile.LinkedinURL = input.LinkedinURL
	}
	if input.GithubURL != nil {
		profile.GithubURL = input.GithubURL
	}
	if input.PortfolioURL != nil {
		profile.PortfolioURL = input.PortfolioURL
	}
	if input.PreferredRemote != nil {
		profile.PreferredRemote = *input.PreferredRemote
	}
	if input.PreferredLocation != nil {
		profile.PreferredLocation = input.PreferredLocation
	}
	if input.SalaryMin != nil {
		profile.SalaryMin = input.SalaryMin
	}
	if input.SalaryMax != nil {
		profile.SalaryMax = input.SalaryMax
	}
}
