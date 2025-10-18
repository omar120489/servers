import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Lead } from '../types/crm';
import { fetchLeads } from '../services/leads';

interface LeadsState {
  items: Lead[];
  total: number;
  page: number;
  size: number;
  loading: boolean;
  error?: string;
}

const initialState: LeadsState = {
  items: [], total: 0, page: 1, size: 25, loading: false
};

export const getLeads = createAsyncThunk('leads/get', async (params: { page?: number; size?: number; search?: string } = {}) => {
  const { page = 1, size = 25, search } = params;
  const data = await fetchLeads(page, size, search);
  return data;
});

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeads.pending, (state) => { state.loading = true; state.error = undefined; })
      .addCase(getLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.size = action.payload.size;
      })
      .addCase(getLeads.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export default leadsSlice.reducer;
