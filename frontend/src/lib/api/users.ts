import { api } from "./client";
import type { UserProfileResponse, UpdateProfileResponse } from "./types";

export function getProfile(): Promise<UserProfileResponse> {
  return api.get<UserProfileResponse>("/api/v1/profile");
}

export function updateProfile(data: Record<string, unknown>): Promise<UpdateProfileResponse> {
  return api.put<UpdateProfileResponse>("/api/v1/profile", data);
}
