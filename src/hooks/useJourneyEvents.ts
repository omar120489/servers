import { useCallback, useEffect, useState } from 'react';
import { journeyApi } from 'services/journey';
import { useWebSocketEvents } from './useWebSocketEvents';
import type { JourneyEvent, JourneyEventCreateDto, EntityIdentifier } from 'types/api';

interface UseJourneyEventsOptions {
  entityType: 'deal' | 'lead';
  entityId: EntityIdentifier;
}

interface UseJourneyEventsResult {
  events: JourneyEvent[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  addEvent: (dto: Omit<JourneyEventCreateDto, 'entityType' | 'entityId'>) => Promise<void>;
}

/**
 * Hook to manage journey events for a specific entity
 * 
 * Features:
 * - Auto-loads events on mount
 * - Subscribes to WebSocket for real-time updates
 * - Provides methods to add events and refresh
 */
export function useJourneyEvents({
  entityType,
  entityId
}: UseJourneyEventsOptions): UseJourneyEventsResult {
  const [events, setEvents] = useState<JourneyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEvents = useCallback(async () => {
    if (!entityId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await journeyApi.listJourneyEvents(entityType, entityId);
      setEvents(response.items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load journey events'));
      console.error('[useJourneyEvents] Load failed:', err);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  // Load events on mount and when entityId changes
  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  // Subscribe to WebSocket for real-time updates
  useWebSocketEvents('journey:new', (event: unknown) => {
    try {
      const journeyEvent = event as {
        entity_type?: string;
        entity_id?: EntityIdentifier;
        id: string;
        type: string;
        payload?: Record<string, unknown>;
        occurred_at: string;
        created_at: string;
        updated_at?: string;
      };

      // Filter events for this entity
      if (
        journeyEvent.entity_type === entityType &&
        String(journeyEvent.entity_id) === String(entityId)
      ) {
        // Map to camelCase
        const mappedEvent: JourneyEvent = {
          id: journeyEvent.id,
          entityType: journeyEvent.entity_type as 'deal' | 'lead',
          entityId: journeyEvent.entity_id,
          type: journeyEvent.type,
          payload: journeyEvent.payload,
          occurredAt: journeyEvent.occurred_at,
          createdAt: journeyEvent.created_at,
          updatedAt: journeyEvent.updated_at || journeyEvent.created_at
        };

        // Prepend new event (events are sorted desc by occurred_at)
        setEvents((prev) => [mappedEvent, ...prev]);
      }
    } catch (err) {
      console.error('[useJourneyEvents] WebSocket event processing failed:', err);
    }
  });

  const refresh = useCallback(async () => {
    await loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback(
    async (dto: Omit<JourneyEventCreateDto, 'entityType' | 'entityId'>) => {
      try {
        const fullDto: JourneyEventCreateDto = {
          entityType,
          entityId,
          ...dto
        };

        const newEvent = await journeyApi.createJourneyEvent(fullDto);

        // Optimistically add to state (WS will also send it, but we dedupe by id)
        setEvents((prev) => {
          const exists = prev.some((e) => e.id === newEvent.id);
          if (exists) return prev;
          return [newEvent, ...prev];
        });
      } catch (err) {
        console.error('[useJourneyEvents] Failed to add event:', err);
        throw err;
      }
    },
    [entityType, entityId]
  );

  return {
    events,
    loading,
    error,
    refresh,
    addEvent
  };
}


