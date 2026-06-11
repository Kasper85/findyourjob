package matching

// ── Match Result ────────────────────────────────────

type MatchResponse struct {
	JobID         string         `json:"job_id"`
	CandidateID   string         `json:"candidate_id"`
	Score         float64        `json:"score"`
	Level         string         `json:"level"`
	Breakdown     MatchBreakdown `json:"breakdown"`
	MatchedSkills []string       `json:"matched_skills"`
	MissingSkills []string       `json:"missing_skills"`
	Explanation   string         `json:"explanation"`
}

type MatchBreakdown struct {
	Skills         float64 `json:"skills"`
	Evaluations    float64 `json:"evaluations"`
	Experience     float64 `json:"experience"`
	Certifications float64 `json:"certifications"`
}

// ── Recommendations ─────────────────────────────────

type RecommendationItem struct {
	Job   JobSummary     `json:"job"`
	Match MatchBreakdown `json:"match"`
}

type JobSummary struct {
	ID        string  `json:"id"`
	Title     string  `json:"title"`
	CompanyID string  `json:"company_id"`
	Location  *string `json:"location,omitempty"`
	IsRemote  bool    `json:"is_remote"`
	JobType   *string `json:"job_type,omitempty"`
	Status    string  `json:"status"`
}

type RecommendationListResponse struct {
	Data   []RecommendationItem `json:"data"`
	Limit  int                  `json:"limit"`
	Offset int                  `json:"offset"`
	Count  int                  `json:"count"`
}

// ── Applicant Ranking ───────────────────────────────

type ApplicantRankingItem struct {
	Application ApplicantSummary `json:"application"`
	Candidate   CandidateSummary `json:"candidate"`
	Match       MatchBreakdown   `json:"match"`
}

type ApplicantSummary struct {
	ID        string `json:"id"`
	Status    string `json:"status"`
	AppliedAt string `json:"applied_at"`
}

type CandidateSummary struct {
	ID              string `json:"id"`
	UserID          string `json:"user_id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	ExperienceYears int    `json:"experience_years"`
}

type ApplicantListResponse struct {
	Job    JobSummary             `json:"job"`
	Data   []ApplicantRankingItem `json:"data"`
	Limit  int                    `json:"limit"`
	Offset int                    `json:"offset"`
	Count  int                    `json:"count"`
}

// ── Match Level ─────────────────────────────────────

func MatchLevel(score float64) string {
	switch {
	case score >= 80:
		return "excellent_match"
	case score >= 60:
		return "good_match"
	case score >= 40:
		return "average_match"
	default:
		return "low_match"
	}
}
