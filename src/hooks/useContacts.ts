import { useCallback, useEffect, useMemo, useState } from 'react';

import { contactsApi } from 'services/contacts';
import type { Contact, ContactQuery, PaginatedResponse } from 'types/api';

const DEFAULT_QUERY: ContactQuery = {
  page: 1,
  size: 10,
  search: ''
};

interface UseContactsOptions {
  initialQuery?: ContactQuery;
}

interface UseContactsResult {
  contacts: Contact[];
  data: PaginatedResponse<Contact> | null;
  loading: boolean;
  error: unknown;
  query: ContactQuery;
  updateQuery: (patch: Partial<ContactQuery>) => void;
  setQuery: (updater: (prev: ContactQuery) => ContactQuery) => void;
  refetch: () => Promise<void>;
}

export function useContacts(options?: UseContactsOptions): UseContactsResult {
  const [query, setQueryState] = useState<ContactQuery>(() => ({
    ...DEFAULT_QUERY,
    ...(options?.initialQuery ?? {})
  }));
  const [data, setData] = useState<PaginatedResponse<Contact> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const effectiveQuery = useMemo(
    () => ({
      ...DEFAULT_QUERY,
      ...query
    }),
    [query]
  );

  const execute = useCallback(async (params: ContactQuery) => {
    const result = await contactsApi.listContacts(params);
    setData(result);
    setError(null);
  }, []);

  const loadContacts = useCallback(
    async (params: ContactQuery) => {
      setLoading(true);
      try {
        await execute(params);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [execute]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);

    contactsApi
      .listContacts(effectiveQuery)
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [effectiveQuery]);

  const updateQuery = useCallback((patch: Partial<ContactQuery>) => {
    setQueryState((prev) => ({
      ...prev,
      ...patch
    }));
  }, []);

  const setQuery = useCallback((updater: (prev: ContactQuery) => ContactQuery) => {
    setQueryState((prev) => ({
      ...prev,
      ...updater(prev)
    }));
  }, []);

  const refetch = useCallback(async () => {
    await loadContacts(effectiveQuery);
  }, [loadContacts, effectiveQuery]);

  return {
    contacts: data?.items ?? [],
    data,
    loading,
    error,
    query: effectiveQuery,
    updateQuery,
    setQuery,
    refetch
  };
}

export default useContacts;
