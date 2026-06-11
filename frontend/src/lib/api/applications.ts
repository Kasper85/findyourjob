import { api } from "./client";
import type { ApplicationResponse, ApplicationListResponse } from "./types";

export function applyToJob(jobId: string, data?: { cover_letter?: string }): Promise<ApplicationResponse> {
  return api.post(`/api/v1/jobs/${jobId}/apply`, data ?? {});
}

export function listMyApplications(): Promise<ApplicationListResponse> {
  return api.get("/api/v1/applications/me");
}

export function listJobApplications(jobId: string): Promise<ApplicationListResponse> {
  return api.get(`/api/v1/jobs/${jobId}/applications`);
}

export function updateApplicationStatus(appId: string, status: string): Promise<ApplicationResponse> {
  return api.patch(`/api/v1/applications/${appId}/status`, { status });
}
