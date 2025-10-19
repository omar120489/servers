import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import { AuditEntry } from 'services/auditLog.api';

interface AuditLogTableProps {
  entries: AuditEntry[];
}

export default function AuditLogTable({ entries }: AuditLogTableProps) {
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
          {entries.map((entry) => (
            <TableRow key={entry.id} hover>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {entry.timestamp}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2">{entry.user}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip
                  label={entry.action}
                  color={getActionColor(entry.action) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ color: 'text.secondary' }}>
                    {getResourceIcon(entry.resourceType)}
                  </Box>
                  <Box>
                    <Typography variant="body2">{entry.resource}</Typography>
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
                <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                  {entry.ipAddress}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={entry.status}
                  color={getStatusColor(entry.status) as any}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

