package matching

import (
	"context"
	"fmt"
	"math"
	"sort"
)

type MatchingService interface {
	GetMatch(ctx context.Context, userID, jobID string) (*MatchResponse, error)
	GetRecommendations(ctx context.Context, userID string, minScore float64, includeApplied bool, limit, offset int) (*RecommendationListResponse, error)
	GetApplicants(ctx context.Context, userID, role, jobID string, statusFilter string, minScore float64, limit, offset int) (*ApplicantListResponse, error)
}

type matchingService struct {
	store MatchingDataStore
}

func NewService(store MatchingDataStore) MatchingService {
	return &matchingService{store: store}
}

func (s *matchingService) GetMatch(ctx context.Context, userID, jobID string) (*MatchResponse, error) {
	candidate, err := s.store.FindCandidateByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("candidate: %w", err)
	}
	return s.calculateMatch(ctx, candidate, jobID)
}

func (s *matchingService) GetRecommendations(ctx context.Context, userID string, minScore float64, includeApplied bool, limit, offset int) (*RecommendationListResponse, error) {
	candidate, err := s.store.FindCandidateByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("candidate: %w", err)
	}
	jobs, err := s.store.ListPublishedJobs(ctx, candidate.ID, includeApplied, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list jobs: %w", err)
	}
	var items []RecommendationItem
	for _, job := range jobs {
		match, err := s.calculateMatch(ctx, candidate, job.ID)
		if err != nil {
			continue
		}
		if match.Score >= minScore {
			items = append(items, RecommendationItem{
				Job:   JobSummary{ID: job.ID, Title: job.Title, CompanyID: job.CompanyID, Location: job.Location, IsRemote: job.IsRemote, JobType: job.JobType, Status: job.Status},
				Match: match.Breakdown,
			})
		}
	}
	sort.Slice(items, func(i, j int) bool { return scoreFromBreakdown(items[i].Match) > scoreFromBreakdown(items[j].Match) })
	if items == nil {
		items = []RecommendationItem{}
	}
	return &RecommendationListResponse{Data: items, Limit: limit, Offset: offset, Count: len(items)}, nil
}

func (s *matchingService) GetApplicants(ctx context.Context, userID, role, jobID string, statusFilter string, minScore float64, limit, offset int) (*ApplicantListResponse, error) {
	if role != "recruiter" && role != "admin" {
		return nil, fmt.Errorf("only recruiters and admins can view applicants")
	}
	job, err := s.store.FindJobByID(ctx, jobID)
	if err != nil {
		return nil, fmt.Errorf("job: %w", err)
	}
	if role == "recruiter" {
		rec, err := s.store.GetRecruiterByUserID(ctx, userID)
		if err != nil {
			return nil, fmt.Errorf("recruiter: %w", err)
		}
		if job.CompanyID != rec.CompanyID && (job.ID != rec.ID) {
			return nil, fmt.Errorf("not authorized to view applicants for this job")
		}
	}
	applicants, err := s.store.ListApplicantsForJob(ctx, jobID, statusFilter, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list applicants: %w", err)
	}
	var items []ApplicantRankingItem
	for _, a := range applicants {
		cand := &CandidateInfo{ID: a.CandidateID, Name: a.Name, ExperienceYears: a.ExperienceYears}
		match, err := s.calculateMatch(ctx, cand, jobID)
		if err != nil || match.Score < minScore {
			continue
		}
		items = append(items, ApplicantRankingItem{
			Application: ApplicantSummary{ID: a.ApplicationID, Status: a.ApplicationStatus, AppliedAt: a.AppliedAt},
			Candidate:   CandidateSummary{ID: a.CandidateID, UserID: a.UserID, Name: a.Name, Email: a.Email, ExperienceYears: a.ExperienceYears},
			Match:       match.Breakdown,
		})
	}
	sort.Slice(items, func(i, j int) bool { return scoreFromBreakdown(items[i].Match) > scoreFromBreakdown(items[j].Match) })
	if items == nil {
		items = []ApplicantRankingItem{}
	}
	return &ApplicantListResponse{
		Job:    JobSummary{ID: job.ID, Title: job.Title, CompanyID: job.CompanyID, Location: job.Location, IsRemote: job.IsRemote, JobType: job.JobType, Status: job.Status},
		Data:   items,
		Limit:  limit,
		Offset: offset,
		Count:  len(items),
	}, nil
}

func (s *matchingService) calculateMatch(ctx context.Context, candidate *CandidateInfo, jobID string) (*MatchResponse, error) {
	jobSkills, _ := s.store.GetJobSkills(ctx, jobID)
	candSkills, _ := s.store.GetCandidateSkills(ctx, candidate.ID)
	candSkillMap := make(map[string]string)
	for _, sk := range candSkills {
		candSkillMap[sk.ID] = sk.Name
	}
	var skillsScore float64
	var matchedSkills, missingSkills []SkillInfo
	if len(jobSkills) == 0 {
		skillsScore = 0
	} else {
		matched := 0
		for _, js := range jobSkills {
			if _, ok := candSkillMap[js.ID]; ok {
				matchedSkills = append(matchedSkills, js)
				matched++
			} else {
				missingSkills = append(missingSkills, js)
			}
		}
		skillsScore = math.Round(float64(matched)/float64(len(jobSkills))*100*10) / 10
	}
	evalSum, _ := s.store.GetCandidateEvalSummary(ctx, candidate.ID)
	evalScore := math.Round(evalSum.AvgScore*10) / 10
	if evalScore > 100 {
		evalScore = 100
	}
	var expScore float64
	switch {
	case candidate.ExperienceYears >= 6:
		expScore = 100
	case candidate.ExperienceYears >= 3:
		expScore = 80
	case candidate.ExperienceYears >= 1:
		expScore = 50
	default:
		expScore = 20
	}
	certSum, _ := s.store.GetCandidateCertSummary(ctx, candidate.ID)
	var certScore float64
	if certSum.VerifiedCount > 0 {
		certScore = 100
	} else if certSum.UnverifiedCount > 0 {
		certScore = 50
	}
	w := DefaultWeights
	total := skillsScore*w.Skills + evalScore*w.Evaluations + expScore*w.Experience + certScore*w.Certifications
	total = math.Round(total*10) / 10
	matchedNames := make([]string, len(matchedSkills))
	for i, s := range matchedSkills {
		matchedNames[i] = s.Name
	}
	missingNames := make([]string, len(missingSkills))
	for i, s := range missingSkills {
		missingNames[i] = s.Name
	}
	return &MatchResponse{
		JobID: jobID, CandidateID: candidate.ID, Score: total, Level: MatchLevel(total),
		Breakdown:     MatchBreakdown{Skills: skillsScore, Evaluations: evalScore, Experience: expScore, Certifications: certScore},
		MatchedSkills: matchedNames, MissingSkills: missingNames,
		Explanation: generateExplanation(skillsScore, evalScore, expScore, certScore, len(jobSkills), len(matchedSkills)),
	}, nil
}

func scoreFromBreakdown(b MatchBreakdown) float64 {
	return b.Skills*DefaultWeights.Skills + b.Evaluations*DefaultWeights.Evaluations + b.Experience*DefaultWeights.Experience + b.Certifications*DefaultWeights.Certifications
}

func generateExplanation(skills, evals, exp, cert float64, totalJobSkills, totalMatched int) string {
	_, _, _, _ = evals, exp, cert, totalMatched
	switch {
	case skills >= 80:
		return "Candidate has most of the required skills."
	case skills >= 50:
		return "Candidate matches some required skills."
	case totalJobSkills == 0:
		return "Job has no skills configured."
	default:
		return "Candidate has few matching skills."
	}
}
