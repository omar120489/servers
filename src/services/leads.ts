import { apiDelete, apiGet, apiPatch, apiPost } from 'utils/axios';
import type {
  ApiResponse,
  Lead,
  LeadCreateDto,
  LeadQuery,
  LeadUpdateDto,
  PaginatedResponse,
  UUID
} from 'types/api';

const BASE_PATH = '/api/leads';

export async function listLeads(query?: LeadQuery): Promise<PaginatedResponse<Lead>> {
  return apiGet<PaginatedResponse<Lead>>(BASE_PATH, { params: query });
}

export async function getLead(id: UUID): Promise<Lead> {
  return apiGet<Lead>(`${BASE_PATH}/${id}`);
}

export async function createLead(payload: LeadCreateDto): Promise<Lead> {
  return apiPost<LeadCreateDto, Lead>(BASE_PATH, payload);
}

export async function updateLead(id: UUID, payload: LeadUpdateDto): Promise<Lead> {
  return apiPatch<LeadUpdateDto, Lead>(`${BASE_PATH}/${id}`, payload);
}

export async function deleteLead(id: UUID): Promise<ApiResponse<void>> {
  return apiDelete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}

export const leadsApi = {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead
};
