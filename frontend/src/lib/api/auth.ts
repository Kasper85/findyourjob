import { api, setAuthSession, clearAuthSession } from "./client";
import type { AuthResponse, User, UserProfileResponse } from "./types";

export async function register(
  email: string,
  password: string,
  name: string,
  role: string,
): Promise<AuthResponse> {
  const resp = await api.post<AuthResponse>("/api/v1/auth/register", {
    email,
    password,
    name,
    role,
  });
  setAuthSession(resp.token.access_token, resp.token.refresh_token, resp.user);
  return resp;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const resp = await api.post<AuthResponse>("/api/v1/auth/login", { email, password });
  setAuthSession(resp.token.access_token, resp.token.refresh_token, resp.user);
  return resp;
}

export function logout(): void {
  clearAuthSession();
}

export function getMe(): Promise<UserProfileResponse> {
  return api.get<UserProfileResponse>("/api/v1/me");
}
