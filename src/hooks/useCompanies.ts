import { useCallback, useEffect, useMemo, useState } from 'react';

import { companiesApi } from 'services/companies';
import type { Company, CompanyQuery, PaginatedResponse } from 'types/api';

const DEFAULT_QUERY: CompanyQuery = {
  page: 1,
  size: 10,
  search: '',
  companySize: null
};

interface UseCompaniesOptions {
  initialQuery?: CompanyQuery;
}

interface UseCompaniesResult {
  companies: Company[];
  data: PaginatedResponse<Company> | null;
  loading: boolean;
  error: unknown;
  query: CompanyQuery;
  updateQuery: (patch: Partial<CompanyQuery>) => void;
  setQuery: (updater: (prev: CompanyQuery) => CompanyQuery) => void;
  refetch: () => Promise<void>;
}

export function useCompanies(options?: UseCompaniesOptions): UseCompaniesResult {
  const [query, setQueryState] = useState<CompanyQuery>(() => ({
    ...DEFAULT_QUERY,
    ...(options?.initialQuery ?? {})
  }));
  const [data, setData] = useState<PaginatedResponse<Company> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const effectiveQuery = useMemo(
    () => ({
      ...DEFAULT_QUERY,
      ...query
    }),
    [query]
  );

  const execute = useCallback(async (params: CompanyQuery) => {
    const result = await companiesApi.listCompanies(params);
    setData(result);
    setError(null);
  }, []);

  const loadCompanies = useCallback(
    async (params: CompanyQuery) => {
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

    companiesApi
      .listCompanies(effectiveQuery)
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

  const updateQuery = useCallback((patch: Partial<CompanyQuery>) => {
    setQueryState((prev) => ({
      ...prev,
      ...patch
    }));
  }, []);

  const setQuery = useCallback((updater: (prev: CompanyQuery) => CompanyQuery) => {
    setQueryState((prev) => ({
      ...prev,
      ...updater(prev)
    }));
  }, []);

  const refetch = useCallback(async () => {
    await loadCompanies(effectiveQuery);
  }, [loadCompanies, effectiveQuery]);

  return {
    companies: data?.items ?? [],
    data,
    loading,
    error,
    query: effectiveQuery,
    updateQuery,
    setQuery,
    refetch
  };
}

export default useCompanies;
