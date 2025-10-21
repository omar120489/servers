import { useContext, type Context } from 'react';

import AuthContext from 'contexts/JWTContext';
import type { AuthContextType } from 'types/auth';

const authContext = AuthContext as unknown as Context<AuthContextType | null>;

// ==============================|| AUTH HOOKS ||============================== //

export default function useAuth(): AuthContextType {
  const context = useContext(authContext);

  if (!context) {
    throw new Error('useAuth must be used inside provider');
  }

  return context;
}
