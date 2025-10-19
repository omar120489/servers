import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Slider,
  TextField,
  Autocomplete,
  Box,
} from '@mui/material';

interface DealFiltersProps {
  open: boolean;
  onClose: () => void;
  valueRange: [number, number];
  setValueRange: (range: [number, number]) => void;
  probabilityRange: [number, number];
  setProbabilityRange: (range: [number, number]) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedStages: string[];
  setSelectedStages: (stages: string[]) => void;
  allTags: string[];
  stages: Array<{ id: string; label: string }>;
  formatCurrency: (value: number) => string;
}

export default function DealFilters({
  open,
  onClose,
  valueRange,
  setValueRange,
  probabilityRange,
  setProbabilityRange,
  dateRange,
  setDateRange,
  selectedTags,
  setSelectedTags,
  selectedStages,
  setSelectedStages,
  allTags,
  stages,
  formatCurrency,
}: DealFiltersProps) {
  const handleClearAll = () => {
    setValueRange([0, 100000]);
    setProbabilityRange([0, 100]);
    setDateRange({ start: '', end: '' });
    setSelectedTags([]);
    setSelectedStages([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Advanced Filters</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography gutterBottom>Value Range</Typography>
            <Slider
              value={valueRange}
              onChange={(_, newValue) => setValueRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={1000}
              valueLabelFormat={(value) => formatCurrency(value)}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption">{formatCurrency(valueRange[0])}</Typography>
              <Typography variant="caption">{formatCurrency(valueRange[1])}</Typography>
            </Stack>
          </Box>

          <Box>
            <Typography gutterBottom>Probability Range (%)</Typography>
            <Slider
              value={probabilityRange}
              onChange={(_, newValue) => setProbabilityRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption">{probabilityRange[0]}%</Typography>
              <Typography variant="caption">{probabilityRange[1]}%</Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>

          <Autocomplete
            multiple
            options={allTags}
            value={selectedTags}
            onChange={(_, newValue) => setSelectedTags(newValue)}
            renderInput={(params) => <TextField {...params} label="Tags" />}
          />

          <Autocomplete
            multiple
            options={stages.map(s => s.id)}
            getOptionLabel={(option) => stages.find(s => s.id === option)?.label || option}
            value={selectedStages}
            onChange={(_, newValue) => setSelectedStages(newValue)}
            renderInput={(params) => <TextField {...params} label="Stages" />}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClearAll}>Clear All</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

