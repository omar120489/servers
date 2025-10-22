import type { GridColDef } from '@mui/x-data-grid';
import type { Contact } from '@/src/data/hooks/useContactsList';
import type { ExportColumn } from '@/src/core/export';
export const contactColumns: GridColDef[] = [
  { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 140 },
  { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 140 },
  { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 200 },
  { field: 'phone', headerName: 'Phone', minWidth: 140 },
  { field: 'title', headerName: 'Title', flex: 1, minWidth: 140 },
  { field: 'companyId', headerName: 'Company', minWidth: 120 },
  { field: 'updatedAt', headerName: 'Updated', minWidth: 120 }
];
export const exportColumns: ExportColumn<Contact>[] = [
  { header: 'Name', key: 'name', format: (r) => `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() },
  { header: 'Email', key: 'email' },
  { header: 'Phone', key: 'phone' },
  { header: 'Title', key: 'title' },
  { header: 'Company', key: 'companyId' },
  { header: 'Updated', key: 'updatedAt' }
];
