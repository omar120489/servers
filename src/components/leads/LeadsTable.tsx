/**
 * LeadsTable Component
 * 
 * Displays leads in a table format with selection, sorting, and actions.
 * Extracted from Leads page to reduce complexity.
 */

import React from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Avatar,
  Stack,
  Typography,
  LinearProgress,
  IconButton,
  Checkbox,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Lead } from '../../types/crm';
import PriorityBadge from '../common/PriorityBadge';

interface LeadsTableProps {
  leads: Lead[];
  selectedLeads: number[];
  onSelectAll: () => void;
  onSelectLead: (leadId: number) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, lead: Lead) => void;
}

export default function LeadsTable({
  leads,
  selectedLeads,
  onSelectAll,
  onSelectLead,
  onMenuClick,
}: LeadsTableProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'contacted':
        return 'warning';
      case 'qualified':
        return 'success';
      case 'converted':
        return 'primary';
      case 'lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const getScoreColor = (score?: number): 'success' | 'warning' | 'error' | 'primary' => {
    if (!score) return 'primary';
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={leads.length > 0 && selectedLeads.length === leads.length}
                indeterminate={selectedLeads.length > 0 && selectedLeads.length < leads.length}
                onChange={onSelectAll}
                aria-label="Select all leads"
              />
            </TableCell>
            <TableCell>Lead</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => {
            const isSelected = selectedLeads.includes(lead.id as number);
            return (
              <TableRow key={String(lead.id)} hover selected={isSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelectLead(lead.id as number)}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(lead.first_name, lead.last_name)}
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '-'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{lead.email || '-'}</TableCell>
                <TableCell>{lead.phone || '-'}</TableCell>
                <TableCell>{lead.company || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={lead.status || 'new'}
                    color={getStatusColor(lead.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={`${getScoreColor(lead.score)}.main`}
                    >
                      {lead.score ?? '-'}
                    </Typography>
                    {lead.score && (
                      <LinearProgress
                        variant="determinate"
                        value={lead.score}
                        color={getScoreColor(lead.score)}
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  {lead.score && <PriorityBadge score={lead.score} size="small" />}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => onMenuClick(e, lead)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

