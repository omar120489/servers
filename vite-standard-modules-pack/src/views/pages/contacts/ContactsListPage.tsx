import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import AppPage from '@/src/core/app-page/AppPage';
import { Box, Button, Grid, InputAdornment, Menu, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useUrlQuery } from '@/src/core/filters/useUrlQuery';
import { useContactsList } from '@/src/data/hooks/useContactsList';
import { contactColumns, exportColumns } from '@/src/features/contacts/model';
import { exportToCSV, exportToXLSX, exportToPDF, buildExportFilename } from '@/src/core/export';
import { can } from '@/src/core/rbac/permissions';
import { Link as RouterLink } from 'react-router-dom';

export default function ContactsListPage(){
  const { query, update } = useUrlQuery({ page: 1, pageSize: 25, order: 'desc' as const });
  const { rows, total, loading, error, refresh } = useContactsList({
    page: Number(query.page) || 1, pageSize: Number(query.pageSize) || 25, search: String(query.search ?? ''),
    dateFrom: String((query as any).dateFrom ?? ''), dateTo: String((query as any).dateTo ?? ''), ownerId: String((query as any).ownerId ?? ''),
    order: (String(query.order ?? 'desc') as 'asc'|'desc')
  });
  const granted = ['contacts:read','contacts:create','contacts:export'] as const;

  const paginationModel = useMemo<GridPaginationModel>(()=>({
    page: (Number(query.page)||1)-1, pageSize: Number(query.pageSize)||25
  }), [query.page, query.pageSize]);

  const onPaginationChange = (m: GridPaginationModel) => update({ page: m.page + 1, pageSize: m.pageSize });

  const [exportAnchor, setExportAnchor] = useState<null|HTMLElement>(null);
  const openExport = (e: React.MouseEvent<HTMLElement>) => setExportAnchor(e.currentTarget);
  const closeExport = () => setExportAnchor(null);

  const handleExport = useCallback(async (fmt: 'csv'|'xlsx'|'pdf')=>{
    const filename = buildExportFilename('contacts', fmt);
    if (fmt==='csv') return exportToCSV(rows, exportColumns, filename);
    if (fmt==='xlsx') return exportToXLSX(rows, exportColumns, filename);
    if (fmt==='pdf') return exportToPDF(rows, exportColumns, filename, 'Contacts');
  }, [rows]);

  const [dateFrom, setDateFrom] = useState(String((query as any).dateFrom ?? ''));
  const [dateTo, setDateTo] = useState(String((query as any).dateTo ?? ''));
  const [ownerId, setOwnerId] = useState(String((query as any).ownerId ?? ''));
  const hasFilters = Boolean(dateFrom || dateTo || ownerId || query.search);

  const actions = (
    <Stack direction="row" spacing={1}>
      {can(granted, 'contacts:export') && (<>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={openExport} disabled={loading || rows.length===0} size="small">Export</Button>
        <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={closeExport}>
          <MenuItem onClick={()=>{ closeExport(); handleExport('csv'); }}>CSV</MenuItem>
          <MenuItem onClick={()=>{ closeExport(); handleExport('xlsx'); }}>Excel</MenuItem>
          <MenuItem onClick={()=>{ closeExport(); handleExport('pdf'); }}>PDF</MenuItem>
        </Menu>
      </>)}
      <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refresh} disabled={loading} size="small">Refresh</Button>
      {can(granted, 'contacts:create') && (
        <Button variant="contained" startIcon={<PersonAddAltIcon />} component={RouterLink} to="/contacts/new" size="small">New Contact</Button>
      )}
    </Stack>
  );

  const toolbar = (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField fullWidth size="small" placeholder="Search contacts…" value={String(query.search ?? '')}
            onChange={(e)=> update({ search: e.target.value, page: 1 })}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TextField fullWidth size="small" type="date" label="From" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TextField fullWidth size="small" type="date" label="To" value={dateTo} onChange={e=>setDateTo(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth size="small" label="Owner" value={ownerId} onChange={(e)=>setOwnerId(e.target.value)} placeholder="Filter by owner…" />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="contained" size="small" onClick={()=> update({ dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, ownerId: ownerId || undefined, page: 1 } as any)}>
              Apply Filters
            </Button>
            <Button variant="outlined" size="small" onClick={()=>{ setDateFrom(''); setDateTo(''); setOwnerId(''); update({ dateFrom: undefined, dateTo: undefined, ownerId: undefined, search: query.search ?? undefined, page: 1 } as any); }} disabled={!hasFilters}>
              Clear All
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <AppPage title="Contacts" subtitle="Manage your contact database" actions={actions} toolbar={toolbar}
      loading={loading} error={error ? 'Failed to load contacts.' : false} empty={!loading && !error && rows.length===0} onRetry={refresh}>
      <Box sx={{ width: '100%' }}>
        <DataGrid autoHeight disableColumnMenu disableRowSelectionOnClick rows={rows} columns={contactColumns}
          getRowId={(r)=> (r as any).id} loading={loading} paginationMode="server" paginationModel={paginationModel}
          onPaginationModelChange={onPaginationChange} rowCount={total} pageSizeOptions={[5,10,25,50]}
          sx={{ '& .MuiDataGrid-cell': { outline: 'none !important' } }}
        />
      </Box>
    </AppPage>
  );
}
