import { api } from "./client";
import type { Certification, CertificationListResponse } from "./types";

export function listCertifications(params?: Record<string, string>): Promise<CertificationListResponse> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/api/v1/certifications${qs}`);
}

export function getCertification(id: string): Promise<{ certification: Certification }> {
  return api.get(`/api/v1/certifications/${id}`);
}

export function createCertification(data: Record<string, unknown>): Promise<{ certification: Certification }> {
  return api.post("/api/v1/certifications", data);
}

export function updateCertification(id: string, data: Record<string, unknown>): Promise<{ certification: Certification }> {
  return api.put(`/api/v1/certifications/${id}`, data);
}

export function deleteCertification(id: string): Promise<void> {
  return api.delete(`/api/v1/certifications/${id}`);
}

export function listMyCertifications(): Promise<CertificationListResponse> {
  return api.get("/api/v1/candidate/certifications");
}

export function verifyCertification(id: string, verified: boolean): Promise<{ certification: Certification }> {
  return api.patch(`/api/v1/certifications/${id}/verify`, { verified });
}
