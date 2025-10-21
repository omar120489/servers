import { createContext, useEffect, useCallback, type ReactNode } from 'react';

// third party
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession
} from 'amazon-cognito-identity-js';

// project imports
import Loader from 'ui-component/Loader';
import { useDispatch, useSelector } from 'store';
import { login as loginAction, logout as logoutAction, initialize } from 'store/slices/account';
import type { AuthContextType } from 'types/auth';
import { mapCognitoProfile, setSession, clearAuthStorage, handleAuthError } from './auth-utils';

// ==============================|| AWS COGNITO SETUP ||============================== //

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_APP_AWS_USER_POOL_ID || '',
  ClientId: import.meta.env.VITE_APP_AWS_CLIENT_ID || ''
});

// ==============================|| AWS COGNITO CONTEXT & PROVIDER ||============================== //

const AWSCognitoContext = createContext<AuthContextType | null>(null);

interface AWSCognitoProviderProps {
  children: ReactNode;
}

export function AWSCognitoProvider({ children }: AWSCognitoProviderProps) {
  const dispatch = useDispatch();
  const { isLoggedIn, isInitialized, user } = useSelector((state) => state.account);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = userPool.getCurrentUser();

        if (currentUser) {
          currentUser.getSession((err: any, session: CognitoUserSession | null) => {
            if (err) {
              console.error('Cognito session error:', err);
              dispatch(initialize());
              return;
            }

            if (session && session.isValid()) {
              const accessToken = session.getAccessToken().getJwtToken();
              setSession(accessToken);

              currentUser.getUserAttributes((attrErr, attributes) => {
                if (attrErr) {
                  console.error('Cognito attributes error:', attrErr);
                  dispatch(initialize());
                  return;
                }

                const attributesObj =
                  attributes?.reduce(
                    (acc, attr) => {
                      acc[attr.getName()] = attr.getValue();
                      return acc;
                    },
                    {} as Record<string, string>
                  ) || {};

                const standardUser = mapCognitoProfile(currentUser, attributesObj);
                dispatch(loginAction({ user: standardUser }));
              });
            } else {
              dispatch(initialize());
            }
          });
        } else {
          dispatch(initialize());
        }
      } catch (error) {
        console.error('Cognito initialization failed:', error);
        dispatch(initialize());
      }
    };

    initializeAuth();
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const cognitoUser = new CognitoUser({
          Username: email,
          Pool: userPool
        });

        const authenticationDetails = new AuthenticationDetails({
          Username: email,
          Password: password
        });

        return new Promise<void>((resolve, reject) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (session: CognitoUserSession) => {
              const accessToken = session.getAccessToken().getJwtToken();
              setSession(accessToken);

              cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                  reject(err);
                  return;
                }

                const attributesObj =
                  attributes?.reduce(
                    (acc, attr) => {
                      acc[attr.getName()] = attr.getValue();
                      return acc;
                    },
                    {} as Record<string, string>
                  ) || {};

                const standardUser = mapCognitoProfile(cognitoUser, attributesObj);
                dispatch(loginAction({ user: standardUser }));
                resolve();
              });
            },
            onFailure: (err) => {
              reject(err);
            },
            newPasswordRequired: () => {
              reject(new Error('New password required'));
            }
          });
        });
      } catch (error) {
        handleAuthError(error, 'AWS Cognito', 'login');
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        const attributeList = [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({ Name: 'given_name', Value: firstName }),
          new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
          new CognitoUserAttribute({ Name: 'name', Value: `${firstName} ${lastName}` })
        ];

        return new Promise<void>((resolve, reject) => {
          userPool.signUp(email, password, attributeList, [], (err, result) => {
            if (err) {
              reject(err);
              return;
            }

            console.log('Cognito registration successful:', result);
            // Note: User will need to confirm email before they can login
            resolve();
          });
        });
      } catch (error) {
        handleAuthError(error, 'AWS Cognito', 'register');
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      const currentUser = userPool.getCurrentUser();

      if (currentUser) {
        currentUser.signOut();
      }

      clearAuthStorage();
      dispatch(logoutAction());
    } catch (error) {
      console.error('Cognito logout error:', error);
      // Even if logout fails, clear local state
      dispatch(logoutAction());
    }
  }, [dispatch]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      return new Promise<void>((resolve, reject) => {
        cognitoUser.forgotPassword({
          onSuccess: () => {
            resolve();
          },
          onFailure: (err) => {
            reject(err);
          }
        });
      });
    } catch (error) {
      handleAuthError(error, 'AWS Cognito', 'resetPassword');
    }
  }, []);

  const updateProfile = useCallback(async () => {
    try {
      const currentUser = userPool.getCurrentUser();

      if (!currentUser) {
        throw new Error('No current user');
      }

      // Implementation would require specific attributes to update
      console.warn('AWS Cognito profile update not implemented');
    } catch (error) {
      handleAuthError(error, 'AWS Cognito', 'updateProfile');
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

  return <AWSCognitoContext.Provider value={contextValue}>{children}</AWSCognitoContext.Provider>;
}

export default AWSCognitoContext;
