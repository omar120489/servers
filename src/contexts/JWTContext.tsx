import { createContext, useEffect, useCallback, useMemo, type ReactNode } from 'react';
// project imports
import Loader from 'ui-component/Loader';
import { authApi } from 'utils/axios';
import { setSession, verifyToken } from './jwt-helpers';
import { useDispatch, useSelector } from 'store';
import { login as loginAction, logout as logoutAction, initialize } from 'store/slices/account';
import type { AuthContextType } from 'types/auth';

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<AuthContextType | null>(null);

interface JWTProviderProps {
  readonly children: ReactNode;
}

export function JWTProvider({ children }: JWTProviderProps) {
  const dispatch = useDispatch();
  const { isLoggedIn, isInitialized, user } = useSelector((state) => state.account);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = globalThis.localStorage.getItem('serviceToken');

        if (serviceToken) {
          if (verifyToken(serviceToken)) {
            setSession(serviceToken);
            const response = await authApi.getProfile();
            const { user: userProfile } = response;

            dispatch(loginAction({ user: userProfile }));
            return;
          }

          console.warn('Invalid or expired serviceToken detected, clearing session');
          setSession(null);
        }

        dispatch(initialize());
      } catch (err) {
        console.error('Auth initialization failed:', err);
        setSession(null);
        dispatch(initialize());
      }
    };

    init();
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login(email, password);
      const { serviceToken, user: userProfile } = response;

      setSession(serviceToken);
      dispatch(loginAction({ user: userProfile }));
    },
    [dispatch]
  );

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      // Registration flow - stores users locally for dev/demo purposes
      // Production: This should call backend API and handle proper user creation
      const response = await authApi.register({
        email,
        password,
        firstName,
        lastName
      });

      let users = response.data;

      if (
        globalThis.localStorage.getItem('users') !== undefined &&
        globalThis.localStorage.getItem('users') !== null
      ) {
        const localUsers = globalThis.localStorage.getItem('users');
        users = [
          ...JSON.parse(localUsers!),
          {
            email,
            password,
            name: `${firstName} ${lastName}`
          }
        ];
      }

      globalThis.localStorage.setItem('users', JSON.stringify(users));
    },
    []
  );

  const logout = useCallback(() => {
    setSession(null);
    dispatch(logoutAction());
  }, [dispatch]);

  const resetPassword = useCallback(async (email: string) => {
    // Implementation depends on your backend API
    await authApi.resetPassword(email);
  }, []);

  const updateProfile = useCallback(() => {
    // Implementation depends on your requirements
    console.log('Update profile not implemented');
  }, []);

  const contextValue: AuthContextType = useMemo(
    () => ({
      isLoggedIn,
      isInitialized,
      user,
      login,
      logout,
      register,
      resetPassword,
      updateProfile
    }),
    [isLoggedIn, isInitialized, user, login, logout, register, resetPassword, updateProfile]
  );

  // Show loader while initializing
  if (!isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={contextValue}>{children}</JWTContext.Provider>;
}

export default JWTContext;
