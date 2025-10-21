import { apiDelete, apiGet, apiPatch, apiPost } from 'utils/axios';
import type {
  ApiResponse,
  Deal,
  DealCreateDto,
  DealQuery,
  DealUpdateDto,
  PaginatedResponse,
  UUID
} from 'types/api';

const BASE_PATH = '/api/deals';

export async function listDeals(query?: DealQuery): Promise<PaginatedResponse<Deal>> {
  return apiGet<PaginatedResponse<Deal>>(BASE_PATH, { params: query });
}

export async function getDeal(id: UUID): Promise<Deal> {
  return apiGet<Deal>(`${BASE_PATH}/${id}`);
}

export async function createDeal(payload: DealCreateDto): Promise<Deal> {
  return apiPost<DealCreateDto, Deal>(BASE_PATH, payload);
}

export async function updateDeal(id: UUID, payload: DealUpdateDto): Promise<Deal> {
  return apiPatch<DealUpdateDto, Deal>(`${BASE_PATH}/${id}`, payload);
}

export async function deleteDeal(id: UUID): Promise<ApiResponse<void>> {
  return apiDelete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}

export const dealsApi = {
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal
};
