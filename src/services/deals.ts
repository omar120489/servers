import { api } from '../api/client';
import config from '../config';
import { getMockDeals, updateMockDeal } from './mocks';

export type Deal = {
  id: number;
  name: string;
  amount: number;
  stage: string;
  company_id?: number;
  contact_id?: number;
  close_date?: string;
  probability?: number;
  created_at?: string;
  updated_at?: string;
};

/**
 * List deals from the server with optional query params.
 * Falls back to mock data in demo mode or on network error.
 *
 * @param params - Query parameters (page, size, sort, search, etc.)
 */
export const listDeals = async (params: any) => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    return Promise.resolve(getMockDeals());
  }

  // Real API call with fallback
  try {
    const response = await api.get('/deals', { params });
    return response.data;
  } catch (error) {
    return getMockDeals();
  }
};

/**
 * Retrieve a single deal by id.
 * Uses mock data in demo mode.
 *
 * @param id - Deal identifier
 */
export const getDeal = async (id: number) => {
  // Demo mode: find mock deal
  if (config.isDemoMode) {
    const { items } = getMockDeals();
    const deal = items.find(d => d.id === String(id));
    if (!deal) throw new Error('Deal not found');
    return Promise.resolve(deal);
  }

  // Real API call
  const response = await api.get(`/deals/${id}`);
  return response.data;
};

/**
 * Create a new deal.
 * Simulates creation in demo mode.
 *
 * @param data - Partial Deal payload
 */
export const createDeal = async (data: Partial<Deal>) => {
  // Demo mode: simulate creation
  if (config.isDemoMode) {
    const newDeal = {
      id: String(Date.now()),
      name: data.name || 'New Deal',
      amount: data.amount || 0,
      stage: data.stage || 'prospecting',
      ...data,
      created_at: new Date().toISOString(),
    };
    return Promise.resolve(newDeal);
  }

  // Real API call
  const response = await api.post('/deals', data);
  return response.data;
};

/**
 * Update an existing deal.
 * Uses mock update in demo mode.
 *
 * @param id - Deal identifier
 * @param data - Partial fields to update
 */
export const updateDeal = async (id: number, data: Partial<Deal>) => {
  // Demo mode: update mock deal
  if (config.isDemoMode) {
    try {
      const updated = updateMockDeal(String(id), data as any);
      return Promise.resolve(updated);
    } catch (error) {
      throw error;
    }
  }

  // Real API call
  const response = await api.patch(`/deals/${id}`, data);
  return response.data;
};

/**
 * Delete a deal by id.
 * Simulates deletion in demo mode.
 *
 * @param id - Deal identifier
 */
export const deleteDeal = async (id: number) => {
  // Demo mode: simulate deletion
  if (config.isDemoMode) {
    return Promise.resolve({ success: true });
  }

  // Real API call
  const response = await api.delete(`/deals/${id}`);
  return response.data;
};

