import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import * as auth from '../utils/auth';

interface AuthContextValue {
  isAuth: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(auth.isAuthenticated());

  const value = useMemo(() => ({
    isAuth,
    login: (email: string, password: string) => {
      const ok = auth.signIn(email, password);
      if (ok) setIsAuth(true);
      return ok;
    },
    logout: () => {
      auth.signOut();
      setIsAuth(false);
    },
  }), [isAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
