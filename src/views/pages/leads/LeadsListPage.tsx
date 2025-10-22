import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1';
import { useSnackbar } from 'notistack';

import MainCard from 'ui-component/cards/MainCard';
import ExportMenu from 'ui-component/ExportMenu';
import { FilterPanel, type FilterConfig, type FilterValues } from 'ui-component/FilterPanel';
import useLeads from 'hooks/useLeads';
import { useFilterPresets } from 'hooks/useFilterPresets';
import type { Lead, LeadQuery } from 'types/api';
import {
  exportToXLSX,
  exportToPDF,
  buildExportFilename,
  formatDateForExport,
  type ExportColumn
} from 'utils/exporters';

const STATUS_COLOR: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  new: 'default',
  contacted: 'info',
  qualified: 'success',
  working: 'info',
  converted: 'success',
  unqualified: 'error'
};

function getStatusColor(status?: string | null) {
  if (!status) return 'default';
  return STATUS_COLOR[status.toLowerCase()] ?? 'default';
}

function formatScore(score?: number | null) {
  if (score === undefined || score === null || Number.isNaN(score)) {
    return '—';
  }
  return `${Math.round(score)}%`;
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}

const INITIAL_PAGE_SIZE = 10;

// Filter configuration for leads
const LEAD_FILTER_CONFIG: FilterConfig[] = [
  {
    label: 'Created Date',
    type: 'date-range',
    field: 'date'
  },
  {
    label: 'Score',
    type: 'number-range',
    field: 'score'
  },
  {
    label: 'Statuses',
    type: 'multi-select',
    field: 'statuses',
    options: [
      { value: 'New', label: 'New' },
      { value: 'Contacted', label: 'Contacted' },
      { value: 'Qualified', label: 'Qualified' },
      { value: 'Working', label: 'Working' },
      { value: 'Converted', label: 'Converted' },
      { value: 'Unqualified', label: 'Unqualified' }
    ]
  },
  {
    label: 'Sources',
    type: 'multi-select',
    field: 'sources',
    options: [
      { value: 'Web', label: 'Web' },
      { value: 'Referral', label: 'Referral' },
      { value: 'Email', label: 'Email' },
      { value: 'Phone', label: 'Phone' },
      { value: 'Event', label: 'Event' },
      { value: 'Social', label: 'Social' }
    ]
  }
];

export default function LeadsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { presets, savePreset } = useFilterPresets('leads-filter-presets');

  // Local filter values state
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  const initialQuery = useMemo<LeadQuery>(() => {
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
      score_min: searchParams.get('score_min') ? Number(searchParams.get('score_min')) : undefined,
      score_max: searchParams.get('score_max') ? Number(searchParams.get('score_max')) : undefined,
      statuses: getArray('statuses'),
      sources: getArray('sources')
    };

    setFilterValues(initialFilters);

    return {
      page: getNumber('page', 1),
      size: getNumber('size', INITIAL_PAGE_SIZE),
      search: searchParams.get('search') ?? '',
      date_from: getString('date_from'),
      date_to: getString('date_to'),
      score_min: searchParams.get('score_min') ? Number(searchParams.get('score_min')) : undefined,
      score_max: searchParams.get('score_max') ? Number(searchParams.get('score_max')) : undefined,
      statuses: getString('statuses'),
      sources: getString('sources'),
      dateFrom: getString('dateFrom'),
      dateTo: getString('dateTo'),
      ownerId: getString('ownerId')
    };
  }, [searchParams]);

  const { leads, data, loading, error, query, updateQuery, refetch } = useLeads({
    initialQuery
  });
  const [searchValue, setSearchValue] = useState(query.search ?? '');

  useEffect(() => {
    const next = query.search ?? '';
    setSearchValue((prev) => (prev === next ? prev : next));
  }, [query.search]);

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

  const handleChangePage = useCallback(
    (_event: unknown, nextPage: number) => {
      const pageNumber = nextPage + 1;
      updateQuery({ page: pageNumber });
      syncSearchParams({
        page: String(pageNumber),
        size: String(query.size ?? INITIAL_PAGE_SIZE)
      });
    },
    [query.size, syncSearchParams, updateQuery]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextSize = Number(event.target.value) || INITIAL_PAGE_SIZE;
      updateQuery({ page: 1, size: nextSize });
      syncSearchParams({
        page: '1',
        size: String(nextSize)
      });
    },
    [syncSearchParams, updateQuery]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchValue(value);
      updateQuery({ page: 1, search: value });
      const trimmed = value.trim();
      syncSearchParams({
        search: trimmed.length > 0 ? value : undefined,
        page: '1',
        size: String(query.size ?? INITIAL_PAGE_SIZE)
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
      score_min: filterValues.score_min === undefined ? undefined : String(filterValues.score_min),
      score_max: filterValues.score_max === undefined ? undefined : String(filterValues.score_max),
      statuses: Array.isArray(filterValues.statuses) && filterValues.statuses.length > 0
        ? filterValues.statuses.join(',')
        : undefined,
      sources: Array.isArray(filterValues.sources) && filterValues.sources.length > 0
        ? filterValues.sources.join(',')
        : undefined
    };

    syncSearchParams(patch);

    updateQuery({
      ...query,
      page: 1,
      date_from: filterValues.date_from as string | undefined,
      date_to: filterValues.date_to as string | undefined,
      score_min: filterValues.score_min as number | undefined,
      score_max: filterValues.score_max as number | undefined,
      statuses: Array.isArray(filterValues.statuses) && filterValues.statuses.length > 0
        ? filterValues.statuses.join(',')
        : undefined,
      sources: Array.isArray(filterValues.sources) && filterValues.sources.length > 0
        ? filterValues.sources.join(',')
        : undefined
    });
  }, [filterValues, query, syncSearchParams, updateQuery]);

  const handleLoadPreset = useCallback((presetFilters: FilterValues) => {
    setFilterValues(presetFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    const nextSize = query.size ?? INITIAL_PAGE_SIZE;
    setFilterValues({});
    updateQuery({
      page: 1,
      size: nextSize,
      search: '',
      dateFrom: undefined,
      dateTo: undefined,
      ownerId: undefined,
      date_from: undefined,
      date_to: undefined,
      score_min: undefined,
      score_max: undefined,
      statuses: undefined,
      sources: undefined
    });
    setSearchValue('');
    syncSearchParams({
      page: '1',
      size: String(nextSize),
      search: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      ownerId: undefined,
      stage: undefined,
      date_from: undefined,
      date_to: undefined,
      score_min: undefined,
      score_max: undefined,
      statuses: undefined,
      sources: undefined
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
    if (query.score_min) {
      chips.push({
        key: 'score_min',
        label: `Min Score: ${query.score_min}`,
        onDelete: () => {
          const updated = { ...filterValues, score_min: undefined };
          setFilterValues(updated);
          syncSearchParams({ score_min: undefined });
          updateQuery({ ...query, score_min: undefined });
        }
      });
    }
    if (query.score_max) {
      chips.push({
        key: 'score_max',
        label: `Max Score: ${query.score_max}`,
        onDelete: () => {
          const updated = { ...filterValues, score_max: undefined };
          setFilterValues(updated);
          syncSearchParams({ score_max: undefined });
          updateQuery({ ...query, score_max: undefined });
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
    if (query.sources) {
      chips.push({
        key: 'sources',
        label: `Sources: ${query.sources}`,
        onDelete: () => {
          const updated = { ...filterValues, sources: [] };
          setFilterValues(updated);
          syncSearchParams({ sources: undefined });
          updateQuery({ ...query, sources: undefined });
        }
      });
    }

    return chips;
  }, [query, filterValues, syncSearchParams, updateQuery]);

  const rows: Lead[] = useMemo(() => leads, [leads]);
  const total = data?.total ?? rows.length;
  const page = Math.max(0, (query.page ?? 1) - 1);
  const pageSize = query.size ?? INITIAL_PAGE_SIZE;

  const { enqueueSnackbar } = useSnackbar();

  const exportColumns: ExportColumn[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID' },
      { field: 'firstName', headerName: 'First Name' },
      { field: 'lastName', headerName: 'Last Name' },
      { field: 'email', headerName: 'Email' },
      { field: 'phone', headerName: 'Phone' },
      { field: 'company', headerName: 'Company' },
      { field: 'status', headerName: 'Status' },
      { field: 'source', headerName: 'Source' },
      { 
        field: 'score', 
        headerName: 'Score',
        valueFormatter: (value) => (value === null || value === undefined ? '—' : `${value}%`)
      },
      { field: 'createdAt', headerName: 'Created', valueFormatter: formatDateForExport }
    ],
    []
  );

  const handleExportXLSX = useCallback(() => {
    try {
      const filename = buildExportFilename('leads', 'xlsx', query.search ? { search: query.search } : undefined);
      exportToXLSX(leads, exportColumns, filename);
      enqueueSnackbar(`Exported ${leads.length} leads to ${filename}`, { variant: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      enqueueSnackbar('Export failed. Please try again.', { variant: 'error' });
    }
  }, [leads, exportColumns, query.search, enqueueSnackbar]);

  const handleExportPDF = useCallback(() => {
    try {
      const filename = buildExportFilename('leads', 'pdf', query.search ? { search: query.search } : undefined);
      exportToPDF(leads, exportColumns, filename, 'Leads Report');
      enqueueSnackbar(`Exported ${leads.length} leads to ${filename}`, { variant: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      enqueueSnackbar('Export failed. Please try again.', { variant: 'error' });
    }
  }, [leads, exportColumns, query.search, enqueueSnackbar]);

  const newLeadLink: ReactNode = (
    <Button
      component={RouterLink}
      to="/leads/new"
      variant="contained"
      startIcon={<PersonAddIcon />}
    >
      New Lead
    </Button>
  );

  return (
    <MainCard title="Leads" content={false}>
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
            placeholder="Search leads"
            value={searchValue}
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
              disabled={loading || leads.length === 0}
            />
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            {newLeadLink}
          </Box>
        </Box>

        {/* Advanced Filters Panel */}
        <FilterPanel
          filters={LEAD_FILTER_CONFIG}
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
            {error instanceof Error ? error.message : 'Failed to load leads. Please try again.'}
          </Alert>
        )}

        <Paper variant="outlined">
          {loading && <LinearProgress />}
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No leads found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((lead) => (
                    <TableRow key={lead.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {lead.firstName} {lead.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Owner: {lead.ownerId ?? '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone ?? '—'}</TableCell>
                      <TableCell>{lead.company ?? '—'}</TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status ?? '—'}
                          size="small"
                          color={getStatusColor(lead.status)}
                        />
                      </TableCell>
                      <TableCell>{lead.source ?? '—'}</TableCell>
                      <TableCell align="right">{formatScore(lead.score)}</TableCell>
                      <TableCell>{formatDate(lead.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button component={RouterLink} to={`/leads/${lead.id}`} size="small">
                            View
                          </Button>
                          <Button
                            component={RouterLink}
                            to={`/leads/${lead.id}/edit`}
                            size="small"
                            color="secondary"
                          >
                            Edit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      </Box>
    </MainCard>
  );
}
