import { api } from "./client";
import type { Evaluation, EvaluationListResponse, EvaluationResultResponse, ResultListResponse } from "./types";

export function listEvaluations(params?: Record<string, string>): Promise<EvaluationListResponse> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/api/v1/evaluations${qs}`);
}

export function getEvaluation(id: string): Promise<{ evaluation: Evaluation }> {
  return api.get(`/api/v1/evaluations/${id}`);
}

export function createEvaluation(data: Record<string, unknown>): Promise<{ evaluation: Evaluation }> {
  return api.post("/api/v1/evaluations", data);
}

export function submitEvaluationResult(evalId: string, score: number, answers?: unknown): Promise<EvaluationResultResponse> {
  return api.post(`/api/v1/evaluations/${evalId}/results`, { score, answers });
}

export function listMyEvaluationResults(): Promise<ResultListResponse> {
  return api.get("/api/v1/evaluation-results/me");
}

export function listEvaluationResults(evalId: string): Promise<ResultListResponse> {
  return api.get(`/api/v1/evaluations/${evalId}/results`);
}
