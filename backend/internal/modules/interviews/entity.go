package interviews

import "time"

type Interview struct {
	ID              string    `json:"id"`
	ApplicationID   string    `json:"application_id"`
	RecruiterID     string    `json:"recruiter_id"`
	CandidateID     string    `json:"candidate_id"`
	ScheduledAt     time.Time `json:"scheduled_at"`
	DurationMinutes int       `json:"duration_minutes"`
	Type            *string   `json:"type,omitempty"`
	LocationOrLink  *string   `json:"location_or_link,omitempty"`
	Status          string    `json:"status"`
	Notes           *string   `json:"notes,omitempty"`
	Feedback        *string   `json:"feedback,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type CreateInterviewInput struct {
	ScheduledAt     string  `json:"scheduled_at"      binding:"required"`
	DurationMinutes *int    `json:"duration_minutes,omitempty"`
	Type            *string `json:"type,omitempty"`
	LocationOrLink  *string `json:"location_or_link,omitempty"`
	Notes           *string `json:"notes,omitempty"`
}

type UpdateInterviewInput struct {
	ScheduledAt     *string `json:"scheduled_at,omitempty"`
	DurationMinutes *int    `json:"duration_minutes,omitempty"`
	Type            *string `json:"type,omitempty"`
	LocationOrLink  *string `json:"location_or_link,omitempty"`
	Notes           *string `json:"notes,omitempty"`
	Feedback        *string `json:"feedback,omitempty"`
}

type UpdateStatusInput struct {
	Status string `json:"status" binding:"required"`
}

type InterviewResponse struct {
	Interview Interview `json:"interview"`
}

type InterviewListResponse struct {
	Data   []Interview `json:"data"`
	Limit  int         `json:"limit"`
	Offset int         `json:"offset"`
}

var validInterviewTypes = map[string]bool{
	"phone": true, "video": true, "in_person": true, "technical": true, "hr": true,
}

var validInterviewStatuses = map[string]bool{
	"scheduled": true, "confirmed": true, "completed": true, "cancelled": true, "no_show": true,
}
