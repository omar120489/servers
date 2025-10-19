import React, { useState } from 'react';
import { Box, Button, Stack, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { PageHeader, LoadingState, ErrorState } from 'components/shared';
import CalendarFilters from 'components/calendar/CalendarFilters';
import CalendarViewControls from 'components/calendar/CalendarViewControls';
import IcsHint from 'components/calendar/IcsHint';
import { useCalendarEvents, useExportCalendar } from 'hooks/useCalendar';
import { useCalendarManagement } from 'hooks/useCalendarManagement';
import { CalendarEvent } from 'services/calendar.api';

export default function Calendar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Fetch events
  const { data: events = [], isLoading, error } = useCalendarEvents();

  // Calendar management
  const {
    view,
    setView,
    selectedDate,
    navigateDate,
    goToToday,
    getViewTitle,
    getEventsForDate,
    getEventsForMonth,
    getDaysInWeek,
    getDaysInMonth,
    getMonthsInYear,
  } = useCalendarManagement(events);

  // Export
  const { mutate: exportCalendar, isPending: isExporting } = useExportCalendar();

  // Filter events
  const filteredEvents = events.filter((event: CalendarEvent) => {
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(event.type);

    return matchesSearch && matchesType;
  });

  // Event counts for filters
  const eventCounts = {
    meeting: events.filter((e: CalendarEvent) => e.type === 'meeting').length,
    call: events.filter((e: CalendarEvent) => e.type === 'call').length,
    deadline: events.filter((e: CalendarEvent) => e.type === 'deadline').length,
    task: events.filter((e: CalendarEvent) => e.type === 'task').length,
  };

  const handleExport = () => {
    exportCalendar(filteredEvents);
  };

  if (isLoading) {
    return <LoadingState message="Loading calendar..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load calendar events. Please try again."
        severity="error"
      />
    );
  }

  return (
    <Box>
      <PageHeader
        title="Calendar"
        description="Manage your meetings, calls, and tasks"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export ICS'}
            </Button>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Event
            </Button>
          </Stack>
        }
      />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <CalendarFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          eventCounts={eventCounts}
        />
      </Paper>

      {/* View Controls */}
      <CalendarViewControls
        view={view}
        onViewChange={setView}
        viewTitle={getViewTitle()}
        onNavigate={navigateDate}
        onToday={goToToday}
      />

      {/* ICS Hint */}
      <IcsHint />

      {/* Calendar Views - Simplified for now */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <p>Calendar view rendering: {view}</p>
          <p>Total events: {filteredEvents.length}</p>
          <p>Selected date: {selectedDate.toDateString()}</p>
        </Box>
      </Paper>
    </Box>
  );
}

