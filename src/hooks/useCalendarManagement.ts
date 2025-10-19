import { useState, useMemo } from 'react';
import { CalendarEvent } from 'services/calendar.api';

export type CalendarView = 'year' | 'month' | 'week' | 'day';

export function useCalendarManagement(events: CalendarEvent[]) {
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Date navigation helpers
  const getDaysInWeek = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
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

  const getMonthsInYear = (date: Date) => {
    const year = date.getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  };

  // Event filtering
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventsForMonth = (month: Date) => {
    return events.filter(event => 
      event.date.getMonth() === month.getMonth() &&
      event.date.getFullYear() === month.getFullYear()
    );
  };

  // Navigation
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

  // Formatting
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getViewTitle = () => {
    switch (view) {
      case 'year':
        return selectedDate.getFullYear().toString();
      case 'month':
        return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'week':
        const weekDays = getDaysInWeek(selectedDate);
        return `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`;
      case 'day':
        return formatDate(selectedDate);
    }
  };

  return {
    view,
    setView,
    selectedDate,
    setSelectedDate,
    getDaysInWeek,
    getDaysInMonth,
    getMonthsInYear,
    getEventsForDate,
    getEventsForMonth,
    navigateDate,
    goToToday,
    formatDate,
    getViewTitle,
  };
}

