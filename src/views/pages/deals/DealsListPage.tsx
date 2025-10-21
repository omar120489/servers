import { useCallback, useMemo, type ReactNode } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams
} from '@mui/x-data-grid';

import MainCard from 'ui-component/cards/MainCard';
import { useDeals } from 'hooks/useDeals';
import type { Deal, DealQuery } from 'types/api';

const DEFAULT_PAGE_SIZE = 10;

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function formatProbability(value?: number | null) {
  if (value === null || value === undefined) {
    return '—';
  }

  const display = value > 1 ? value : value * 100;
  return `${Math.round(display)}%`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}

function getStatusColor(
  status?: string | null
): 'default' | 'success' | 'warning' | 'error' | 'info' {
  if (!status) {
    return 'default';
  }

  const normalized = status.toLowerCase();
  if (normalized.includes('won')) return 'success';
  if (normalized.includes('lost')) return 'error';
  if (normalized.includes('hold') || normalized.includes('pending')) return 'warning';
  if (normalized.includes('negotiation') || normalized.includes('proposal')) return 'info';
  return 'default';
}

export default function DealsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = useMemo<DealQuery>(() => {
    const getNumber = (key: string, fallback: number) => {
      const value = Number(searchParams.get(key));
      return Number.isFinite(value) && value > 0 ? value : fallback;
    };

    const getString = (key: string) => {
      const value = searchParams.get(key);
      return value && value.trim().length > 0 ? value : undefined;
    };

    return {
      page: getNumber('page', 1),
      size: getNumber('size', DEFAULT_PAGE_SIZE),
      search: searchParams.get('search') ?? '',
      dateFrom: getString('dateFrom'),
      dateTo: getString('dateTo'),
      stage: getString('stage') as DealQuery['stage'],
      ownerId: getString('ownerId')
    };
  }, [searchParams]);

  const { deals, data, loading, error, query, updateQuery, refetch } = useDeals({
    initialQuery
  });

  const syncSearchParams = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const newDealLink: ReactNode = (
    <Button component={RouterLink} to="/deals/new" variant="contained">
      New Deal
    </Button>
  );

  const viewReportsLink: ReactNode = (
    <Button component={RouterLink} to="/reports" size="small" variant="text">
      View reports
    </Button>
  );

  const paginationModel = useMemo(
    () => ({
      page: Math.max(0, (query.page ?? 1) - 1),
      pageSize: query.size ?? DEFAULT_PAGE_SIZE
    }),
    [query.page, query.size]
  );

  const handlePaginationChange = useCallback(
    (model: GridPaginationModel) => {
      const nextPage = model.page + 1;
      const nextSize = model.pageSize;
      updateQuery({ page: nextPage, size: nextSize });
      syncSearchParams({
        page: String(nextPage),
        size: String(nextSize)
      });
    },
    [syncSearchParams, updateQuery]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      updateQuery({ search: value, page: 1 });
      const trimmed = value.trim();
      syncSearchParams({
        search: trimmed.length > 0 ? value : undefined,
        page: '1',
        size: String(query.size ?? DEFAULT_PAGE_SIZE)
      });
    },
    [query.size, syncSearchParams, updateQuery]
  );

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const hasFilters = useMemo(() => {
    const searchValue = (query.search ?? '').trim();
    return Boolean(searchValue || query.dateFrom || query.dateTo || query.stage || query.ownerId);
  }, [query.dateFrom, query.dateTo, query.ownerId, query.search, query.stage]);

  const handleClearFilters = useCallback(() => {
    const nextSize = query.size ?? DEFAULT_PAGE_SIZE;
    updateQuery({
      page: 1,
      size: nextSize,
      search: '',
      dateFrom: undefined,
      dateTo: undefined,
      stage: undefined,
      ownerId: undefined
    });
    syncSearchParams({
      page: '1',
      size: String(nextSize),
      search: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      stage: undefined,
      ownerId: undefined
    });
  }, [query.size, syncSearchParams, updateQuery]);

  const columns = useMemo<GridColDef<Deal>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Deal',
        flex: 1.2,
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<Deal>) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Owner: {params.row.ownerId ?? '—'}
            </Typography>
          </Box>
        )
      },
      {
        field: 'amount',
        headerName: 'Amount',
        flex: 0.6,
        minWidth: 140,
        type: 'number',
        renderCell: (params: GridRenderCellParams<Deal>) => (
          <Typography variant="body2" noWrap>
            {formatCurrency(params.row.amount)}
          </Typography>
        )
      },
      {
        field: 'stage',
        headerName: 'Stage',
        flex: 0.5,
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<Deal>) => (
          <Chip label={params.row.stage || '—'} size="small" variant="outlined" />
        )
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.5,
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<Deal>) => (
          <Chip
            label={params.row.status || '—'}
            size="small"
            color={getStatusColor(params.row.status)}
          />
        )
      },
      {
        field: 'probability',
        headerName: 'Probability',
        flex: 0.4,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams<Deal>) => (
          <Typography variant="body2" noWrap>
            {formatProbability(params.row.probability)}
          </Typography>
        )
      },
      {
        field: 'closeDate',
        headerName: 'Close Date',
        flex: 0.6,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams<Deal>) => (
          <Typography variant="body2" noWrap>
            {formatDate(params.row.closeDate)}
          </Typography>
        )
      },
      {
        field: 'updatedAt',
        headerName: 'Updated',
        flex: 0.6,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams<Deal>) => (
          <Typography variant="body2" noWrap>
            {formatDate(params.row.updatedAt)}
          </Typography>
        )
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        filterable: false,
        minWidth: 160,
        align: 'right',
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<Deal>) => {
          const viewLink: ReactNode = (
            <Button component={RouterLink} to={`/deals/${params.row.id}`} size="small">
              View
            </Button>
          );

          const editLink: ReactNode = (
            <Button
              component={RouterLink}
              to={`/deals/${params.row.id}/edit`}
              size="small"
              color="secondary"
            >
              Edit
            </Button>
          );

          return (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              {viewLink}
              {editLink}
            </Box>
          );
        }
      }
    ],
    []
  );

  return (
    <MainCard title="Deals" content={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between'
          }}
        >
          <TextField
            fullWidth
            placeholder="Search deals"
            value={query.search ?? ''}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1.5,
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            {newDealLink}
          </Box>
        </Box>

        {hasFilters && (
          <Chip
            label="Active filters"
            onDelete={handleClearFilters}
            color="primary"
            size="small"
            sx={{ alignSelf: 'flex-start' }}
          />
        )}

        {Boolean(error) && (
          <Alert severity="error">
            {error instanceof Error ? error.message : 'Failed to load deals. Please try again.'}
            {error instanceof Error && error.stack && (
              <Typography component="pre" variant="caption" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                {error.stack}
              </Typography>
            )}
          </Alert>
        )}

        <Box sx={{ width: '100%' }}>
          <DataGrid
            disableColumnMenu
            disableRowSelectionOnClick
            rows={deals}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            rowCount={data?.total ?? deals.length}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{
              '& .MuiDataGrid-cell': {
                outline: 'none !important'
              }
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            alignItems: { xs: 'flex-start', sm: 'center' }
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing {deals.length} of {data?.total ?? 0} deals
          </Typography>
          <Box>{viewReportsLink}</Box>
        </Box>
      </Box>
    </MainCard>
  );
}
