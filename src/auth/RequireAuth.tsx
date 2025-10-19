import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface RequireAuthProps {
  children: React.ReactNode;
  roles?: string[];
}

/**
 * RequireAuth guards routes with authentication and optional role-based access control.
 * 
 * @param children - The protected content to render
 * @param roles - Optional array of allowed roles. If provided, user must have one of these roles.
 * 
 * @example
 * // Auth only
 * <RequireAuth><Dashboard /></RequireAuth>
 * 
 * // Auth + RBAC
 * <RequireAuth roles={['Admin']}><AdminPanel /></RequireAuth>
 */
export default function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user } = useAuth();
  const loc = useLocation();

  // Check authentication
  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }

  // Check role-based access if roles are specified
  if (roles && roles.length > 0) {
    const userRole = user.role || 'User';
    if (!roles.includes(userRole)) {
      // User is authenticated but doesn't have required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

