import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  exportToICS,
  CalendarEvent,
  CalendarFilters,
} from 'services/calendar.api';

// Query Keys
export const calendarKeys = {
  all: ['calendar'] as const,
  events: (filters: CalendarFilters) => [...calendarKeys.all, 'events', filters] as const,
};

// Hooks
export function useCalendarEvents(filters: CalendarFilters = {}) {
  return useQuery({
    queryKey: calendarKeys.events(filters),
    queryFn: () => fetchEvents(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (event: Omit<CalendarEvent, 'id'>) => createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, event }: { id: number; event: Partial<CalendarEvent> }) =>
      updateEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

export function useExportCalendar() {
  return useMutation({
    mutationFn: (events: CalendarEvent[]) => {
      const blob = exportToICS(events);
      
      // Auto-download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-${new Date().toISOString().split('T')[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return Promise.resolve();
    },
  });
}

