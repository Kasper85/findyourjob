package matching

import "context"

var DefaultWeights = MatchBreakdown{
	Skills:         0.50,
	Evaluations:    0.25,
	Experience:     0.15,
	Certifications: 0.10,
}

type SkillInfo struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type JobInfo struct {
	ID        string
	Title     string
	Status    string
	CompanyID string
	Location  *string
	IsRemote  bool
	JobType   *string
}

type CandidateInfo struct {
	ID              string
	Name            string
	ExperienceYears int
}

type EvalSummary struct {
	AvgScore float64
}

type CertSummary struct {
	VerifiedCount   int
	UnverifiedCount int
}

type RecruiterInfo struct {
	ID        string
	CompanyID string
}

type ApplicantInfo struct {
	ApplicationID     string
	ApplicationStatus string
	AppliedAt         string
	CandidateID       string
	UserID            string
	Name              string
	Email             string
	ExperienceYears   int
}

// MatchingDataStore provides all data for match calculations.
type MatchingDataStore interface {
	FindCandidateByUserID(ctx context.Context, userID string) (*CandidateInfo, error)
	FindJobByID(ctx context.Context, jobID string) (*JobInfo, error)
	GetCandidateSkills(ctx context.Context, candidateID string) ([]SkillInfo, error)
	GetJobSkills(ctx context.Context, jobID string) ([]SkillInfo, error)
	GetCandidateEvalSummary(ctx context.Context, candidateID string) (*EvalSummary, error)
	GetCandidateCertSummary(ctx context.Context, candidateID string) (*CertSummary, error)

	ListPublishedJobs(ctx context.Context, excludeCandidateID string, includeApplied bool, limit, offset int) ([]JobInfo, error)
	HasCandidateApplied(ctx context.Context, candidateID, jobID string) (bool, error)

	GetRecruiterByUserID(ctx context.Context, userID string) (*RecruiterInfo, error)
	ListApplicantsForJob(ctx context.Context, jobID, status string, limit, offset int) ([]ApplicantInfo, error)
}
