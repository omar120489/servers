import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface AuthState {
  loading: boolean;
  error?: string;
  user?: any;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: !!localStorage.getItem('access_token')
};

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const { data } = await api.post('/auth/login', payload);
  localStorage.setItem('access_token', data.access_token);
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('access_token');
      state.isAuthenticated = false;
      state.user = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = undefined; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
