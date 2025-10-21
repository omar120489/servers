import { useCallback, useEffect, useMemo, useState } from 'react';

import { leadsApi } from 'services/leads';
import type { Lead, LeadQuery, PaginatedResponse } from 'types/api';

const DEFAULT_QUERY: LeadQuery = {
  page: 1,
  size: 10,
  search: ''
};

interface UseLeadsOptions {
  initialQuery?: LeadQuery;
}

interface UseLeadsResult {
  leads: Lead[];
  data: PaginatedResponse<Lead> | null;
  loading: boolean;
  error: unknown;
  query: LeadQuery;
  updateQuery: (patch: Partial<LeadQuery>) => void;
  setQuery: (updater: (prev: LeadQuery) => LeadQuery) => void;
  refetch: () => Promise<void>;
}

export function useLeads(options?: UseLeadsOptions): UseLeadsResult {
  const [query, setQueryState] = useState<LeadQuery>(() => ({
    ...DEFAULT_QUERY,
    ...(options?.initialQuery ?? {})
  }));
  const [data, setData] = useState<PaginatedResponse<Lead> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const effectiveQuery = useMemo(
    () => ({
      ...DEFAULT_QUERY,
      ...query
    }),
    [query]
  );

  const execute = useCallback(async (params: LeadQuery) => {
    const result = await leadsApi.listLeads(params);
    setData(result);
    setError(null);
  }, []);

  const loadLeads = useCallback(
    async (params: LeadQuery) => {
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

    leadsApi
      .listLeads(effectiveQuery)
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

  const updateQuery = useCallback((patch: Partial<LeadQuery>) => {
    setQueryState((prev) => ({
      ...prev,
      ...patch
    }));
  }, []);

  const setQuery = useCallback((updater: (prev: LeadQuery) => LeadQuery) => {
    setQueryState((prev) => updater(prev));
  }, []);

  const refetch = useCallback(async () => {
    await loadLeads(effectiveQuery);
  }, [loadLeads, effectiveQuery]);

  return {
    leads: data?.items ?? [],
    data,
    loading,
    error,
    query: effectiveQuery,
    updateQuery,
    setQuery,
    refetch
  };
}

export default useLeads;
