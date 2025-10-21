import { useCallback, useEffect, useMemo, useState } from 'react';

import { dealsApi } from 'services/deals';
import type { Deal, DealQuery, PaginatedResponse } from 'types/api';

const DEFAULT_QUERY: DealQuery = {
  page: 1,
  size: 10,
  search: ''
};

interface UseDealsOptions {
  initialQuery?: DealQuery;
}

interface UseDealsResult {
  deals: Deal[];
  data: PaginatedResponse<Deal> | null;
  loading: boolean;
  error: unknown;
  query: DealQuery;
  updateQuery: (patch: Partial<DealQuery>) => void;
  setQuery: (updater: (prev: DealQuery) => DealQuery) => void;
  refetch: () => Promise<void>;
}

export function useDeals(options?: UseDealsOptions): UseDealsResult {
  const [query, setQueryState] = useState<DealQuery>(() => ({
    ...DEFAULT_QUERY,
    ...(options?.initialQuery ?? {})
  }));
  const [data, setData] = useState<PaginatedResponse<Deal> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const effectiveQuery = useMemo(
    () => ({
      ...DEFAULT_QUERY,
      ...query
    }),
    [query]
  );

  const execute = useCallback(async (params: DealQuery) => {
    const result = await dealsApi.listDeals(params);
    setData(result);
    setError(null);
  }, []);

  const loadDeals = useCallback(
    async (params: DealQuery) => {
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
    dealsApi
      .listDeals(effectiveQuery)
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

  const updateQuery = useCallback((patch: Partial<DealQuery>) => {
    setQueryState((prev) => ({
      ...prev,
      ...patch
    }));
  }, []);

  const setQuery = useCallback((updater: (prev: DealQuery) => DealQuery) => {
    setQueryState((prev) => ({
      ...prev,
      ...updater(prev)
    }));
  }, []);

  const refetch = useCallback(async () => {
    await loadDeals(effectiveQuery);
  }, [loadDeals, effectiveQuery]);

  return {
    deals: data?.items ?? [],
    data,
    loading,
    error,
    query: effectiveQuery,
    updateQuery,
    setQuery,
    refetch
  };
}

export default useDeals;
