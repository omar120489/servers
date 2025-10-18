import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getLeads } from '../store/leadsSlice';
import { Box, Typography, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function Leads() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(s => s.leads);

  useEffect(() => { dispatch(getLeads({ page: 1, size: 25 })); }, [dispatch]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Leads</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((l) => (
            <TableRow key={String(l.id)}>
              <TableCell>{[l.first_name, l.last_name].filter(Boolean).join(' ') || '-'}</TableCell>
              <TableCell>{l.email || '-'}</TableCell>
              <TableCell>{l.company || '-'}</TableCell>
              <TableCell>{l.status || '-'}</TableCell>
              <TableCell>{l.score ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
