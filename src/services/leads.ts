import api from './api';
import type { Lead } from '../types/crm';

export interface LeadList {
  items: Lead[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export async function fetchLeads(page = 1, size = 25, search?: string) {
  const params: any = { page, size };
  if (search) params.search = search;
  const { data } = await api.get<LeadList>('/leads', { params });
  return data;
}

export async function createLead(payload: Partial<Lead>) {
  const { data } = await api.post<Lead>('/leads', payload);
  return data;
}
