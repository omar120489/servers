import React from 'react';
import {
  Paper,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Typography,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import { CalendarView } from 'hooks/useCalendarManagement';

interface CalendarViewControlsProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  viewTitle: string;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
}

export default function CalendarViewControls({
  view,
  onViewChange,
  viewTitle,
  onNavigate,
  onToday,
}: CalendarViewControlsProps) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => newView && onViewChange(newView)}
          size="small"
        >
          <ToggleButton value="year">Year</ToggleButton>
          <ToggleButton value="month">
            <CalendarMonthIcon sx={{ mr: 1 }} fontSize="small" />
            Month
          </ToggleButton>
          <ToggleButton value="week">
            <ViewWeekIcon sx={{ mr: 1 }} fontSize="small" />
            Week
          </ToggleButton>
          <ToggleButton value="day">
            <ViewDayIcon sx={{ mr: 1 }} fontSize="small" />
            Day
          </ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button size="small" onClick={() => onNavigate('prev')}>
            ← Prev
          </Button>
          <Button size="small" variant="outlined" onClick={onToday}>
            Today
          </Button>
          <Button size="small" onClick={() => onNavigate('next')}>
            Next →
          </Button>
          <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
            {viewTitle}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

