import React from 'react';
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import PhoneIcon from '@mui/icons-material/Phone';
import TaskIcon from '@mui/icons-material/Task';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface CalendarFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  eventCounts?: {
    meeting: number;
    call: number;
    task: number;
    deadline: number;
  };
}

const EVENT_TYPES = [
  { id: 'meeting', label: 'Meetings', icon: EventIcon, color: '#7367F0' },
  { id: 'call', label: 'Calls', icon: PhoneIcon, color: '#28C76F' },
  { id: 'task', label: 'Tasks', icon: TaskIcon, color: '#FF9F43' },
  { id: 'deadline', label: 'Deadlines', icon: AccessTimeIcon, color: '#EA5455' },
];

export default function CalendarFilters({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onTypesChange,
  eventCounts,
}: CalendarFiltersProps) {
  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <TextField
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Filter by type:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {EVENT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedTypes.includes(type.id);
              const count = eventCounts?.[type.id as keyof typeof eventCounts] || 0;

              return (
                <Chip
                  key={type.id}
                  icon={<Icon sx={{ fontSize: 16 }} />}
                  label={`${type.label} (${count})`}
                  onClick={() => handleTypeToggle(type.id)}
                  variant={isSelected ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: isSelected ? type.color : 'transparent',
                    color: isSelected ? 'white' : type.color,
                    borderColor: type.color,
                    fontWeight: isSelected ? 'bold' : 'normal',
                    '&:hover': {
                      bgcolor: isSelected ? type.color : `${type.color}15`,
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Box>

        {selectedTypes.length > 0 && selectedTypes.length < EVENT_TYPES.length && (
          <Chip
            label="Clear Filters"
            size="small"
            onDelete={() => onTypesChange(EVENT_TYPES.map((t) => t.id))}
            sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}
          />
        )}
      </Stack>
    </Box>
  );
}

