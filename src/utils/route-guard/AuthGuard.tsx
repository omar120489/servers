import { useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';

// project imports
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Authentication guard for routes
 * Redirects to login if user is not authenticated
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return children;
}
