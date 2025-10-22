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

function toDealUpdateDto(payload: DealUpdateDto): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (payload.name !== undefined) out.name = payload.name;
  if (payload.amount !== undefined) out.amount = payload.amount;
  if (payload.stage !== undefined) out.stage = payload.stage;
  if (payload.status !== undefined) out.status = payload.status;
  if (payload.ownerId !== undefined) out.ownerId = payload.ownerId;
  if (payload.companyId !== undefined) out.companyId = payload.companyId;
  if (payload.contactId !== undefined) out.contactId = payload.contactId;
  if (payload.closeDate !== undefined) out.closeDate = payload.closeDate;
  if (payload.probability !== undefined) out.probability = payload.probability;
  if (payload.description !== undefined) out.description = payload.description;
  if (payload.grossRevenue !== undefined) out.gross_revenue = payload.grossRevenue;
  if (payload.directCost !== undefined) out.direct_cost = payload.directCost;
  if (payload.lossReason !== undefined) out.loss_reason = payload.lossReason;
  if (payload.lossNotes !== undefined) out.loss_notes = payload.lossNotes;
  return out;
}

function fromDealDto(dto: any): Deal {
  return {
    id: dto.id,
    createdAt: dto.createdAt || dto.created_at,
    updatedAt: dto.updatedAt || dto.updated_at,
    name: dto.name,
    amount: dto.amount,
    stage: dto.stage,
    status: dto.status,
    ownerId: dto.ownerId || dto.owner_id,
    companyId: dto.companyId || dto.company_id,
    contactId: dto.contactId || dto.contact_id,
    closeDate: dto.closeDate || dto.close_date,
    probability: dto.probability,
    description: dto.description,
    grossRevenue: dto.grossRevenue ?? dto.gross_revenue ?? null,
    directCost: dto.directCost ?? dto.direct_cost ?? null,
    netProfit: dto.netProfit ?? dto.net_profit ?? null,
    lossReason: dto.lossReason ?? dto.loss_reason ?? null,
    lossNotes: dto.lossNotes ?? dto.loss_notes ?? null
  };
}

export async function listDeals(query?: DealQuery): Promise<PaginatedResponse<Deal>> {
  const response = await apiGet<PaginatedResponse<any>>(BASE_PATH, { params: query });
  return {
    ...response,
    items: response.items.map(fromDealDto)
  };
}

export async function getDeal(id: UUID): Promise<Deal> {
  const response = await apiGet<any>(`${BASE_PATH}/${id}`);
  return fromDealDto(response);
}

export async function createDeal(payload: DealCreateDto): Promise<Deal> {
  const response = await apiPost<DealCreateDto, any>(BASE_PATH, payload);
  return fromDealDto(response);
}

export async function updateDeal(id: UUID, payload: DealUpdateDto): Promise<Deal> {
  const mappedPayload = toDealUpdateDto(payload);
  const response = await apiPatch<Record<string, unknown>, any>(`${BASE_PATH}/${id}`, mappedPayload);
  return fromDealDto(response);
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
