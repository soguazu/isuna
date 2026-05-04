import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '@/lib/types/auth';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  storeAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
};

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function readStoredAuth(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
  return { token, user, isAuthenticated: !!token && !!user };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(readStoredAuth);

  const storeAuth = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ token, user, isAuthenticated: true });
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ token: null, user: null, isAuthenticated: false });
  }, []);

  return <AuthContext.Provider value={{ ...state, storeAuth, clearAuth }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
