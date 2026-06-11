import { api } from "./client";
import type { Interview, InterviewListResponse } from "./types";

export function createInterview(appId: string, data: Record<string, unknown>): Promise<{ interview: Interview }> {
  return api.post(`/api/v1/applications/${appId}/interviews`, data);
}

export function listMyInterviews(): Promise<InterviewListResponse> {
  return api.get("/api/v1/interviews/me");
}

export function getInterview(id: string): Promise<{ interview: Interview }> {
  return api.get(`/api/v1/interviews/${id}`);
}

export function updateInterview(id: string, data: Record<string, unknown>): Promise<{ interview: Interview }> {
  return api.put(`/api/v1/interviews/${id}`, data);
}

export function updateInterviewStatus(id: string, status: string): Promise<{ interview: Interview }> {
  return api.patch(`/api/v1/interviews/${id}/status`, { status });
}

export function deleteInterview(id: string): Promise<void> {
  return api.delete(`/api/v1/interviews/${id}`);
}

export function listJobInterviews(jobId: string): Promise<InterviewListResponse> {
  return api.get(`/api/v1/jobs/${jobId}/interviews`);
}
