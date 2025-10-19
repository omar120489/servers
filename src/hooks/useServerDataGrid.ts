import { GridFilterModel, GridSortModel, GridPaginationModel } from '@mui/x-data-grid';
import { useCallback, useState } from 'react';

/**
 * Hook to drive server-side pagination, sorting, and filtering for MUI DataGrid.
 *
 * Converts DataGrid models into query parameters the backend can consume and
 * exposes gridProps configured for server modes. Useful for list pages that
 * page/sort/filter on the server.
 *
 * @param initial - Initial pagination state (DataGrid uses 0-based pages).
 * @returns State, setters, DataGrid server-mode props, and a toQuery() builder.
 */
export default function useServerDataGrid(initial = { page: 0, pageSize: 25 }) {
  const [page, setPage] = useState(initial.page);
  const [pageSize, setPageSize] = useState(initial.pageSize);
  const [sort, setSort] = useState<GridSortModel>([]);
  const [filter, setFilter] = useState<GridFilterModel>({ items: [] });

  const toQuery = useCallback(() => {
    // Backend expects 1-based page index; DataGrid state is 0-based.
    const params: Record<string, unknown> = { page: page + 1, size: pageSize };

    if (sort[0]) {
      params['sort'] = `${sort[0].field}:${sort[0].sort}`;
    }

    if (filter.items?.length) {
      // Aggregate simple "contains" filters into a coarse search string: field:value pairs.
      params['search'] = filter.items.map(i => `${i.field}:${i.value ?? ''}`).join(',');
    }

    return params;
  }, [page, pageSize, sort, filter]);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    setSort,
    filter,
    setFilter,
    gridProps: {
      paginationMode: 'server' as const,
      sortingMode: 'server' as const,
      filterMode: 'server' as const,
      onPaginationModelChange: (m: GridPaginationModel) => {
        setPage(m.page);
        setPageSize(m.pageSize);
      },
      onSortModelChange: setSort,
      onFilterModelChange: setFilter,
    },
    toQuery,
  };
}

