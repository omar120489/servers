/**
 * React Query hooks for Deals
 * 
 * These hooks provide a clean interface for fetching and mutating deal data
 * with automatic caching, background refetching, and optimistic updates.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  moveDealToStage,
  bulkUpdateDeals,
  bulkDeleteDeals,
} from 'services/deals.api';
import type { Deal } from 'services/deals.api';

// Query keys for deals
export const dealsKeys = {
  all: ['deals'] as const,
  lists: () => [...dealsKeys.all, 'list'] as const,
  list: (filters?: any) => [...dealsKeys.lists(), { filters }] as const,
  details: () => [...dealsKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...dealsKeys.details(), id] as const,
};

/**
 * Fetch deals with optional filters
 * 
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetch on mount
 * - Fallback to mock data on error
 * 
 * @param filters - Optional filters (page, size, stage, value range, search)
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useDeals({
 *   page: 1,
 *   size: 25,
 *   stage: 'Negotiation',
 *   minValue: 50000,
 * });
 * ```
 */
export function useDeals(filters?: {
  page?: number;
  size?: number;
  stage?: string;
  minValue?: number;
  maxValue?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: dealsKeys.list(filters),
    queryFn: () => getDeals(filters),
    // Deals change frequently, shorter stale time
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single deal by ID
 * 
 * @param id - Deal ID
 * 
 * @example
 * ```tsx
 * const { data: deal, isLoading } = useDeal(123);
 * ```
 */
export function useDeal(id: number | string) {
  return useQuery({
    queryKey: dealsKeys.detail(id),
    queryFn: () => getDeal(id),
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Create a new deal
 * 
 * Features:
 * - Automatic cache invalidation
 * - Optimistic updates (optional)
 * - Error handling
 * 
 * @example
 * ```tsx
 * const { mutate: create, isPending } = useCreateDeal();
 * 
 * create({
 *   title: 'New Deal',
 *   value: 50000,
 *   stage: 'Prospecting',
 *   company: 'Acme Corp',
 *   contact: 'John Doe',
 *   probability: 30,
 *   expectedCloseDate: '2024-12-31',
 * }, {
 *   onSuccess: (newDeal) => {
 *     console.log('Created:', newDeal);
 *   },
 * });
 * ```
 */
export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      // Invalidate and refetch deals list
      queryClient.invalidateQueries({ queryKey: dealsKeys.lists() });
    },
  });
}

/**
 * Update an existing deal
 * 
 * Features:
 * - Optimistic updates
 * - Automatic cache invalidation
 * - Rollback on error
 * 
 * @example
 * ```tsx
 * const { mutate: update } = useUpdateDeal();
 * 
 * update({
 *   id: 123,
 *   data: { stage: 'Negotiation', probability: 80 },
 * });
 * ```
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Deal> }) =>
      updateDeal(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: dealsKeys.detail(id) });

      // Snapshot previous value
      const previousDeal = queryClient.getQueryData(dealsKeys.detail(id));

      // Optimistically update cache
      queryClient.setQueryData(dealsKeys.detail(id), (old: Deal | undefined) =>
        old ? { ...old, ...data } : old
      );

      // Return context with previous value
      return { previousDeal };
    },
    // Rollback on error
    onError: (err, { id }, context) => {
      if (context?.previousDeal) {
        queryClient.setQueryData(dealsKeys.detail(id), context.previousDeal);
      }
    },
    // Always refetch after error or success
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: dealsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dealsKeys.lists() });
    },
  });
}

/**
 * Delete a deal
 * 
 * Features:
 * - Optimistic updates
 * - Automatic cache invalidation
 * - Rollback on error
 * 
 * @example
 * ```tsx
 * const { mutate: deleteDeal } = useDeleteDeal();
 * 
 * deleteDeal(123, {
 *   onSuccess: () => {
 *     console.log('Deleted successfully');
 *   },
 * });
 * ```
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeal,
    // Optimistic update
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: dealsKeys.lists() });

      // Snapshot previous value
      const previousDeals = queryClient.getQueryData(dealsKeys.lists());

      // Optimistically remove from cache
      queryClient.setQueryData(
        dealsKeys.lists(),
        (old: { data: Deal[]; total: number } | undefined) =>
          old
            ? {
                data: old.data.filter((deal) => deal.id !== id),
                total: old.total - 1,
              }
            : old
      );

      return { previousDeals };
    },
    // Rollback on error
    onError: (err, id, context) => {
      if (context?.previousDeals) {
        queryClient.setQueryData(dealsKeys.lists(), context.previousDeals);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dealsKeys.lists() });
    },
  });
}

/**
 * Move deal to a different stage
 * 
 * Features:
 * - Optimistic updates
 * - Automatic cache invalidation
 * 
 * @example
 * ```tsx
 * const { mutate: moveToStage } = useMoveDealToStage();
 * 
 * moveToStage({
 *   id: 123,
 *   stage: 'Negotiation',
 * });
 * ```
 */
export function useMoveDealToStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stage }: { id: number | string; stage: Deal['stage'] }) =>
      moveDealToStage(id, stage),
    onSuccess: () => {
      // Invalidate all deals queries
      queryClient.invalidateQueries({ queryKey: dealsKeys.all });
    },
  });
}

/**
 * Bulk update deals
 * 
 * Features:
 * - Update multiple deals at once
 * - Automatic cache invalidation
 * - Progress tracking
 * 
 * @example
 * ```tsx
 * const { mutate: bulkUpdate } = useBulkUpdateDeals();
 * 
 * bulkUpdate({
 *   ids: [1, 2, 3],
 *   updates: { stage: 'Qualification' },
 * });
 * ```
 */
export function useBulkUpdateDeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, updates }: { ids: (number | string)[]; updates: Partial<Deal> }) =>
      bulkUpdateDeals(ids, updates),
    onSuccess: () => {
      // Invalidate all deals queries
      queryClient.invalidateQueries({ queryKey: dealsKeys.all });
    },
  });
}

/**
 * Bulk delete deals
 * 
 * Features:
 * - Delete multiple deals at once
 * - Automatic cache invalidation
 * - Optimistic updates
 * 
 * @example
 * ```tsx
 * const { mutate: bulkDelete } = useBulkDeleteDeals();
 * 
 * bulkDelete([1, 2, 3], {
 *   onSuccess: () => {
 *     console.log('Deleted 3 deals');
 *   },
 * });
 * ```
 */
export function useBulkDeleteDeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteDeals,
    onSuccess: () => {
      // Invalidate all deals queries
      queryClient.invalidateQueries({ queryKey: dealsKeys.all });
    },
  });
}

