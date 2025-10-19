/**
 * DealsFilters Component
 * 
 * Advanced filtering dialog for deals.
 * Extracted from Deals page to reduce complexity.
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
  TextField,
} from '@mui/material';

interface DealsFiltersProps {
  open: boolean;
  onClose: () => void;
  stageFilter: string;
  minValue: string;
  maxValue: string;
  onStageFilterChange: (stage: string) => void;
  onMinValueChange: (value: string) => void;
  onMaxValueChange: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
  totalDeals: number;
  filteredDeals: number;
}

export default function DealsFilters({
  open,
  onClose,
  stageFilter,
  minValue,
  maxValue,
  onStageFilterChange,
  onMinValueChange,
  onMaxValueChange,
  onReset,
  onApply,
  totalDeals,
  filteredDeals,
}: DealsFiltersProps) {
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
            <InputLabel>Stage</InputLabel>
            <Select
              value={stageFilter}
              label="Stage"
              onChange={(e) => onStageFilterChange(e.target.value)}
            >
              <MenuItem value="all">All stages</MenuItem>
              <MenuItem value="Prospecting">Prospecting</MenuItem>
              <MenuItem value="Qualification">Qualification</MenuItem>
              <MenuItem value="Proposal">Proposal</MenuItem>
              <MenuItem value="Negotiation">Negotiation</MenuItem>
              <MenuItem value="Closed Won">Closed Won</MenuItem>
              <MenuItem value="Closed Lost">Closed Lost</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Deal value range
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Min value"
                type="number"
                value={minValue}
                onChange={(e) => onMinValueChange(e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
              <TextField
                fullWidth
                label="Max value"
                type="number"
                value={maxValue}
                onChange={(e) => onMaxValueChange(e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Stack>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Filtering {filteredDeals} of {totalDeals} deals
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

