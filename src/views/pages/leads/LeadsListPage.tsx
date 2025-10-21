import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
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

import MainCard from 'ui-component/cards/MainCard';
import useLeads from 'hooks/useLeads';
import type { Lead, LeadQuery } from 'types/api';

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

export default function LeadsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = useMemo<LeadQuery>(() => {
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
      size: getNumber('size', INITIAL_PAGE_SIZE),
      search: searchParams.get('search') ?? '',
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

  const stageFilter = useMemo(() => {
    const value = searchParams.get('stage');
    return value && value.trim().length > 0 ? value : undefined;
  }, [searchParams]);

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

  const hasFilters = useMemo(() => {
    const searchFilter = (query.search ?? '').trim();
    return Boolean(searchFilter || query.dateFrom || query.dateTo || query.ownerId || stageFilter);
  }, [query.dateFrom, query.dateTo, query.ownerId, query.search, stageFilter]);

  const handleClearFilters = useCallback(() => {
    const nextSize = query.size ?? INITIAL_PAGE_SIZE;
    updateQuery({
      page: 1,
      size: nextSize,
      search: '',
      dateFrom: undefined,
      dateTo: undefined,
      ownerId: undefined
    });
    setSearchValue('');
    syncSearchParams({
      page: '1',
      size: String(nextSize),
      search: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      ownerId: undefined,
      stage: undefined
    });
  }, [query.size, syncSearchParams, updateQuery]);

  const rows: Lead[] = useMemo(() => leads, [leads]);
  const total = data?.total ?? rows.length;
  const page = Math.max(0, (query.page ?? 1) - 1);
  const pageSize = query.size ?? INITIAL_PAGE_SIZE;

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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
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
            {newLeadLink}
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
