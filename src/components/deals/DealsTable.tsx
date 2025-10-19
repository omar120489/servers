/**
 * DealsTable Component
 * 
 * Displays deals in a table format with selection, sorting, and actions.
 * Extracted from Deals page to reduce complexity.
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
  Stack,
  Typography,
  LinearProgress,
  IconButton,
  Checkbox,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Deal } from '../../services/deals.api';

interface DealsTableProps {
  deals: Deal[];
  selectedDeals: number[];
  onSelectAll: () => void;
  onSelectDeal: (dealId: number) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, deal: Deal) => void;
}

export default function DealsTable({
  deals,
  selectedDeals,
  onSelectAll,
  onSelectDeal,
  onMenuClick,
}: DealsTableProps) {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting':
        return 'default';
      case 'Qualification':
        return 'info';
      case 'Proposal':
        return 'warning';
      case 'Negotiation':
        return 'secondary';
      case 'Closed Won':
        return 'success';
      case 'Closed Lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const getProbabilityColor = (probability: number): 'success' | 'warning' | 'error' | 'primary' => {
    if (probability >= 70) return 'success';
    if (probability >= 40) return 'warning';
    if (probability > 0) return 'error';
    return 'primary';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={deals.length > 0 && selectedDeals.length === deals.length}
                indeterminate={selectedDeals.length > 0 && selectedDeals.length < deals.length}
                onChange={onSelectAll}
                aria-label="Select all deals"
              />
            </TableCell>
            <TableCell>Deal</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell>Stage</TableCell>
            <TableCell>Probability</TableCell>
            <TableCell>Close Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((deal) => {
            const isSelected = selectedDeals.includes(deal.id as number);
            return (
              <TableRow key={String(deal.id)} hover selected={isSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelectDeal(deal.id as number)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {deal.title}
                  </Typography>
                </TableCell>
                <TableCell>{deal.company}</TableCell>
                <TableCell>{deal.contact}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(deal.value)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={deal.stage}
                    color={getStageColor(deal.stage)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={`${getProbabilityColor(deal.probability)}.main`}
                    >
                      {deal.probability}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={deal.probability}
                      color={getProbabilityColor(deal.probability)}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(deal.expectedCloseDate)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => onMenuClick(e, deal)}>
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

