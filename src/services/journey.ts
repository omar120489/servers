import { apiGet, apiPost } from 'utils/axios';
import type {
  JourneyEvent,
  JourneyEventCreateDto,
  JourneyEventListResponse,
  EntityIdentifier
} from 'types/api';

const API_BASE_URL = '/api/v1/journey-events';

/**
 * List journey events for a specific entity
 */
export async function listJourneyEvents(
  entityType: 'deal' | 'lead',
  entityId: EntityIdentifier,
  options?: {
    limit?: number;
    offset?: number;
    since?: string;
  }
): Promise<JourneyEventListResponse> {
  const params = {
    entity_type: entityType,
    entity_id: entityId,
    ...options
  };
  
  const response = await apiGet<{
    items: Array<{
      id: string;
      entity_type: string;
      entity_id: EntityIdentifier;
      type: string;
      payload?: Record<string, unknown>;
      occurred_at: string;
      created_at: string;
      updated_at?: string;
    }>;
    total: number;
  }>(API_BASE_URL, { params });

  // Map snake_case to camelCase
  return {
    items: response.items.map((item) => ({
      id: item.id,
      entityType: item.entity_type as 'deal' | 'lead',
      entityId: item.entity_id,
      type: item.type,
      payload: item.payload,
      occurredAt: item.occurred_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at || item.created_at
    })),
    total: response.total
  };
}

/**
 * Create a new journey event
 */
export async function createJourneyEvent(
  dto: JourneyEventCreateDto
): Promise<JourneyEvent> {
  // Map camelCase to snake_case for backend
  const payload = {
    entity_type: dto.entityType,
    entity_id: dto.entityId,
    type: dto.type,
    payload: dto.payload,
    occurred_at: dto.occurredAt
  };

  const response = await apiPost<{
    id: string;
    entity_type: string;
    entity_id: EntityIdentifier;
    type: string;
    payload?: Record<string, unknown>;
    occurred_at: string;
    created_at: string;
    updated_at?: string;
  }>(API_BASE_URL, payload);

  // Map snake_case to camelCase
  return {
    id: response.id,
    entityType: response.entity_type as 'deal' | 'lead',
    entityId: response.entity_id,
    type: response.type,
    payload: response.payload,
    occurredAt: response.occurred_at,
    createdAt: response.created_at,
    updatedAt: response.updated_at || response.created_at
  };
}

export const journeyApi = {
  listJourneyEvents,
  createJourneyEvent
};


