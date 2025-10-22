import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useNotifications } from 'hooks/useNotifications';

interface NotificationsContextValue {
  unreadCount: number;
  refresh: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

interface NotificationsProviderProps {
  readonly children: ReactNode;
}

/**
 * Provides notifications state to the entire app
 * Primarily used for displaying unread count in menu badge
 * Mounts useNotifications once at app level to avoid duplicate subscriptions
 */
export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const { unreadCount, refresh } = useNotifications();

  const value = useMemo(() => ({ unreadCount, refresh }), [unreadCount, refresh]);

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

/**
 * Hook to access unread count from anywhere in the app
 * Used primarily by the notifications menu badge
 */
export function useUnreadCount(): number {
  const context = useContext(NotificationsContext);
  if (!context) {
    // Return 0 if context not available (e.g., in tests or before mount)
    return 0;
  }
  return context.unreadCount;
}

/**
 * Hook to access full notifications context
 */
export function useNotificationsContext(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within NotificationsProvider');
  }
  return context;
}

