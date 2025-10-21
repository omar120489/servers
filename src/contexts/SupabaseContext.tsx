import { createContext, useEffect, useCallback, type ReactNode } from 'react';

// third party
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// project imports
import Loader from 'ui-component/Loader';
import { useDispatch, useSelector } from 'store';
import { login as loginAction, logout as logoutAction, initialize } from 'store/slices/account';
import type { AuthContextType } from 'types/auth';
import {
  mapSupabaseProfile,
  setSession,
  clearAuthStorage,
  handleAuthError,
  isValidEmail,
  isValidPassword
} from './auth-utils';

// ==============================|| SUPABASE SETUP ||============================== //

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY || '';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ==============================|| SUPABASE CONTEXT & PROVIDER ||============================== //

const SupabaseContext = createContext<AuthContextType | null>(null);

interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const dispatch = useDispatch();
  const { isLoggedIn, isInitialized, user } = useSelector((state) => state.account);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Supabase session error:', error);
          dispatch(initialize());
          return;
        }

        if (session?.user) {
          // Set session token
          setSession(session.access_token);

          // Map Supabase user to standard profile
          const standardUser = mapSupabaseProfile(session.user);
          dispatch(loginAction({ user: standardUser }));
        } else {
          dispatch(initialize());
        }
      } catch (error) {
        console.error('Supabase initialization failed:', error);
        dispatch(initialize());
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase auth state change:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        setSession(session.access_token);
        const standardUser = mapSupabaseProfile(session.user);
        dispatch(loginAction({ user: standardUser }));
      } else if (event === 'SIGNED_OUT') {
        clearAuthStorage();
        dispatch(logoutAction());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // Auth state change listener will handle the Redux dispatch
      console.log('Supabase login successful:', data);
    } catch (error) {
      handleAuthError(error, 'Supabase', 'login');
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        if (!isValidEmail(email)) {
          throw new Error('Invalid email format');
        }

        if (!isValidPassword(password)) {
          throw new Error('Password must be at least 6 characters');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              firstName,
              lastName,
              full_name: `${firstName} ${lastName}`
            }
          }
        });

        if (error) {
          throw error;
        }

        console.log('Supabase registration successful:', data);
        // Note: User may need to confirm email before they can login
      } catch (error) {
        handleAuthError(error, 'Supabase', 'register');
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase logout error:', error);
      }

      // Auth state change listener will handle the Redux dispatch
      clearAuthStorage();
    } catch (error) {
      console.error('Supabase logout error:', error);
      // Even if logout fails, clear local state
      dispatch(logoutAction());
    }
  }, [dispatch]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      console.log('Password reset email sent');
    } catch (error) {
      handleAuthError(error, 'Supabase', 'resetPassword');
    }
  }, []);

  const updateProfile = useCallback(async () => {
    try {
      const {
        data: { user: currentUser }
      } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error('No current user');
      }

      // Implementation would require specific data to update
      console.warn('Supabase profile update not implemented');

      // Example implementation:
      // const { error } = await supabase.auth.updateUser({
      //   data: { firstName: 'New Name' }
      // });
    } catch (error) {
      handleAuthError(error, 'Supabase', 'updateProfile');
    }
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

  return <SupabaseContext.Provider value={contextValue}>{children}</SupabaseContext.Provider>;
}

export default SupabaseContext;
