import { clearAuthSession, getAccessToken, getCurrentUser } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

export type UserRole = User["role"];
export type AuthRedirectPath = "/auth/login" | "/app/dashboard" | "/empresa/dashboard";

const VALID_ROLES: UserRole[] = ["candidate", "recruiter", "admin"];

export function getStoredUser(): User | null {
  return getCurrentUser<User>();
}

export function getStoredUserRole(): UserRole | null {
  const role = getStoredUser()?.role;
  return role && VALID_ROLES.includes(role) ? role : null;
}

export function getHomeForRole(role: UserRole | null): AuthRedirectPath {
  if (role === "candidate") return "/app/dashboard";
  if (role === "recruiter" || role === "admin") return "/empresa/dashboard";
  return "/auth/login";
}

export function getRedirectForDisallowedRole(role: UserRole | null): AuthRedirectPath {
  return getHomeForRole(role);
}

export function requireRole(allowedRoles: readonly UserRole[]): AuthRedirectPath | null {
  if (typeof window === "undefined") return null;

  const token = getAccessToken();
  if (!token) return "/auth/login";

  const role = getStoredUserRole();
  if (!role) {
    clearAuthSession();
    return "/auth/login";
  }

  if (!allowedRoles.includes(role)) {
    return getRedirectForDisallowedRole(role);
  }

  return null;
}

export function getAuthenticatedHomeRedirect(): AuthRedirectPath | null {
  if (typeof window === "undefined") return null;

  const token = getAccessToken();
  if (!token) return null;

  const role = getStoredUserRole();
  if (!role) {
    clearAuthSession();
    return null;
  }

  return getHomeForRole(role);
}
