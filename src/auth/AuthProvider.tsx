import React, { createContext, useContext, useMemo, useState } from 'react';
import { api, setTokens } from '../api/client';

type User = { id: number; email: string; role?: string };
type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
const Ctx = createContext<AuthCtx>({} as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const r = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token, user } = r.data;
    setTokens({ accessToken: access_token, refreshToken: refresh_token });
    // Mirror token to localStorage to align with App's auth gate
    try { localStorage.setItem('access_token', access_token); } catch {}
    setUser(user);
  };

  const logout = () => {
    setTokens(null);
    try { localStorage.removeItem('access_token'); } catch {}
    setUser(null);
    window.location.href = '/login';
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);

