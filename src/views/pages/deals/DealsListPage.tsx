import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
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
import { useSnackbar } from 'notistack';

import MainCard from 'ui-component/cards/MainCard';
import ExportMenu from 'ui-component/ExportMenu';
import { FilterPanel, type FilterConfig, type FilterValues } from 'ui-component/FilterPanel';
import { useDeals } from 'hooks/useDeals';
import { useFilterPresets } from 'hooks/useFilterPresets';
import type { Deal, DealQuery } from 'types/api';
import {
  exportToXLSX,
  exportToPDF,
  buildExportFilename,
  formatCurrencyForExport,
  formatDateForExport,
  type ExportColumn
} from 'utils/exporters';

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

// Filter configuration for deals
const DEAL_FILTER_CONFIG: FilterConfig[] = [
  {
    label: 'Close Date',
    type: 'date-range',
    field: 'date'
  },
  {
    label: 'Amount',
    type: 'number-range',
    field: 'amount'
  },
  {
    label: 'Stages',
    type: 'multi-select',
    field: 'stages',
    options: [
      { value: 'Lead', label: 'Lead' },
      { value: 'Qualified', label: 'Qualified' },
      { value: 'Proposal', label: 'Proposal' },
      { value: 'Negotiation', label: 'Negotiation' },
      { value: 'Closed Won', label: 'Closed Won' },
      { value: 'Closed Lost', label: 'Closed Lost' }
    ]
  },
  {
    label: 'Statuses',
    type: 'multi-select',
    field: 'statuses',
    options: [
      { value: 'Open', label: 'Open' },
      { value: 'Won', label: 'Won' },
      { value: 'Lost', label: 'Lost' },
      { value: 'Pending', label: 'Pending' }
    ]
  }
];

export default function DealsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { presets, savePreset } = useFilterPresets('deals-filter-presets');

  // Local filter values state
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  const initialQuery = useMemo<DealQuery>(() => {
    const getNumber = (key: string, fallback: number) => {
      const value = Number(searchParams.get(key));
      return Number.isFinite(value) && value > 0 ? value : fallback;
    };

    const getString = (key: string) => {
      const value = searchParams.get(key);
      return value && value.trim().length > 0 ? value : undefined;
    };

    const getArray = (key: string) => {
      const value = searchParams.get(key);
      return value ? value.split(',') : [];
    };

    // Initialize filter values from URL
    const initialFilters: FilterValues = {
      date_from: getString('date_from'),
      date_to: getString('date_to'),
      amount_min: searchParams.get('amount_min') ? Number(searchParams.get('amount_min')) : undefined,
      amount_max: searchParams.get('amount_max') ? Number(searchParams.get('amount_max')) : undefined,
      stages: getArray('stages'),
      statuses: getArray('statuses')
    };

    setFilterValues(initialFilters);

    return {
      page: getNumber('page', 1),
      size: getNumber('size', DEFAULT_PAGE_SIZE),
      search: searchParams.get('search') ?? '',
      date_from: getString('date_from'),
      date_to: getString('date_to'),
      amount_min: searchParams.get('amount_min') ? Number(searchParams.get('amount_min')) : undefined,
      amount_max: searchParams.get('amount_max') ? Number(searchParams.get('amount_max')) : undefined,
      stages: getString('stages'),
      statuses: getString('statuses'),
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
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
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

  const { enqueueSnackbar } = useSnackbar();

  const exportColumns: ExportColumn[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Deal Name' },
      { field: 'amount', headerName: 'Amount', valueFormatter: formatCurrencyForExport },
      { field: 'stage', headerName: 'Stage' },
      { field: 'status', headerName: 'Status' },
      { field: 'closeDate', headerName: 'Close Date', valueFormatter: formatDateForExport },
      { field: 'ownerId', headerName: 'Owner' },
      { field: 'grossRevenue', headerName: 'Gross Revenue', valueFormatter: formatCurrencyForExport },
      { field: 'directCost', headerName: 'Direct Cost', valueFormatter: formatCurrencyForExport },
      { field: 'netProfit', headerName: 'Net Profit', valueFormatter: formatCurrencyForExport },
      { field: 'updatedAt', headerName: 'Updated', valueFormatter: formatDateForExport }
    ],
    []
  );

  const handleExportXLSX = useCallback(() => {
    try {
      const filename = buildExportFilename('deals', 'xlsx', query.search ? { search: query.search } : undefined);
      exportToXLSX(deals, exportColumns, filename);
      enqueueSnackbar(`Exported ${deals.length} deals to ${filename}`, { variant: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      enqueueSnackbar('Export failed. Please try again.', { variant: 'error' });
    }
  }, [deals, exportColumns, query.search, enqueueSnackbar]);

  const handleExportPDF = useCallback(() => {
    try {
      const filename = buildExportFilename('deals', 'pdf', query.search ? { search: query.search } : undefined);
      exportToPDF(deals, exportColumns, filename, 'Deals Report');
      enqueueSnackbar(`Exported ${deals.length} deals to ${filename}`, { variant: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      enqueueSnackbar('Export failed. Please try again.', { variant: 'error' });
    }
  }, [deals, exportColumns, query.search, enqueueSnackbar]);

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

  // Filter handlers
  const handleFilterChange = useCallback((values: FilterValues) => {
    setFilterValues(values);
  }, []);

  const handleApplyFilters = useCallback(() => {
    const patch: Record<string, string | undefined> = {
      page: '1', // Reset to page 1 on filter change
      date_from: filterValues.date_from as string | undefined,
      date_to: filterValues.date_to as string | undefined,
      amount_min: filterValues.amount_min === undefined ? undefined : String(filterValues.amount_min),
      amount_max: filterValues.amount_max === undefined ? undefined : String(filterValues.amount_max),
      stages: Array.isArray(filterValues.stages) && filterValues.stages.length > 0
        ? filterValues.stages.join(',')
        : undefined,
      statuses: Array.isArray(filterValues.statuses) && filterValues.statuses.length > 0
        ? filterValues.statuses.join(',')
        : undefined
    };

    syncSearchParams(patch);

    updateQuery({
      ...query,
      page: 1,
      date_from: filterValues.date_from as string | undefined,
      date_to: filterValues.date_to as string | undefined,
      amount_min: filterValues.amount_min as number | undefined,
      amount_max: filterValues.amount_max as number | undefined,
      stages: Array.isArray(filterValues.stages) && filterValues.stages.length > 0
        ? filterValues.stages.join(',')
        : undefined,
      statuses: Array.isArray(filterValues.statuses) && filterValues.statuses.length > 0
        ? filterValues.statuses.join(',')
        : undefined
    });
  }, [filterValues, query, syncSearchParams, updateQuery]);

  const handleLoadPreset = useCallback((presetFilters: FilterValues) => {
    setFilterValues(presetFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    const nextSize = query.size ?? DEFAULT_PAGE_SIZE;
    setFilterValues({});
    updateQuery({
      page: 1,
      size: nextSize,
      search: '',
      dateFrom: undefined,
      dateTo: undefined,
      stage: undefined,
      ownerId: undefined,
      date_from: undefined,
      date_to: undefined,
      amount_min: undefined,
      amount_max: undefined,
      stages: undefined,
      statuses: undefined
    });
    syncSearchParams({
      page: '1',
      size: String(nextSize),
      search: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      stage: undefined,
      ownerId: undefined,
      date_from: undefined,
      date_to: undefined,
      amount_min: undefined,
      amount_max: undefined,
      stages: undefined,
      statuses: undefined
    });
  }, [query.size, syncSearchParams, updateQuery]);

  // Generate active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onDelete: () => void }> = [];

    if (query.date_from) {
      chips.push({
        key: 'date_from',
        label: `From: ${query.date_from}`,
        onDelete: () => {
          const updated = { ...filterValues, date_from: undefined };
          setFilterValues(updated);
          syncSearchParams({ date_from: undefined });
          updateQuery({ ...query, date_from: undefined });
        }
      });
    }
    if (query.date_to) {
      chips.push({
        key: 'date_to',
        label: `To: ${query.date_to}`,
        onDelete: () => {
          const updated = { ...filterValues, date_to: undefined };
          setFilterValues(updated);
          syncSearchParams({ date_to: undefined });
          updateQuery({ ...query, date_to: undefined });
        }
      });
    }
    if (query.amount_min) {
      chips.push({
        key: 'amount_min',
        label: `Min: ${formatCurrency(query.amount_min)}`,
        onDelete: () => {
          const updated = { ...filterValues, amount_min: undefined };
          setFilterValues(updated);
          syncSearchParams({ amount_min: undefined });
          updateQuery({ ...query, amount_min: undefined });
        }
      });
    }
    if (query.amount_max) {
      chips.push({
        key: 'amount_max',
        label: `Max: ${formatCurrency(query.amount_max)}`,
        onDelete: () => {
          const updated = { ...filterValues, amount_max: undefined };
          setFilterValues(updated);
          syncSearchParams({ amount_max: undefined });
          updateQuery({ ...query, amount_max: undefined });
        }
      });
    }
    if (query.stages) {
      chips.push({
        key: 'stages',
        label: `Stages: ${query.stages}`,
        onDelete: () => {
          const updated = { ...filterValues, stages: [] };
          setFilterValues(updated);
          syncSearchParams({ stages: undefined });
          updateQuery({ ...query, stages: undefined });
        }
      });
    }
    if (query.statuses) {
      chips.push({
        key: 'statuses',
        label: `Statuses: ${query.statuses}`,
        onDelete: () => {
          const updated = { ...filterValues, statuses: [] };
          setFilterValues(updated);
          syncSearchParams({ statuses: undefined });
          updateQuery({ ...query, statuses: undefined });
        }
      });
    }

    return chips;
  }, [query, filterValues, syncSearchParams, updateQuery]);

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
            <ExportMenu
              onExportXLSX={handleExportXLSX}
              onExportPDF={handleExportPDF}
              disabled={loading || deals.length === 0}
            />
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

        {/* Advanced Filters Panel */}
        <FilterPanel
          filters={DEAL_FILTER_CONFIG}
          values={filterValues}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          showPresets={true}
          presets={presets}
          onSavePreset={savePreset}
          onLoadPreset={handleLoadPreset}
        />

        {/* Active Filter Chips */}
        {activeFilterChips.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            {activeFilterChips.map((chip) => (
              <Chip
                key={chip.key}
                label={chip.label}
                onDelete={chip.onDelete}
                color="primary"
                size="small"
              />
            ))}
          </Stack>
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
