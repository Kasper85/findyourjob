import { api } from "./client";
import type { MatchResponse, RecommendationListResponse, ApplicantListResponse } from "./types";

export function getJobMatch(jobId: string): Promise<MatchResponse> {
  return api.get(`/api/v1/matching/jobs/${jobId}/me`);
}

export function getRecommendations(params?: Record<string, string>): Promise<RecommendationListResponse> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/api/v1/matching/recommendations${qs}`);
}

export function getApplicantRanking(jobId: string, params?: Record<string, string>): Promise<ApplicantListResponse> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/api/v1/matching/jobs/${jobId}/applicants${qs}`);
}
