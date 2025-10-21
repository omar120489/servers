import { createContext, useMemo, type ReactNode } from 'react';

import config from 'config';
import { useLocalStorage } from 'hooks/useLocalStorage';
import type { ConfigContextType } from 'types/config';

// ==============================|| CONFIG CONTEXT ||============================== //

export const ConfigContext = createContext<ConfigContextType | null>(null);

// ==============================|| CONFIG PROVIDER ||============================== //

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const { state, setState, setField, resetState } = useLocalStorage('berry-config-vite-ts', config);

  const memoizedValue = useMemo(
    () => ({ state, setState, setField, resetState }),
    [state, setField, setState, resetState]
  );

  return <ConfigContext.Provider value={memoizedValue}>{children}</ConfigContext.Provider>;
}
