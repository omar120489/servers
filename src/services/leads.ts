import { apiDelete, apiGet, apiPatch, apiPost } from 'utils/axios';
import { getAttributionPayload, markAttributionSent } from 'utils/attribution';
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
  // Attempt to get attribution data (will be null if already sent this session)
  const attribution = getAttributionPayload();
  
  // Merge attribution into payload if available
  const finalPayload = attribution 
    ? { ...payload, attribution }
    : payload;
  
  // Create lead with attribution
  const response = await apiPost<LeadCreateDto, Lead>(BASE_PATH, finalPayload);
  
  // Mark attribution as sent after successful creation
  if (attribution) {
    markAttributionSent();
    if (import.meta.env.DEV) {
      console.log('[Attribution] Sent with lead:', {
        leadId: response.id,
        uti: attribution.uti,
        utm_source: attribution.utm?.source,
        ad_id: attribution.platform?.ad_id
      });
    }
  }
  
  return response;
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
