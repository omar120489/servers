/**
 * Deals API Service
 * 
 * Handles all API calls related to deals.
 * Uses axios for HTTP requests with proper error handling.
 */

import axios from 'axios';

// Create API client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Deal interface
export interface Deal {
  id: number | string;
  title: string;
  value: number;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  company: string;
  contact: string;
  probability: number;
  expectedCloseDate: string;
  created_at?: string;
  updated_at?: string;
}

// Mock data for fallback when API is unavailable
const mockDeals: Deal[] = [
  { id: 1, title: 'Enterprise software license', value: 50000, stage: 'Prospecting', company: 'Acme Corp', contact: 'John Smith', probability: 30, expectedCloseDate: '2024-11-15' },
  { id: 2, title: 'Cloud migration project', value: 75000, stage: 'Qualification', company: 'TechCorp', contact: 'Jane Doe', probability: 50, expectedCloseDate: '2024-11-20' },
  { id: 3, title: 'Annual support contract', value: 25000, stage: 'Proposal', company: 'Innovate Inc', contact: 'Bob Wilson', probability: 70, expectedCloseDate: '2024-11-10' },
  { id: 4, title: 'Custom development', value: 120000, stage: 'Negotiation', company: 'Digital Solutions', contact: 'Alice Brown', probability: 80, expectedCloseDate: '2024-12-01' },
  { id: 5, title: 'Training package', value: 15000, stage: 'Closed Won', company: 'StartupXYZ', contact: 'Charlie Green', probability: 100, expectedCloseDate: '2024-10-15' },
  { id: 6, title: 'Consulting services', value: 45000, stage: 'Prospecting', company: 'Enterprise Co', contact: 'Diana White', probability: 25, expectedCloseDate: '2024-12-15' },
  { id: 7, title: 'Integration project', value: 90000, stage: 'Qualification', company: 'Global Tech', contact: 'Eve Black', probability: 45, expectedCloseDate: '2024-11-25' },
  { id: 8, title: 'Security audit', value: 35000, stage: 'Closed Lost', company: 'SecureNet', contact: 'Frank Gray', probability: 0, expectedCloseDate: '2024-10-20' },
];

/**
 * Fetch deals with pagination and filters
 * 
 * @param params - Query parameters (page, size, filters)
 * @returns Promise<{ data: Deal[], total: number }>
 */
export async function getDeals(params?: {
  page?: number;
  size?: number;
  stage?: string;
  minValue?: number;
  maxValue?: number;
  search?: string;
}): Promise<{ data: Deal[]; total: number }> {
  try {
    const response = await apiClient.get<{ data: Deal[]; total: number }>('/deals', {
      params,
    });
    return response.data;
  } catch (error) {
    console.warn('[Deals API] Failed to fetch deals, using mock data:', error);
    // Return mock data as fallback
    return {
      data: mockDeals,
      total: mockDeals.length,
    };
  }
}

/**
 * Fetch a single deal by ID
 * 
 * @param id - Deal ID
 * @returns Promise<Deal>
 */
export async function getDeal(id: number | string): Promise<Deal> {
  try {
    const response = await apiClient.get<Deal>(`/deals/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`[Deals API] Failed to fetch deal ${id}, using mock data:`, error);
    // Return mock data as fallback
    const deal = mockDeals.find(d => d.id === Number(id));
    if (!deal) {
      throw new Error(`Deal ${id} not found`);
    }
    return deal;
  }
}

/**
 * Create a new deal
 * 
 * @param deal - Deal data (without ID)
 * @returns Promise<Deal>
 */
export async function createDeal(deal: Omit<Deal, 'id'>): Promise<Deal> {
  try {
    const response = await apiClient.post<Deal>('/deals', deal);
    return response.data;
  } catch (error) {
    console.error('[Deals API] Failed to create deal:', error);
    throw error;
  }
}

/**
 * Update an existing deal
 * 
 * @param id - Deal ID
 * @param deal - Partial deal data to update
 * @returns Promise<Deal>
 */
export async function updateDeal(id: number | string, deal: Partial<Deal>): Promise<Deal> {
  try {
    const response = await apiClient.put<Deal>(`/deals/${id}`, deal);
    return response.data;
  } catch (error) {
    console.error(`[Deals API] Failed to update deal ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a deal
 * 
 * @param id - Deal ID
 * @returns Promise<void>
 */
export async function deleteDeal(id: number | string): Promise<void> {
  try {
    await apiClient.delete(`/deals/${id}`);
  } catch (error) {
    console.error(`[Deals API] Failed to delete deal ${id}:`, error);
    throw error;
  }
}

/**
 * Move deal to a different stage
 * 
 * @param id - Deal ID
 * @param stage - New stage
 * @returns Promise<Deal>
 */
export async function moveDealToStage(
  id: number | string,
  stage: Deal['stage']
): Promise<Deal> {
  return updateDeal(id, { stage });
}

/**
 * Bulk update deals (change stage, etc.)
 * 
 * @param ids - Array of deal IDs
 * @param updates - Updates to apply to all deals
 * @returns Promise<Deal[]>
 */
export async function bulkUpdateDeals(
  ids: (number | string)[],
  updates: Partial<Deal>
): Promise<Deal[]> {
  try {
    const response = await apiClient.post<Deal[]>('/deals/bulk-update', {
      ids,
      updates,
    });
    return response.data;
  } catch (error) {
    console.error('[Deals API] Failed to bulk update deals:', error);
    throw error;
  }
}

/**
 * Bulk delete deals
 * 
 * @param ids - Array of deal IDs
 * @returns Promise<void>
 */
export async function bulkDeleteDeals(ids: (number | string)[]): Promise<void> {
  try {
    await apiClient.post('/deals/bulk-delete', { ids });
  } catch (error) {
    console.error('[Deals API] Failed to bulk delete deals:', error);
    throw error;
  }
}

