import { api } from '../api/client';
import config from '../config';
import type { Lead } from '../types/crm';
import { getMockLeads } from './mocks';

export interface LeadList {
  items: Lead[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export async function fetchLeads(page = 1, size = 25, search?: string): Promise<LeadList> {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    return Promise.resolve(getMockLeads(page, size, search));
  }

  // Real API call
  try {
    const params: any = { page, size };
    if (search) params.search = search;
    const { data } = await api.get<LeadList>('/leads', { params });
    return data;
  } catch (error) {
    // Fallback to mock data on error
    return getMockLeads(page, size, search);
  }
}

export async function createLead(payload: Partial<Lead>): Promise<Lead> {
  // Demo mode: simulate creation
  if (config.isDemoMode) {
    const newLead: Lead = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    return Promise.resolve(newLead);
  }

  // Real API call
  const { data } = await api.post<Lead>('/leads', payload);
  return data;
}
