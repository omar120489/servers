import { createContext, useEffect, useCallback, type ReactNode } from 'react';

// third party
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// project imports
import Loader from 'ui-component/Loader';
import { useDispatch, useSelector } from 'store';
import { login as loginAction, logout as logoutAction, initialize } from 'store/slices/account';
import type { AuthContextType, UserProfile } from 'types/auth';

// firebase initialize
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
  });
}

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const FirebaseContext = createContext<AuthContextType | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const dispatch = useDispatch();
  const { isLoggedIn, isInitialized, user } = useSelector((state) => state.account);

  useEffect(() => {
    const unsubscriber = firebase.auth().onIdTokenChanged((firebaseUser) => {
      if (firebaseUser) {
        const userProfile: UserProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ')[1] || '',
          name: firebaseUser.displayName || ''
        };

        dispatch(loginAction({ user: userProfile }));
      } else {
        dispatch(initialize());
      }
    });

    return () => unsubscriber();
  }, [dispatch]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // onIdTokenChanged will handle the login dispatch
    } catch (error) {
      console.error('Firebase login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        const result = await firebase.auth().createUserWithEmailAndPassword(email, password);

        // Update profile with name
        if (result.user) {
          await result.user.updateProfile({
            displayName: `${firstName} ${lastName}`
          });
        }

        // onIdTokenChanged will handle the login dispatch
      } catch (error) {
        console.error('Firebase registration error:', error);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await firebase.auth().signOut();
      dispatch(logoutAction());
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
  }, [dispatch]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Firebase password reset error:', error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async () => {
    // Implementation depends on your requirements
    console.log('Update profile not implemented for Firebase');
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

  return <FirebaseContext.Provider value={contextValue}>{children}</FirebaseContext.Provider>;
}

export default FirebaseContext;
