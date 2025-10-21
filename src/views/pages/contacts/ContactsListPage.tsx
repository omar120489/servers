import { useCallback, useMemo, type ReactNode } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt1';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams
} from '@mui/x-data-grid';

import MainCard from 'ui-component/cards/MainCard';
import { useContacts } from 'hooks/useContacts';
import type { Contact, ContactQuery } from 'types/api';

const DEFAULT_PAGE_SIZE = 10;

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

function formatPhone(value?: string | null) {
  if (!value) {
    return '—';
  }

  return value;
}

export default function ContactsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = useMemo<ContactQuery>(() => {
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
      ownerId: getString('ownerId')
    };
  }, [searchParams]);

  const { contacts, data, loading, error, query, updateQuery, refetch } = useContacts({
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

  const stageFilter = useMemo(() => {
    const value = searchParams.get('stage');
    return value && value.trim().length > 0 ? value : undefined;
  }, [searchParams]);

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
    const searchFilter = (query.search ?? '').trim();
    return Boolean(searchFilter || query.dateFrom || query.dateTo || query.ownerId || stageFilter);
  }, [query.dateFrom, query.dateTo, query.ownerId, query.search, stageFilter]);

  const handleClearFilters = useCallback(() => {
    const nextSize = query.size ?? DEFAULT_PAGE_SIZE;
    updateQuery({
      page: 1,
      size: nextSize,
      search: '',
      dateFrom: undefined,
      dateTo: undefined,
      ownerId: undefined
    });
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

  const columns = useMemo<GridColDef<Contact>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Contact',
        flex: 1,
        minWidth: 220,
        renderCell: (params: GridRenderCellParams<Contact>) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {params.row.firstName} {params.row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Owner: {params.row.ownerId ?? '—'}
            </Typography>
          </Box>
        )
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 220
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 0.6,
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<Contact>) => (
          <Typography variant="body2" noWrap>
            {formatPhone(params.row.phone)}
          </Typography>
        )
      },
      {
        field: 'title',
        headerName: 'Title',
        flex: 0.8,
        minWidth: 160,
        renderCell: (params: GridRenderCellParams<Contact>) => (
          <Typography variant="body2" noWrap>
            {params.row.title ?? '—'}
          </Typography>
        )
      },
      {
        field: 'companyId',
        headerName: 'Company',
        flex: 0.8,
        minWidth: 160,
        renderCell: (params: GridRenderCellParams<Contact>) =>
          params.row.companyId ? (
            <Chip label={params.row.companyId} size="small" variant="outlined" />
          ) : (
            <Chip label="—" size="small" variant="outlined" />
          )
      },
      {
        field: 'updatedAt',
        headerName: 'Updated',
        flex: 0.7,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams<Contact>) => (
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
        renderCell: (params: GridRenderCellParams<Contact>) => {
          const viewLink: ReactNode = (
            <Button component={RouterLink} to={`/contacts/${params.row.id}`} size="small">
              View
            </Button>
          );

          const editLink: ReactNode = (
            <Button
              component={RouterLink}
              to={`/contacts/${params.row.id}/edit`}
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

  const newContactLink: ReactNode = (
    <Button
      component={RouterLink}
      to="/contacts/new"
      variant="contained"
      startIcon={<PersonAddAltIcon />}
    >
      New Contact
    </Button>
  );

  return (
    <MainCard title="Contacts" content={false}>
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
            placeholder="Search contacts"
            value={query.search ?? ''}
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
            {newContactLink}
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
            {error instanceof Error ? error.message : 'Failed to load contacts. Please try again.'}
          </Alert>
        )}

        <div style={{ width: '100%' }}>
          <DataGrid
            autoHeight
            disableColumnMenu
            disableRowSelectionOnClick
            rows={contacts}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            rowCount={data?.total ?? contacts.length}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{
              '& .MuiDataGrid-cell': {
                outline: 'none !important'
              }
            }}
          />
        </div>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            alignItems: { xs: 'flex-start', sm: 'center' }
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing {contacts.length} of {data?.total ?? 0} contacts
          </Typography>
        </Box>
      </Box>
    </MainCard>
  );
}
