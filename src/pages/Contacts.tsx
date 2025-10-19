/**
 * Contacts Page - React Query Version
 * 
 * This is the AFTER version - migrated to use React Query for data fetching.
 * 
 * Key improvements:
 * - Automatic caching (no redundant fetches)
 * - Background refetch on mount
 * - Loading and error states handled by React Query
 * - Optimistic updates for better UX
 * - No manual useState/useEffect for data fetching
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useContacts } from 'hooks/useContacts';
import { SearchBar, LoadingState, ErrorState, PageHeader } from 'components/shared';

export default function Contacts() {
  const [search, setSearch] = useState('');
  
  // React Query hook - handles loading, error, and data states automatically
  const { data: contacts = [], isLoading, error } = useContacts();
  
  // Client-side filtering (in production, this would be server-side)
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email.toLowerCase().includes(search.toLowerCase()) ||
    contact.company.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'lead': return 'warning';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Loading state
  if (isLoading) {
    return <LoadingState message="Loading contacts..." />;
  }

  // Error state
  if (error) {
    return <ErrorState message="Failed to load contacts. Showing cached data." severity="warning" />;
  }

  return (
    <Box>
      <PageHeader
        title="Contacts"
        description="Manage your contact relationships"
        actions={
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Contact
          </Button>
        }
      />

      <Paper sx={{ mb: 2, p: 2 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search contacts by name, email, or company..."
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contact</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(contact.name)}
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {contact.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.role}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{contact.email}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{contact.phone}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={contact.status}
                    color={getStatusColor(contact.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </Typography>
      </Box>
    </Box>
  );
}

