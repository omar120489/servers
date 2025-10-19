import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { api, setTokens } from '../api/client';

type User = { id: number; email: string; role?: string };
type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
const Ctx = createContext<AuthCtx>({} as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage if token exists
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        // For demo token, return a mock user
        if (token.startsWith('demo-token-')) {
          return { id: 1, email: 'demo@example.com', role: 'admin' };
        }
        // For real tokens, we'd need to decode the JWT or fetch user info
        // For now, return a placeholder
        return { id: 0, email: 'user@example.com', role: 'user' };
      }
    } catch {}
    return null;
  });

  const login = async (email: string, password: string) => {
    // Demo mode: bypass API call if credentials match demo account
    if (email === 'demo@example.com' && password === 'demo') {
      const mockUser = { id: 1, email: 'demo@example.com', role: 'admin' };
      const mockToken = 'demo-token-' + Date.now();
      setTokens({ accessToken: mockToken, refreshToken: mockToken });
      try { localStorage.setItem('access_token', mockToken); } catch {}
      setUser(mockUser);
      return;
    }
    
    // Real API call for other credentials
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

