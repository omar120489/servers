import { createContext, useEffect, useCallback, type ReactNode } from 'react';

// third party
import { useAuth0 } from '@auth0/auth0-react';

// project imports
import Loader from 'ui-component/Loader';
import { useDispatch, useSelector } from 'store';
import { login as loginAction, logout as logoutAction, initialize } from 'store/slices/account';
import type { AuthContextType } from 'types/auth';
import { mapAuth0Profile, setSession, clearAuthStorage, handleAuthError } from './auth-utils';

// ==============================|| AUTH0 CONTEXT & PROVIDER ||============================== //

const Auth0Context = createContext<AuthContextType | null>(null);

interface Auth0ProviderProps {
  children: ReactNode;
}

export function Auth0Provider({ children }: Auth0ProviderProps) {
  const dispatch = useDispatch();
  const { isLoggedIn, isInitialized, user } = useSelector((state) => state.account);

  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  // Initialize auth state based on Auth0 status
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated && auth0User) {
          // Get access token and set session
          const token = await getAccessTokenSilently();
          setSession(token);

          // Map Auth0 user to standard profile and dispatch login
          const standardUser = mapAuth0Profile(auth0User);
          dispatch(loginAction({ user: standardUser }));
        } else {
          dispatch(initialize());
        }
      } catch (error) {
        console.error('Auth0 initialization failed:', error);
        dispatch(initialize());
      }
    };

    if (!isLoading) {
      initializeAuth();
    }
  }, [isAuthenticated, auth0User, isLoading, getAccessTokenSilently, dispatch]);

  const login = useCallback(
    async (email: string, _password: string) => {
      try {
        // Auth0 uses redirect-based login, not email/password directly
        // This maintains compatibility with the AuthContextType interface
        await loginWithRedirect({
          authorizationParams: {
            login_hint: email
          }
        });
      } catch (error) {
        handleAuthError(error, 'Auth0', 'login');
      }
    },
    [loginWithRedirect]
  );

  const register = useCallback(
    async (email: string, _password: string, _firstName: string, _lastName: string) => {
      try {
        // Auth0 registration typically happens via redirect
        await loginWithRedirect({
          authorizationParams: {
            screen_hint: 'signup',
            login_hint: email
            // Note: Auth0 doesn't support direct password/name passing in redirect
            // Consider using Auth0 Management API for programmatic registration
          }
        });
      } catch (error) {
        handleAuthError(error, 'Auth0', 'register');
      }
    },
    [loginWithRedirect]
  );

  const logout = useCallback(async () => {
    try {
      clearAuthStorage();
      dispatch(logoutAction());

      await auth0Logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Auth0 logout error:', error);
      // Even if Auth0 logout fails, clear local state
      dispatch(logoutAction());
    }
  }, [auth0Logout, dispatch]);

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        // Auth0 password reset typically happens via redirect to hosted pages
        // This would need to be implemented via Auth0 Management API or hosted pages
        console.warn('Auth0 password reset should be handled via Auth0 hosted pages');

        // Redirect to Auth0 password reset
        await loginWithRedirect({
          authorizationParams: {
            screen_hint: 'reset-password',
            login_hint: email
          }
        });
      } catch (error) {
        handleAuthError(error, 'Auth0', 'resetPassword');
      }
    },
    [loginWithRedirect]
  );

  const updateProfile = useCallback(async () => {
    try {
      // Auth0 profile updates typically happen via Management API
      console.warn('Auth0 profile update should be implemented via Management API');
      // Implementation would require Management API token and user ID
    } catch (error) {
      handleAuthError(error, 'Auth0', 'updateProfile');
    }
  }, []);

  // Show loader while Auth0 is loading
  if (isLoading || !isInitialized) {
    return <Loader />;
  }

  const contextValue: AuthContextType = {
    isLoggedIn,
    isInitialized,
    user,
    login,
    logout,
    register,
    resetPassword,
    updateProfile
  };

  return <Auth0Context.Provider value={contextValue}>{children}</Auth0Context.Provider>;
}

export default Auth0Context;
