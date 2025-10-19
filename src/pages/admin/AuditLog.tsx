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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceType: 'contact' | 'company' | 'deal' | 'user' | 'settings';
  details: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

const mockAuditLog: AuditEntry[] = [
  {
    id: 1,
    timestamp: '2024-10-18 14:32:15',
    user: 'admin@example.com',
    action: 'Created',
    resource: 'Enterprise Software License',
    resourceType: 'deal',
    details: 'Created new deal worth $50,000',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 2,
    timestamp: '2024-10-18 14:15:42',
    user: 'john@example.com',
    action: 'Updated',
    resource: 'Acme Corp',
    resourceType: 'company',
    details: 'Updated company revenue to $50M-$100M',
    ipAddress: '192.168.1.101',
    status: 'success',
  },
  {
    id: 3,
    timestamp: '2024-10-18 13:58:23',
    user: 'sarah@example.com',
    action: 'Deleted',
    resource: 'Old Contact',
    resourceType: 'contact',
    details: 'Deleted inactive contact',
    ipAddress: '192.168.1.102',
    status: 'success',
  },
  {
    id: 4,
    timestamp: '2024-10-18 13:45:10',
    user: 'admin@example.com',
    action: 'Created',
    resource: 'Sales Rep',
    resourceType: 'user',
    details: 'Created new user account',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 5,
    timestamp: '2024-10-18 13:30:05',
    user: 'mike@example.com',
    action: 'Updated',
    resource: 'Cloud Migration Project',
    resourceType: 'deal',
    details: 'Moved deal to Qualification stage',
    ipAddress: '192.168.1.103',
    status: 'success',
  },
  {
    id: 6,
    timestamp: '2024-10-18 12:15:33',
    user: 'admin@example.com',
    action: 'Updated',
    resource: 'System Settings',
    resourceType: 'settings',
    details: 'Changed webhook configuration',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 7,
    timestamp: '2024-10-18 11:42:18',
    user: 'emily@example.com',
    action: 'Created',
    resource: 'TechStart Inc',
    resourceType: 'company',
    details: 'Added new company to CRM',
    ipAddress: '192.168.1.104',
    status: 'success',
  },
  {
    id: 8,
    timestamp: '2024-10-18 11:20:55',
    user: 'john@example.com',
    action: 'Deleted',
    resource: 'Duplicate Deal',
    resourceType: 'deal',
    details: 'Attempted to delete protected deal',
    ipAddress: '192.168.1.101',
    status: 'failed',
  },
  {
    id: 9,
    timestamp: '2024-10-18 10:55:42',
    user: 'sarah@example.com',
    action: 'Updated',
    resource: 'John Smith',
    resourceType: 'contact',
    details: 'Updated contact phone number',
    ipAddress: '192.168.1.102',
    status: 'success',
  },
  {
    id: 10,
    timestamp: '2024-10-18 10:30:12',
    user: 'admin@example.com',
    action: 'Created',
    resource: 'Manager Role',
    resourceType: 'user',
    details: 'Created new role with custom permissions',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
];

export default function AuditLog() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterResource, setFilterResource] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLog = mockAuditLog.filter(entry => {
    const matchesSearch = 
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.resource.toLowerCase().includes(search.toLowerCase()) ||
      entry.details.toLowerCase().includes(search.toLowerCase());
    
    const matchesAction = filterAction === 'all' || entry.action.toLowerCase() === filterAction;
    const matchesResource = filterResource === 'all' || entry.resourceType === filterResource;

    return matchesSearch && matchesAction && matchesResource;
  });

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created': return 'success';
      case 'updated': return 'info';
      case 'deleted': return 'error';
      default: return 'default';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'contact': return <PersonIcon fontSize="small" />;
      case 'company': return <BusinessIcon fontSize="small" />;
      case 'deal': return <AttachMoneyIcon fontSize="small" />;
      case 'user': return <PersonIcon fontSize="small" />;
      case 'settings': return <SettingsIcon fontSize="small" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'success' ? 'success' : 'error';
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Audit Log</Typography>
          <Typography variant="body2" color="text.secondary">
            Track all user actions and system changes
          </Typography>
        </Box>
      </Stack>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Search by user, resource, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={filterAction}
              label="Action"
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <MenuItem value="all">All Actions</MenuItem>
              <MenuItem value="created">Created</MenuItem>
              <MenuItem value="updated">Updated</MenuItem>
              <MenuItem value="deleted">Deleted</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Resource</InputLabel>
            <Select
              value={filterResource}
              label="Resource"
              onChange={(e) => setFilterResource(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="contact">Contact</MenuItem>
              <MenuItem value="company">Company</MenuItem>
              <MenuItem value="deal">Deal</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="settings">Settings</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLog
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {entry.timestamp}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                        {entry.user.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">{entry.user}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.action}
                      color={getActionColor(entry.action)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {getResourceIcon(entry.resourceType)}
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {entry.resource}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {entry.resourceType}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {entry.details}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {entry.ipAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.status}
                      color={getStatusColor(entry.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {Math.min((page - 1) * itemsPerPage + 1, filteredLog.length)}-
          {Math.min(page * itemsPerPage, filteredLog.length)} of {filteredLog.length} entries
        </Typography>
        <Pagination
          count={Math.ceil(filteredLog.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Stack>
    </Box>
  );
}

