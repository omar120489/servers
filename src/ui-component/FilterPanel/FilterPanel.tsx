import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { IconChevronDown, IconChevronUp, IconFilter, IconX } from '@tabler/icons-react';

export interface FilterConfig {
  label: string;
  type: 'text' | 'date-range' | 'number-range' | 'multi-select' | 'single-select';
  field: string;
  options?: Array<{ value: string; label: string }>;
}

export interface FilterValues {
  [key: string]: string | number | string[] | undefined;
}

interface FilterPanelProps {
  /** Configuration for each filter control */
  filters: FilterConfig[];
  /** Current filter values */
  values: FilterValues;
  /** Callback when filters change */
  onChange: (values: FilterValues) => void;
  /** Callback when "Apply Filters" is clicked */
  onApply?: () => void;
  /** Callback when "Clear All" is clicked */
  onClear: () => void;
  /** Whether to show the preset management section */
  showPresets?: boolean;
  /** Available presets */
  presets?: Array<{ name: string; filters: FilterValues }>;
  /** Callback to save a new preset */
  onSavePreset?: (name: string, filters: FilterValues) => void;
  /** Callback to load a preset */
  onLoadPreset?: (filters: FilterValues) => void;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onApply,
  onClear,
  showPresets = false,
  presets = [],
  onSavePreset,
  onLoadPreset
}: FilterPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  const handleChange = (field: string, value: unknown) => {
    onChange({ ...values, [field]: value });
  };

  const handleMultiSelectChange = (field: string, event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onChange({ ...values, [field]: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSavePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName.trim(), values);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const handleLoadPreset = (presetFilters: FilterValues) => {
    if (onLoadPreset) {
      onLoadPreset(presetFilters);
    }
  };

  const hasActiveFilters = Object.values(values).some((val) => {
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== '';
  });

  return (
    <Box sx={{ mb: 2 }}>
      {/* Toggle Button */}
      <Button
        variant="outlined"
        startIcon={<IconFilter size={18} />}
        endIcon={expanded ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        onClick={() => setExpanded(!expanded)}
        sx={{ mb: expanded ? 2 : 0 }}
      >
        {expanded ? 'Hide Filters' : 'Show Filters'}
        {hasActiveFilters && !expanded && (
          <Box
            component="span"
            sx={{
              ml: 1,
              px: 1,
              py: 0.25,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            Active
          </Box>
        )}
      </Button>

      {/* Filter Controls */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
          {/* Preset Management */}
          {showPresets && (
            <Box sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Filter Presets
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {presets.map((preset, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    variant="outlined"
                    onClick={() => handleLoadPreset(preset.filters)}
                  >
                    {preset.name}
                  </Button>
                ))}
                <Button size="small" variant="text" onClick={() => setShowSavePreset(!showSavePreset)}>
                  {showSavePreset ? 'Cancel' : '+ Save Current'}
                </Button>
              </Stack>

              {showSavePreset && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Preset name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button size="small" variant="contained" onClick={handleSavePreset} disabled={!presetName.trim()}>
                    Save
                  </Button>
                </Stack>
              )}
            </Box>
          )}

          {/* Filter Fields */}
          <Grid container spacing={2}>
            {filters.map((filter) => {
              if (filter.type === 'text') {
                return (
                  <Grid item xs={12} sm={6} md={4} key={filter.field}>
                    <TextField
                      fullWidth
                      size="small"
                      label={filter.label}
                      value={(values[filter.field] as string) || ''}
                      onChange={(e) => handleChange(filter.field, e.target.value)}
                    />
                  </Grid>
                );
              }

              if (filter.type === 'date-range') {
                return (
                  <Grid item xs={12} sm={6} md={4} key={filter.field}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label={`${filter.label} From`}
                        value={(values[`${filter.field}_from`] as string) || ''}
                        onChange={(e) => handleChange(`${filter.field}_from`, e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label={`${filter.label} To`}
                        value={(values[`${filter.field}_to`] as string) || ''}
                        onChange={(e) => handleChange(`${filter.field}_to`, e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Stack>
                  </Grid>
                );
              }

              if (filter.type === 'number-range') {
                return (
                  <Grid item xs={12} sm={6} md={4} key={filter.field}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label={`${filter.label} Min`}
                        value={(values[`${filter.field}_min`] as number) || ''}
                        onChange={(e) => handleChange(`${filter.field}_min`, e.target.value ? Number(e.target.value) : undefined)}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label={`${filter.label} Max`}
                        value={(values[`${filter.field}_max`] as number) || ''}
                        onChange={(e) => handleChange(`${filter.field}_max`, e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </Stack>
                  </Grid>
                );
              }

              if (filter.type === 'multi-select' && filter.options) {
                return (
                  <Grid item xs={12} sm={6} md={4} key={filter.field}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`${filter.field}-label`}>{filter.label}</InputLabel>
                      <Select
                        labelId={`${filter.field}-label`}
                        multiple
                        value={(values[filter.field] as string[]) || []}
                        onChange={(e) => handleMultiSelectChange(filter.field, e)}
                        input={<OutlinedInput label={filter.label} />}
                        renderValue={(selected) => (selected as string[]).join(', ')}
                      >
                        {filter.options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                );
              }

              if (filter.type === 'single-select' && filter.options) {
                return (
                  <Grid item xs={12} sm={6} md={4} key={filter.field}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`${filter.field}-label`}>{filter.label}</InputLabel>
                      <Select
                        labelId={`${filter.field}-label`}
                        value={(values[filter.field] as string) || ''}
                        onChange={(e) => handleChange(filter.field, e.target.value)}
                        label={filter.label}
                      >
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
                        {filter.options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                );
              }

              return null;
            })}
          </Grid>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }} justifyContent="flex-end">
            <Button variant="outlined" startIcon={<IconX size={18} />} onClick={onClear} disabled={!hasActiveFilters}>
              Clear All
            </Button>
            {onApply && (
              <Button variant="contained" onClick={onApply}>
                Apply Filters
              </Button>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}


