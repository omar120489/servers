import type { UserProfile } from 'types/auth';

export const LOGIN = 'LOGIN' as const;
export const LOGOUT = 'LOGOUT' as const;
export const REGISTER = 'REGISTER' as const;

export interface LoginAction {
  type: typeof LOGIN;
  payload: {
    user: UserProfile | null;
    [key: string]: unknown;
  };
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface RegisterAction {
  type: typeof REGISTER;
  payload: {
    user: UserProfile | null;
    [key: string]: unknown;
  };
}

export type AccountAction = LoginAction | LogoutAction | RegisterAction;
