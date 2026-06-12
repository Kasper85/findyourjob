import { useState, useEffect, useCallback } from "react";
import { getAccessToken, setAuthSession, clearAuthSession, getCurrentUser } from "@/lib/api/client";
import { login as apiLogin, register as apiRegister, getMe } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: getCurrentUser<User>(),
    isLoading: true,
    isAuthenticated: !!getAccessToken(),
  });

  // Check token validity on mount
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      getMe()
        .then((resp) => {
          setState({ user: resp.user, isLoading: false, isAuthenticated: true });
        })
        .catch(() => {
          clearAuthSession();
          setState({ user: null, isLoading: false, isAuthenticated: false });
        });
    } else {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await apiLogin(email, password);
    setState({ user: resp.user, isLoading: false, isAuthenticated: true });
    return resp;
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string, role: string) => {
      const resp = await apiRegister(email, password, name, role);
      setState({ user: resp.user, isLoading: false, isAuthenticated: true });
      return resp;
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  return { ...state, login, register, logout };
}
