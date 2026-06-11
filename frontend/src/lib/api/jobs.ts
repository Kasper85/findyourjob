import { api } from "./client";
import type { Job, JobListResponse } from "./types";

export function listJobs(params?: Record<string, string>): Promise<JobListResponse> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get<JobListResponse>(`/api/v1/jobs${qs}`);
}

export function getJob(id: string): Promise<{ job: Job }> {
  return api.get(`/api/v1/jobs/${id}`);
}

export function createJob(data: Record<string, unknown>): Promise<{ job: Job }> {
  return api.post("/api/v1/jobs", data);
}

export function updateJob(id: string, data: Record<string, unknown>): Promise<{ job: Job }> {
  return api.put(`/api/v1/jobs/${id}`, data);
}

export function deleteJob(id: string): Promise<void> {
  return api.delete(`/api/v1/jobs/${id}`);
}
