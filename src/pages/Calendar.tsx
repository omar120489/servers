import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import EventIcon from '@mui/icons-material/Event';
import IcsHint from '../components/calendar/IcsHint';
import CalendarEventComponent from '../components/calendar/CalendarEvent';
import CalendarFilters from '../components/calendar/CalendarFilters';
import type { CalendarEvent } from '../components/calendar/CalendarEvent';

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Demo with Acme Corp',
    type: 'meeting',
    date: new Date(2024, 9, 18, 10, 0),
    time: '10:00 AM',
    duration: '1 hour',
    contact: 'John Smith',
    company: 'Acme Corp',
    description: 'Product demonstration for Enterprise Software License',
  },
  {
    id: 2,
    title: 'Follow-up call with TechStart',
    type: 'call',
    date: new Date(2024, 9, 18, 14, 0),
    time: '2:00 PM',
    duration: '30 mins',
    contact: 'Sarah Johnson',
    company: 'TechStart Inc',
    description: 'Discuss cloud migration timeline',
  },
  {
    id: 3,
    title: 'Proposal deadline - Global Systems',
    type: 'deadline',
    date: new Date(2024, 9, 19, 17, 0),
    time: '5:00 PM',
    duration: '-',
    company: 'Global Systems',
    description: 'Submit final proposal for Annual Support Contract',
  },
  {
    id: 4,
    title: 'Team standup',
    type: 'meeting',
    date: new Date(2024, 9, 19, 9, 0),
    time: '9:00 AM',
    duration: '15 mins',
    description: 'Daily team sync',
  },
  {
    id: 5,
    title: 'Contract review - Innovate LLC',
    type: 'task',
    date: new Date(2024, 9, 20, 11, 0),
    time: '11:00 AM',
    duration: '2 hours',
    contact: 'Emily Davis',
    company: 'Innovate LLC',
    description: 'Review custom development contract terms',
  },
  {
    id: 6,
    title: 'Kickoff meeting - AppMakers',
    type: 'meeting',
    date: new Date(2024, 9, 21, 10, 0),
    time: '10:00 AM',
    duration: '1 hour',
    contact: 'Jennifer Lee',
    company: 'AppMakers',
    description: 'Mobile app development project kickoff',
  },
  {
    id: 7,
    title: 'Quarterly review',
    type: 'meeting',
    date: new Date(2024, 9, 22, 15, 0),
    time: '3:00 PM',
    duration: '2 hours',
    description: 'Q4 performance review with management',
  },
];

export default function Calendar() {
  const [view, setView] = useState<'year' | 'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['meeting', 'call', 'task', 'deadline']);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'call': return 'success';
      case 'task': return 'warning';
      case 'deadline': return 'error';
      default: return 'default';
    }
  };

  const getEventIcon = (type: string) => {
    return <EventIcon fontSize="small" />;
  };

  // Filter events based on search and type
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.contact?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.includes(event.type);
    return matchesSearch && matchesType;
  });

  // Calculate event counts by type
  const eventCounts = {
    meeting: mockEvents.filter((e) => e.type === 'meeting').length,
    call: mockEvents.filter((e) => e.type === 'call').length,
    task: mockEvents.filter((e) => e.type === 'task').length,
    deadline: mockEvents.filter((e) => e.type === 'deadline').length,
  };

  const getDaysInWeek = () => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMonthsInYear = () => {
    const year = selectedDate.getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  };

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventsForMonth = (month: Date) => {
    return mockEvents.filter(event => 
      event.date.getMonth() === month.getMonth() &&
      event.date.getFullYear() === month.getFullYear()
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    switch (view) {
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const exportToICS = () => {
    // Simple ICS export
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Traffic CRM//Calendar//EN\n';
    
    mockEvents.forEach(event => {
      const startDate = event.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `UID:${event.id}@trafficcrm.com\n`;
      icsContent += `DTSTAMP:${startDate}\n`;
      icsContent += `DTSTART:${startDate}\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DESCRIPTION:${event.description || ''}\n`;
      icsContent += `END:VEVENT\n`;
    });
    
    icsContent += 'END:VCALENDAR';
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calendar.ics';
    link.click();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Calendar</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your meetings, calls, and tasks
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToICS}
          >
            Export ICS
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedEvent(null);
              setOpenDialog(true);
            }}
          >
            Add Event
          </Button>
        </Stack>
      </Stack>

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

      {/* View Toggle and Navigation */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => newView && setView(newView)}
            size="small"
          >
            <ToggleButton value="year">
              Year
            </ToggleButton>
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
            <Button size="small" onClick={() => navigateDate('prev')}>
              ← Prev
            </Button>
            <Button size="small" variant="outlined" onClick={goToToday}>
              Today
            </Button>
            <Button size="small" onClick={() => navigateDate('next')}>
              Next →
            </Button>
            <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
              {view === 'year' 
                ? selectedDate.getFullYear()
                : selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Year View */}
      {view === 'year' && (
        <Grid container spacing={2}>
          {getMonthsInYear().map((month, index) => {
            const monthEvents = getEventsForMonth(month);
            const monthName = month.toLocaleDateString('en-US', { month: 'short' });
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => {
                    setSelectedDate(month);
                    setView('month');
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {monthName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}
                  </Typography>
                  <Stack spacing={0.5}>
                    {monthEvents.slice(0, 3).map(event => (
                      <Box 
                        key={event.id}
                        sx={{ 
                          p: 0.5, 
                          borderLeft: 3, 
                          borderColor: `${getEventColor(event.type)}.main`,
                          bgcolor: 'background.default'
                        }}
                      >
                        <Typography variant="caption" noWrap>
                          {event.title}
                        </Typography>
                      </Box>
                    ))}
                    {monthEvents.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{monthEvents.length - 3} more
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Month View */}
      {view === 'month' && (
        <Paper sx={{ p: 2 }}>
          {/* Day headers */}
          <Grid container spacing={1} mb={1}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs={12/7} key={day}>
                <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>
          
          {/* Calendar grid */}
          <Grid container spacing={1}>
            {getDaysInMonth().map((day, index) => {
              if (!day) {
                return <Grid item xs={12/7} key={`empty-${index}`} sx={{ minHeight: 100 }} />;
              }
              
              const dayEvents = getEventsForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
              
              return (
                <Grid item xs={12/7} key={index}>
                  <Paper 
                    sx={{ 
                      p: 1, 
                      minHeight: 100,
                      bgcolor: isToday ? 'primary.light' : 'background.paper',
                      opacity: isCurrentMonth ? 1 : 0.5,
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 2 }
                    }}
                    onClick={() => {
                      setSelectedDate(day);
                      setView('day');
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      fontWeight={isToday ? 'bold' : 'normal'}
                      color={isToday ? 'primary.contrastText' : 'text.primary'}
                      mb={0.5}
                    >
                      {day.getDate()}
                    </Typography>
                    <Stack spacing={0.5}>
                      {dayEvents.slice(0, 2).map(event => (
                        <Box
                          key={event.id}
                          sx={{
                            p: 0.5,
                            bgcolor: `${getEventColor(event.type)}.light`,
                            borderRadius: 0.5,
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          <Typography variant="caption" noWrap fontSize="0.7rem">
                            {event.time.split(' ')[0]} {event.title}
                          </Typography>
                        </Box>
                      ))}
                      {dayEvents.length > 2 && (
                        <Typography variant="caption" fontSize="0.65rem" color="text.secondary">
                          +{dayEvents.length - 2} more
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}

      {/* Week View */}
      {view === 'week' && (
        <Grid container spacing={2}>
          {getDaysInWeek().map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <Grid item xs={12} md={1.71} key={index}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    minHeight: 400,
                    bgcolor: isToday ? 'primary.light' : 'background.paper',
                    opacity: isToday ? 0.9 : 1,
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="bold" 
                    mb={2}
                    color={isToday ? 'primary.contrastText' : 'text.primary'}
                  >
                    {formatDate(day)}
                  </Typography>
                  <Stack spacing={1}>
                    {dayEvents.map(event => (
                      <Card 
                        key={event.id} 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { boxShadow: 3 }
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Stack spacing={0.5}>
                            <Chip
                              label={event.type}
                              size="small"
                              color={getEventColor(event.type) as any}
                              icon={getEventIcon(event.type)}
                              sx={{ width: 'fit-content' }}
                            />
                            <Typography variant="caption" fontWeight="bold">
                              {event.time}
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {event.title}
                            </Typography>
                            {event.company && (
                              <Typography variant="caption" color="text.secondary">
                                {event.company}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Day View with Hourly Breakdown */}
      {view === 'day' && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>
            {formatDate(selectedDate)}
          </Typography>
          
          {/* Hourly time slots */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {Array.from({ length: 24 }, (_, hour) => {
              const hourStart = hour;
              const hourEnd = hour + 1;
              const timeLabel = `${hourStart.toString().padStart(2, '0')}:00`;
              const nextTimeLabel = `${hourEnd.toString().padStart(2, '0')}:00`;
              
              // Find events in this hour
              const hourEvents = getEventsForDate(selectedDate).filter(event => {
                const eventHour = event.date.getHours();
                return eventHour === hour;
              });
              
              return (
                <Box 
                  key={hour}
                  sx={{ 
                    display: 'flex',
                    borderBottom: 1,
                    borderColor: 'divider',
                    minHeight: 60,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  {/* Time label */}
                  <Box 
                    sx={{ 
                      width: 80, 
                      p: 1, 
                      borderRight: 1, 
                      borderColor: 'divider',
                      flexShrink: 0
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      {timeLabel}
                    </Typography>
                  </Box>
                  
                  {/* Events in this hour */}
                  <Box sx={{ flex: 1, p: 1 }}>
                    <Stack spacing={1}>
                      {hourEvents.map(event => (
                        <Card 
                          key={event.id}
                          sx={{ 
                            cursor: 'pointer',
                            borderLeft: 4,
                            borderColor: `${getEventColor(event.type)}.main`,
                            '&:hover': { boxShadow: 2 }
                          }}
                          onClick={() => handleEventClick(event)}
                        >
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip
                                label={event.type}
                                size="small"
                                color={getEventColor(event.type) as any}
                                sx={{ height: 20 }}
                              />
                              <Typography variant="body2" fontWeight="bold">
                                {event.time} - {event.title}
                              </Typography>
                            </Stack>
                            {(event.company || event.contact) && (
                              <Typography variant="caption" color="text.secondary" mt={0.5}>
                                {event.company && `🏢 ${event.company}`}
                                {event.company && event.contact && ' • '}
                                {event.contact && `👤 ${event.contact}`}
                              </Typography>
                            )}
                            {event.description && (
                              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                {event.description}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}

      {/* ICS Feed Hint */}
      <Box mt={3}>
        <IcsHint />
      </Box>

      {/* Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Event Details' : 'Create New Event'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              defaultValue={selectedEvent?.title || ''}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                defaultValue={selectedEvent?.type || 'meeting'}
              >
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="call">Call</MenuItem>
                <MenuItem value="task">Task</MenuItem>
                <MenuItem value="deadline">Deadline</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              fullWidth
              defaultValue={selectedEvent?.date.toISOString().split('T')[0] || ''}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              fullWidth
              defaultValue={selectedEvent ? selectedEvent.date.toTimeString().slice(0, 5) : ''}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Duration"
              fullWidth
              defaultValue={selectedEvent?.duration || ''}
              placeholder="e.g., 1 hour, 30 mins"
            />
            <TextField
              label="Contact"
              fullWidth
              defaultValue={selectedEvent?.contact || ''}
            />
            <TextField
              label="Company"
              fullWidth
              defaultValue={selectedEvent?.company || ''}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedEvent?.description || ''}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          {selectedEvent && (
            <Button color="error">Delete</Button>
          )}
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            {selectedEvent ? 'Save Changes' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

