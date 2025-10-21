import { useContext } from 'react';

import { ConfigContext } from 'contexts/ConfigContext';
import type { ConfigContextType } from 'types/config';

// ==============================|| CONFIG - HOOKS ||============================== //

export default function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error('useConfig must be used inside ConfigProvider');
  }

  return context;
}
