import { useCallback, useEffect, useMemo, useState } from 'react';

import { notificationsService } from 'services/notifications';
import type { Notification, NotificationListResponse } from 'types/api';
import { useWebSocketEvents } from './useWebSocketEvents';
import { isNewNotification } from 'utils/notifications';

export type NotificationFilter = 'all' | 'new' | 'unread' | 'other';

interface UseNotificationsResult {
  notifications: Notification[];
  filteredNotifications: Notification[];
  paginatedNotifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: unknown;
  page: number;
  pageSize: number;
  totalPages: number;
  filter: NotificationFilter;
  refresh: () => Promise<void>;
  markAsRead: (id: string | number) => Promise<void>;
  markAsUnread: (id: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: NotificationFilter) => void;
}

/**
 * Hook to manage notifications with WebSocket real-time updates
 *
 * Features:
 * - Auto-load notifications on mount
 * - Compute unread count from state
 * - Subscribe to `notification:new` WebSocket event
 * - Optimistic updates for mark-as-read operations
 *
 * @example
 * ```tsx
 * const { notifications, unreadCount, markAsRead } = useNotifications();
 *
 * return (
 *   <div>
 *     <Badge badgeContent={unreadCount} color="error">
 *       <NotificationsIcon />
 *     </Badge>
 *     {notifications.map(notif => (
 *       <div key={notif.id} onClick={() => markAsRead(notif.id)}>
 *         {notif.title}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const { subscribe } = useWebSocketEvents();

  // Compute unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Filter notifications based on selected filter
  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'new':
        // New notifications (last 24 hours)
        return notifications.filter((n) => isNewNotification(n.createdAt));
      case 'unread':
        // Unread notifications only
        return notifications.filter((n) => !n.isRead);
      case 'other':
        // Read and older than 24 hours
        return notifications.filter((n) => n.isRead || !isNewNotification(n.createdAt));
      case 'all':
      default:
        // All notifications
        return notifications;
    }
  }, [notifications, filter]);

  // Compute total pages based on filtered results
  const totalPages = useMemo(() => {
    return Math.ceil(filteredNotifications.length / pageSize);
  }, [filteredNotifications.length, pageSize]);

  // Compute paginated notifications for current page
  const paginatedNotifications = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredNotifications.slice(startIndex, endIndex);
  }, [filteredNotifications, page, pageSize]);

  // Load notifications from API
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response: NotificationListResponse = await notificationsService.listNotifications();
      setNotifications(response.items);
      setError(null);
    } catch (err) {
      setError(err);
      console.error('[useNotifications] Failed to load notifications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load on mount
  useEffect(() => {
    void load();
  }, [load]);

  // Subscribe to new notification events via WebSocket
  useEffect(() => {
    const unsubscribe = subscribe('notification:new', (data) => {
      try {
        const newNotification = data as Notification;
        setNotifications((prev) => [newNotification, ...prev]);
      } catch (err) {
        console.error('[useNotifications] Failed to handle notification:new event:', err);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  // Subscribe to notification read events
  useEffect(() => {
    const markNotificationAsRead = (id: string | number) => {
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
    };

    const handleNotificationRead = (data: unknown) => {
      const { id } = data as { id: string | number };
      markNotificationAsRead(id);
    };

    const unsubscribe = subscribe('notification:read', handleNotificationRead);
    return unsubscribe;
  }, [subscribe]);

  // Subscribe to mark all as read events
  useEffect(() => {
    const markAllNotificationsAsRead = () => {
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    };

    const unsubscribe = subscribe('notifications:all-read', markAllNotificationsAsRead);
    return unsubscribe;
  }, [subscribe]);

  // Refresh notifications
  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  // Mark a notification as read with optimistic update
  const markAsRead = useCallback(async (id: string | number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );

    try {
      await notificationsService.markAsRead(id);
    } catch (err) {
      console.error('[useNotifications] Failed to mark notification as read:', err);
      // Revert optimistic update on error
      await load();
      throw err;
    }
  }, [load]);

  // Mark a notification as unread with optimistic update
  const markAsUnread = useCallback(async (id: string | number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: false } : notif))
    );

    try {
      // Note: Backend endpoint doesn't exist yet, but structure is ready
      // await notificationsService.markAsUnread(id);
      console.log('[useNotifications] Mark as unread not yet implemented on backend for id:', id);
    } catch (err) {
      console.error('[useNotifications] Failed to mark notification as unread:', err);
      // Revert optimistic update on error
      await load();
      throw err;
    }
  }, [load]);

  // Mark all notifications as read with optimistic update
  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    const previousNotifications = notifications;
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));

    try {
      await notificationsService.markAllAsRead();
    } catch (err) {
      console.error('[useNotifications] Failed to mark all notifications as read:', err);
      // Revert optimistic update on error
      setNotifications(previousNotifications);
      throw err;
    }
  }, [notifications, load]);

  // Handle page change - reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  return {
    notifications,
    filteredNotifications,
    paginatedNotifications,
    unreadCount,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    filter,
    refresh,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    setPage,
    setPageSize,
    setFilter
  };
}

export default useNotifications;

