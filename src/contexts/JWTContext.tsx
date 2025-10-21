import { createContext, useEffect, useCallback, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// project imports
import Loader from 'ui-component/Loader';
import { authApi } from 'utils/axios';
import axiosServices from 'utils/axios';
import { useDispatch, useSelector } from 'store';
import { login as loginAction, logout as logoutAction, initialize } from 'store/slices/account';
import type { AuthContextType } from 'types/auth';

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<AuthContextType | null>(null);

interface JWTProviderProps {
  children: ReactNode;
}

function verifyToken(serviceToken: string): boolean {
  if (!serviceToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(serviceToken);

    // Ensure 'exp' exists and compare it to the current timestamp
    if (!decoded.exp) {
      throw new Error("Token does not contain 'exp' property.");
    }

    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

function setSession(serviceToken: string | null) {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axiosServices.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axiosServices.defaults.headers.common.Authorization;
  }
}

export function JWTProvider({ children }: JWTProviderProps) {
  const dispatch = useDispatch();
  const { isLoggedIn, isInitialized, user } = useSelector((state) => state.account);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');

        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const response = await authApi.getProfile();
          const { user: userProfile } = response;

          dispatch(loginAction({ user: userProfile }));
        } else {
          dispatch(initialize());
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
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
      // todo: this flow need to be recode as it not verified
      const response = await authApi.register({
        email,
        password,
        firstName,
        lastName
      });

      let users = response.data;

      if (
        window.localStorage.getItem('users') !== undefined &&
        window.localStorage.getItem('users') !== null
      ) {
        const localUsers = window.localStorage.getItem('users');
        users = [
          ...JSON.parse(localUsers!),
          {
            email,
            password,
            name: `${firstName} ${lastName}`
          }
        ];
      }

      window.localStorage.setItem('users', JSON.stringify(users));
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

  // Show loader while initializing
  if (!isInitialized) {
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

  return <JWTContext.Provider value={contextValue}>{children}</JWTContext.Provider>;
}

export default JWTContext;
