/**
 * React Query hooks for Contacts
 * 
 * These hooks provide a clean interface for fetching and mutating contact data
 * with automatic caching, background refetching, and optimistic updates.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  type Contact,
} from 'services/contacts.api';

// Query keys for contacts
export const contactsKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactsKeys.all, 'list'] as const,
  list: (filters?: string) => [...contactsKeys.lists(), { filters }] as const,
  details: () => [...contactsKeys.all, 'detail'] as const,
  detail: (id: number) => [...contactsKeys.details(), id] as const,
};

/**
 * Fetch all contacts
 * 
 * Features:
 * - Automatic caching (5 min stale time)
 * - Background refetch on mount
 * - Fallback to mock data on error
 * 
 * @example
 * ```tsx
 * const { data: contacts, isLoading, error } = useContacts();
 * ```
 */
export function useContacts() {
  return useQuery({
    queryKey: contactsKeys.lists(),
    queryFn: getContacts,
    // Override default stale time for contacts (they don't change often)
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch a single contact by ID
 * 
 * @param id - Contact ID
 * 
 * @example
 * ```tsx
 * const { data: contact, isLoading } = useContact(123);
 * ```
 */
export function useContact(id: number) {
  return useQuery({
    queryKey: contactsKeys.detail(id),
    queryFn: () => getContact(id),
    enabled: !!id, // Only run query if ID is provided
  });
}

/**
 * Create a new contact
 * 
 * Features:
 * - Automatic cache invalidation
 * - Optimistic updates (optional)
 * - Error handling
 * 
 * @example
 * ```tsx
 * const { mutate: create, isPending } = useCreateContact();
 * 
 * create({
 *   name: 'Jane Doe',
 *   email: 'jane@example.com',
 *   // ...
 * }, {
 *   onSuccess: (newContact) => {
 *     console.log('Created:', newContact);
 *   },
 *   onError: (error) => {
 *     console.error('Failed:', error);
 *   },
 * });
 * ```
 */
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      // Invalidate and refetch contacts list
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() });
    },
  });
}

/**
 * Update an existing contact
 * 
 * Features:
 * - Optimistic updates
 * - Automatic cache invalidation
 * - Rollback on error
 * 
 * @example
 * ```tsx
 * const { mutate: update } = useUpdateContact();
 * 
 * update({
 *   id: 123,
 *   data: { name: 'Updated Name' },
 * });
 * ```
 */
export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Contact> }) =>
      updateContact(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: contactsKeys.detail(id) });

      // Snapshot previous value
      const previousContact = queryClient.getQueryData(contactsKeys.detail(id));

      // Optimistically update cache
      queryClient.setQueryData(contactsKeys.detail(id), (old: Contact | undefined) =>
        old ? { ...old, ...data } : old
      );

      // Return context with previous value
      return { previousContact };
    },
    // Rollback on error
    onError: (err, { id }, context) => {
      if (context?.previousContact) {
        queryClient.setQueryData(contactsKeys.detail(id), context.previousContact);
      }
    },
    // Always refetch after error or success
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() });
    },
  });
}

/**
 * Delete a contact
 * 
 * Features:
 * - Optimistic updates
 * - Automatic cache invalidation
 * - Rollback on error
 * 
 * @example
 * ```tsx
 * const { mutate: deleteContact } = useDeleteContact();
 * 
 * deleteContact(123, {
 *   onSuccess: () => {
 *     console.log('Deleted successfully');
 *   },
 * });
 * ```
 */
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContact,
    // Optimistic update
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: contactsKeys.lists() });

      // Snapshot previous value
      const previousContacts = queryClient.getQueryData(contactsKeys.lists());

      // Optimistically remove from cache
      queryClient.setQueryData(contactsKeys.lists(), (old: Contact[] | undefined) =>
        old ? old.filter((contact) => contact.id !== id) : old
      );

      return { previousContacts };
    },
    // Rollback on error
    onError: (err, id, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(contactsKeys.lists(), context.previousContacts);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() });
    },
  });
}

