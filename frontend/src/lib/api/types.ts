// ── Shared API Types ─────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  token: TokenPair;
}

export interface CandidateProfile {
  id: string;
  user_id: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience_years: number;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  preferred_remote: boolean;
  preferred_location?: string;
  salary_min?: number;
  salary_max?: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  user: User;
  profile?: CandidateProfile;
}

export interface UpdateProfileResponse {
  message: string;
  profile: CandidateProfile;
}

export interface Job {
  id: string;
  company_id: string;
  recruiter_id?: string;
  title: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  location?: string;
  is_remote: boolean;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  job_type?: string;
  status: string;
  posted_at?: string;
  expires_at?: string;
  external_url?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface JobListResponse {
  data: Job[];
  limit: number;
  offset: number;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: string;
  cover_letter?: string;
  resume_snapshot_url?: string;
  applied_at?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationResponse {
  application: Application;
  job_title?: string;
}

export interface ApplicationListResponse {
  data: ApplicationResponse[];
  limit: number;
  offset: number;
}

export interface Evaluation {
  id: string;
  title: string;
  description?: string;
  type: string;
  duration_minutes?: number;
  passing_score?: number;
  max_score?: number;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EvaluationListResponse {
  data: { evaluation: Evaluation }[];
  limit: number;
  offset: number;
}

export interface EvaluationResult {
  id: string;
  evaluation_id: string;
  candidate_id: string;
  score: number;
  passed?: boolean;
  answers?: string;
  feedback?: string;
  taken_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EvaluationResultResponse {
  result: EvaluationResult;
  evaluation_title?: string;
}

export interface ResultListResponse {
  data: EvaluationResultResponse[];
  limit: number;
  offset: number;
}

export interface MatchBreakdown {
  skills: number;
  evaluations: number;
  experience: number;
  certifications: number;
}

export interface MatchResponse {
  job_id: string;
  candidate_id: string;
  score: number;
  level: string;
  breakdown: MatchBreakdown;
  matched_skills: string[];
  missing_skills: string[];
  explanation: string;
}

export interface RecommendationItem {
  job: Job;
  match: MatchBreakdown;
}

export interface RecommendationListResponse {
  data: RecommendationItem[];
  limit: number;
  offset: number;
  count: number;
}

export interface ApplicantRankingItem {
  application: { id: string; status: string; applied_at: string };
  candidate: { id: string; user_id: string; name: string; email: string; experience_years: number };
  match: MatchBreakdown;
}

export interface ApplicantListResponse {
  job: Job;
  data: ApplicantRankingItem[];
  limit: number;
  offset: number;
  count: number;
}

export interface Certification {
  id: string;
  candidate_id: string;
  name: string;
  issuer: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CertificationListResponse {
  data: Certification[];
  limit: number;
  offset: number;
}

export interface Interview {
  id: string;
  application_id: string;
  recruiter_id: string;
  candidate_id: string;
  scheduled_at: string;
  duration_minutes: number;
  type?: string;
  location_or_link?: string;
  status: string;
  notes?: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewListResponse {
  data: Interview[];
  limit: number;
  offset: number;
}
