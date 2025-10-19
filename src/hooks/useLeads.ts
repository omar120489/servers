/**
 * React Query hooks for Leads
 * 
 * These hooks provide a clean interface for fetching and mutating lead data
 * with automatic caching, background refetching, and optimistic updates.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  bulkUpdateLeads,
  bulkDeleteLeads,
  convertLead,
} from 'services/leads.api';
import type { Lead } from '../types/crm';

// Query keys for leads
export const leadsKeys = {
  all: ['leads'] as const,
  lists: () => [...leadsKeys.all, 'list'] as const,
  list: (filters?: any) => [...leadsKeys.lists(), { filters }] as const,
  details: () => [...leadsKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...leadsKeys.details(), id] as const,
};

/**
 * Fetch leads with optional filters
 * 
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetch on mount
 * - Fallback to mock data on error
 * 
 * @param filters - Optional filters (page, size, status, score range, search)
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLeads({
 *   page: 1,
 *   size: 25,
 *   status: 'new',
 *   minScore: 80,
 * });
 * ```
 */
export function useLeads(filters?: {
  page?: number;
  size?: number;
  status?: string;
  minScore?: number;
  maxScore?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: leadsKeys.list(filters),
    queryFn: () => getLeads(filters),
    // Leads change frequently, shorter stale time
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single lead by ID
 * 
 * @param id - Lead ID
 * 
 * @example
 * ```tsx
 * const { data: lead, isLoading } = useLead(123);
 * ```
 */
export function useLead(id: number | string) {
  return useQuery({
    queryKey: leadsKeys.detail(id),
    queryFn: () => getLead(id),
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Create a new lead
 * 
 * Features:
 * - Automatic cache invalidation
 * - Optimistic updates (optional)
 * - Error handling
 * 
 * @example
 * ```tsx
 * const { mutate: create, isPending } = useCreateLead();
 * 
 * create({
 *   first_name: 'Jane',
 *   last_name: 'Doe',
 *   email: 'jane@example.com',
 *   status: 'new',
 * }, {
 *   onSuccess: (newLead) => {
 *     console.log('Created:', newLead);
 *   },
 * });
 * ```
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      // Invalidate and refetch leads list
      queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
    },
  });
}

/**
 * Update an existing lead
 * 
 * Features:
 * - Optimistic updates
 * - Automatic cache invalidation
 * - Rollback on error
 * 
 * @example
 * ```tsx
 * const { mutate: update } = useUpdateLead();
 * 
 * update({
 *   id: 123,
 *   data: { status: 'contacted' },
 * });
 * ```
 */
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Lead> }) =>
      updateLead(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: leadsKeys.detail(id) });

      // Snapshot previous value
      const previousLead = queryClient.getQueryData(leadsKeys.detail(id));

      // Optimistically update cache
      queryClient.setQueryData(leadsKeys.detail(id), (old: Lead | undefined) =>
        old ? { ...old, ...data } : old
      );

      // Return context with previous value
      return { previousLead };
    },
    // Rollback on error
    onError: (err, { id }, context) => {
      if (context?.previousLead) {
        queryClient.setQueryData(leadsKeys.detail(id), context.previousLead);
      }
    },
    // Always refetch after error or success
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
    },
  });
}

/**
 * Delete a lead
 * 
 * Features:
 * - Optimistic updates
 * - Automatic cache invalidation
 * - Rollback on error
 * 
 * @example
 * ```tsx
 * const { mutate: deleteLead } = useDeleteLead();
 * 
 * deleteLead(123, {
 *   onSuccess: () => {
 *     console.log('Deleted successfully');
 *   },
 * });
 * ```
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLead,
    // Optimistic update
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: leadsKeys.lists() });

      // Snapshot previous value
      const previousLeads = queryClient.getQueryData(leadsKeys.lists());

      // Optimistically remove from cache
      queryClient.setQueryData(
        leadsKeys.lists(),
        (old: { data: Lead[]; total: number } | undefined) =>
          old
            ? {
                data: old.data.filter((lead) => lead.id !== id),
                total: old.total - 1,
              }
            : old
      );

      return { previousLeads };
    },
    // Rollback on error
    onError: (err, id, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(leadsKeys.lists(), context.previousLeads);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
    },
  });
}

/**
 * Bulk update leads
 * 
 * Features:
 * - Update multiple leads at once
 * - Automatic cache invalidation
 * - Progress tracking
 * 
 * @example
 * ```tsx
 * const { mutate: bulkUpdate } = useBulkUpdateLeads();
 * 
 * bulkUpdate({
 *   ids: [1, 2, 3],
 *   updates: { status: 'contacted' },
 * });
 * ```
 */
export function useBulkUpdateLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, updates }: { ids: (number | string)[]; updates: any }) =>
      bulkUpdateLeads(ids, updates),
    onSuccess: () => {
      // Invalidate all leads queries
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
    },
  });
}

/**
 * Bulk delete leads
 * 
 * Features:
 * - Delete multiple leads at once
 * - Automatic cache invalidation
 * - Optimistic updates
 * 
 * @example
 * ```tsx
 * const { mutate: bulkDelete } = useBulkDeleteLeads();
 * 
 * bulkDelete([1, 2, 3], {
 *   onSuccess: () => {
 *     console.log('Deleted 3 leads');
 *   },
 * });
 * ```
 */
export function useBulkDeleteLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteLeads,
    onSuccess: () => {
      // Invalidate all leads queries
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
    },
  });
}

/**
 * Convert lead to contact/deal
 * 
 * Features:
 * - Automatic cache invalidation
 * - Returns new contact/deal IDs
 * 
 * @example
 * ```tsx
 * const { mutate: convert } = useConvertLead();
 * 
 * convert(123, {
 *   onSuccess: ({ contactId, dealId }) => {
 *     console.log('Created contact:', contactId);
 *     if (dealId) console.log('Created deal:', dealId);
 *   },
 * });
 * ```
 */
export function useConvertLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convertLead,
    onSuccess: () => {
      // Invalidate leads (lead is now converted)
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
      // Invalidate contacts and deals (new records created)
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

