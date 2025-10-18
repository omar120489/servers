import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createBerryTheme } from './berryTheme';
import type { Theme } from '@mui/material/styles';

type Ctx = { mode: 'light' | 'dark'; toggleColorMode: () => void; theme: Theme } | null;
const Context = createContext<Ctx>(null);

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  useEffect(() => { const s = localStorage.getItem('color-mode') as 'light' | 'dark' | null; if (s) setMode(s); }, []);
  const toggleColorMode = () => setMode(m => { const next = m === 'light' ? 'dark' : 'light'; localStorage.setItem('color-mode', next); return next; });
  const theme = useMemo(() => createBerryTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggleColorMode, theme }), [mode, theme]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useColorModeTheme() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useColorModeTheme must be used within ColorModeProvider');
  return ctx;
}
