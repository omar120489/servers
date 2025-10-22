import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';

import Notifications from './Notifications';
import type { Notification } from '../../types/api';

// Mock the useNotifications hook
vi.mock('../../hooks/useNotifications', () => ({
  useNotifications: vi.fn()
}));

// Mock useNotificationPreferences
vi.mock('../../hooks/useNotificationPreferences', () => ({
  useNotificationPreferences: () => ({
    mutedTypes: [],
    isMuted: () => false,
    toggleMute: vi.fn(),
    muteAll: vi.fn(),
    unmuteAll: vi.fn()
  })
}));

import { useNotifications } from '../../hooks/useNotifications';

// Helper to render with all necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <MemoryRouter>
            {ui}
          </MemoryRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

describe('Notifications Page', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Unread Notification',
      message: 'This is an unread message',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Read Notification',
      message: 'This is a read message',
      type: 'success',
      isRead: true,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    }
  ];

  const mockMarkAsRead = vi.fn();
  const mockMarkAsUnread = vi.fn();
  const mockMarkAllAsRead = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(useNotifications).mockReturnValue({
      notifications: [],
      filteredNotifications: [],
      paginatedNotifications: [],
      unreadCount: 0,
      loading: true,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    expect(screen.getByTestId('notif-skeletons')).toBeInTheDocument();
    expect(screen.getAllByTestId('notif-skeleton-row').length).toBeGreaterThan(0);
  });

  it('should render error state', () => {
    vi.mocked(useNotifications).mockReturnValue({
      notifications: [],
      filteredNotifications: [],
      paginatedNotifications: [],
      unreadCount: 0,
      loading: false,
      error: new Error('Failed to load'),
      page: 1,
      pageSize: 10,
      totalPages: 0,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    expect(screen.getByText(/Failed to load notifications/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  it('should render empty state when no notifications', () => {
    vi.mocked(useNotifications).mockReturnValue({
      notifications: [],
      filteredNotifications: [],
      paginatedNotifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    expect(screen.getByText(/No notifications yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You're all caught up! We'll notify you when something new happens./i)
    ).toBeInTheDocument();
  });

  it('should render notifications list', () => {
    vi.mocked(useNotifications).mockReturnValue({
      notifications: mockNotifications,
      filteredNotifications: mockNotifications,
      paginatedNotifications: mockNotifications,
      unreadCount: 1,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    expect(screen.getByText('Unread Notification')).toBeInTheDocument();
    expect(screen.getByText('Read Notification')).toBeInTheDocument();
    expect(screen.getByText('This is an unread message')).toBeInTheDocument();
    expect(screen.getByText('This is a read message')).toBeInTheDocument();
  });

  it('should display unread count', () => {
    vi.mocked(useNotifications).mockReturnValue({
      notifications: mockNotifications,
      filteredNotifications: mockNotifications,
      paginatedNotifications: mockNotifications,
      unreadCount: 1,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    // Multiple occurrences are expected, just check one exists
    const elements = screen.getAllByText(/1 unread notification/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should display "All caught up!" when all notifications are read', () => {
    const readNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }));
    
    vi.mocked(useNotifications).mockReturnValue({
      notifications: readNotifications,
      filteredNotifications: readNotifications,
      paginatedNotifications: readNotifications,
      unreadCount: 0,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    // Multiple occurrences are expected (including in ARIA live region), just check one exists
    const elements = screen.getAllByText(/All caught up!/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should show "Mark all as read" button when there are unread notifications', () => {
    vi.mocked(useNotifications).mockReturnValue({
      notifications: mockNotifications,
      filteredNotifications: mockNotifications,
      paginatedNotifications: mockNotifications,
      unreadCount: 1,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    expect(screen.getByRole('button', { name: /Mark all as read/i })).toBeInTheDocument();
  });

  it('should not show "Mark all as read" button when all notifications are read', () => {
    const readNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }));
    
    vi.mocked(useNotifications).mockReturnValue({
      notifications: readNotifications,
      filteredNotifications: readNotifications,
      paginatedNotifications: readNotifications,
      unreadCount: 0,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    expect(screen.queryByRole('button', { name: /Mark all as read/i })).not.toBeInTheDocument();
  });

  it('should call markAsRead when clicking on unread notification', async () => {
    const user = userEvent.setup();
    
    vi.mocked(useNotifications).mockReturnValue({
      notifications: mockNotifications,
      filteredNotifications: mockNotifications,
      paginatedNotifications: mockNotifications,
      unreadCount: 1,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    const unreadNotification = screen.getByText('Unread Notification');
    await user.click(unreadNotification);

    await waitFor(() => {
      expect(mockMarkAsRead).toHaveBeenCalledWith('1');
    });
  });

  it('should not call markAsRead when clicking on read notification', async () => {
    const user = userEvent.setup();
    
    vi.mocked(useNotifications).mockReturnValue({
      notifications: mockNotifications,
      filteredNotifications: mockNotifications,
      paginatedNotifications: mockNotifications,
      unreadCount: 1,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    const readNotification = screen.getByText('Read Notification');
    await user.click(readNotification);

    // Should not call markAsRead for already read notifications
    expect(mockMarkAsRead).not.toHaveBeenCalledWith('2');
  });

  it('should call markAllAsRead when clicking "Mark all as read" button', async () => {
    const user = userEvent.setup();
    
    vi.mocked(useNotifications).mockReturnValue({
      notifications: mockNotifications,
      filteredNotifications: mockNotifications,
      paginatedNotifications: mockNotifications,
      unreadCount: 1,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    const markAllButton = screen.getByRole('button', { name: /Mark all as read/i });
    await user.click(markAllButton);

    await waitFor(() => {
      expect(mockMarkAllAsRead).toHaveBeenCalled();
    });
  });

  it('should display notification type chips', () => {
    vi.mocked(useNotifications).mockReturnValue({
      notifications: mockNotifications,
      filteredNotifications: mockNotifications,
      paginatedNotifications: mockNotifications,
      unreadCount: 1,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    expect(screen.getByText('info')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('should format relative time correctly', () => {
    vi.mocked(useNotifications).mockReturnValue({
      notifications: mockNotifications,
      filteredNotifications: mockNotifications,
      paginatedNotifications: mockNotifications,
      unreadCount: 1,
      loading: false,
      error: null,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      filter: 'all',
      refresh: vi.fn(),
      markAsRead: mockMarkAsRead,
      markAsUnread: mockMarkAsUnread,
      markAllAsRead: mockMarkAllAsRead,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setFilter: vi.fn()
    });

    renderWithProviders(<Notifications />);

    expect(screen.getByText(/5 minutes ago/i)).toBeInTheDocument();
    expect(screen.getByText(/1 hour ago/i)).toBeInTheDocument();
  });
});
