import axios from 'axios';

// Types
export interface CalendarEvent {
  id: number;
  title: string;
  type: 'meeting' | 'call' | 'deadline' | 'task';
  date: Date;
  time: string;
  duration: string;
  contact?: string;
  company?: string;
  description?: string;
}

export interface CalendarFilters {
  startDate?: Date;
  endDate?: Date;
  type?: string;
}

// API Client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Mock Data
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
    title: 'Discovery call - DataFlow',
    type: 'call',
    date: new Date(2024, 9, 22, 15, 0),
    time: '3:00 PM',
    duration: '45 mins',
    contact: 'Robert Taylor',
    company: 'DataFlow Inc',
    description: 'Initial conversation about API integration needs',
  },
  {
    id: 8,
    title: 'Training session - EduTech',
    type: 'meeting',
    date: new Date(2024, 9, 23, 13, 0),
    time: '1:00 PM',
    duration: '2 hours',
    contact: 'Lisa Anderson',
    company: 'EduTech',
    description: 'Onboarding and product training for new users',
  },
];

// API Functions
export async function fetchEvents(filters: CalendarFilters = {}): Promise<CalendarEvent[]> {
  try {
    const response = await apiClient.get<CalendarEvent[]>('/calendar/events', { params: filters });
    return response.data.map(event => ({
      ...event,
      date: new Date(event.date),
    }));
  } catch (error) {
    console.warn('API not available, using mock data:', error);
    
    // Apply filters to mock data
    let filtered = [...mockEvents];
    
    if (filters.startDate) {
      filtered = filtered.filter(event => event.date >= filters.startDate!);
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(event => event.date <= filters.endDate!);
    }
    
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(event => event.type === filters.type);
    }
    
    return filtered;
  }
}

export async function createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
  try {
    const response = await apiClient.post<CalendarEvent>('/calendar/events', event);
    return {
      ...response.data,
      date: new Date(response.data.date),
    };
  } catch (error) {
    console.warn('API not available, creating mock event:', error);
    return {
      ...event,
      id: Date.now(),
    };
  }
}

export async function updateEvent(id: number, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
  try {
    const response = await apiClient.put<CalendarEvent>(`/calendar/events/${id}`, event);
    return {
      ...response.data,
      date: new Date(response.data.date),
    };
  } catch (error) {
    console.warn('API not available, updating mock event:', error);
    const existing = mockEvents.find(e => e.id === id);
    return {
      ...existing!,
      ...event,
      id,
      date: event.date || existing!.date,
    };
  }
}

export async function deleteEvent(id: number): Promise<void> {
  try {
    await apiClient.delete(`/calendar/events/${id}`);
  } catch (error) {
    console.warn('API not available, deleting mock event:', error);
  }
}

export function exportToICS(events: CalendarEvent[]): Blob {
  let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Traffic CRM//Calendar//EN\n';
  
  events.forEach(event => {
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
  
  return new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
}

