import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from 'types/auth';

// Account state interface
export interface AccountState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: UserProfile | null;
}

const initialState: AccountState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// Action payload types
interface LoginPayload {
  user: UserProfile;
}

interface RegisterPayload {
  user: UserProfile;
}

// ==============================|| SLICE - ACCOUNT ||============================== //

const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      const { user } = action.payload;
      state.isLoggedIn = true;
      state.isInitialized = true;
      state.user = user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isInitialized = true;
      state.user = null;
    },
    register(state, action: PayloadAction<RegisterPayload>) {
      const { user } = action.payload;
      state.user = user;
      // Note: Don't auto-login on register, let the auth flow handle that
    },
    initialize(state) {
      state.isInitialized = true;
    }
  }
});

export default account.reducer;
export const { login, logout, register, initialize } = account.actions;
