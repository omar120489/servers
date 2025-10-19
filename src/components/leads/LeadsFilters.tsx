/**
 * LeadsFilters Component
 * 
 * Advanced filtering dialog for leads.
 * Extracted from Leads page to reduce complexity.
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';

interface LeadsFiltersProps {
  open: boolean;
  onClose: () => void;
  statusFilter: string;
  scoreRange: number[];
  onStatusFilterChange: (status: string) => void;
  onScoreRangeChange: (range: number[]) => void;
  onReset: () => void;
  onApply: () => void;
  totalLeads: number;
  filteredLeads: number;
}

export default function LeadsFilters({
  open,
  onClose,
  statusFilter,
  scoreRange,
  onStatusFilterChange,
  onScoreRangeChange,
  onReset,
  onApply,
  totalLeads,
  filteredLeads,
}: LeadsFiltersProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="filter-dialog-title"
    >
      <DialogTitle id="filter-dialog-title">Advanced filters</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              Filter options
            </Typography>
          </Box>

          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Score range
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {scoreRange[0]} - {scoreRange[1]}
            </Typography>
            <Slider
              value={scoreRange}
              onChange={(_, newValue) => onScoreRangeChange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
              getAriaLabel={() => 'Score range'}
            />
          </Box>

          <Typography variant="caption" color="text.secondary">
            Filtering {filteredLeads} of {totalLeads} leads
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReset}>Reset</Button>
        <Button onClick={onApply} variant="contained">
          Apply filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}

