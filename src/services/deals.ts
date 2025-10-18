import { api } from '../api/client';

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

export const listDeals = (params: any) => api.get('/deals', { params }).then(r => r.data);
export const getDeal = (id: number) => api.get(`/deals/${id}`).then(r => r.data);
export const createDeal = (data: Partial<Deal>) => api.post('/deals', data).then(r => r.data);
export const updateDeal = (id: number, data: Partial<Deal>) => api.patch(`/deals/${id}`, data).then(r => r.data);
export const deleteDeal = (id: number) => api.delete(`/deals/${id}`).then(r => r.data);

