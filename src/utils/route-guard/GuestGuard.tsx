import { useNavigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';

// project imports
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';

// ==============================|| GUEST GUARD ||============================== //

interface GuestGuardProps {
  children: ReactNode;
}

/**
 * Guest guard for routes having no auth required
 * Redirects authenticated users to dashboard
 */
export default function GuestGuard({ children }: GuestGuardProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(DASHBOARD_PATH, { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return children;
}
