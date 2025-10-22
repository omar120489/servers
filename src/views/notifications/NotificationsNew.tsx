import { memo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Pagination,
  Select,
  type SelectChangeEvent,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import {
  IconBell,
  IconBellOff,
  IconCheck,
  IconChevronDown,
  IconExternalLink,
  IconRefresh,
  IconSettings,
  IconX
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import AppPage from 'layouts/AppPage';
import { useNotifications, type NotificationFilter } from 'hooks/useNotifications';
import { useNotificationPreferences, type NotificationType } from 'hooks/useNotificationPreferences';
import type { Notification } from 'types/api';
import { isNewNotification } from 'utils/notifications';
import { track } from 'utils/analytics';

/**
 * Format date string to relative time (e.g., "2 minutes ago")
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

/**
 * Get chip color based on notification type
 */
function getTypeColor(
  type?: string
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'default';
  }
}

/**
 * Map entity type to route
 */
function getEntityRoute(entityType?: string, entityId?: string | number): string | null {
  if (!entityType || !entityId) return null;

  const routeMap: Record<string, string> = {
    deal: '/deals',
    lead: '/leads',
    contact: '/contacts',
    company: '/companies'
  };

  const basePath = routeMap[entityType.toLowerCase()];
  return basePath ? `${basePath}/${entityId}` : null;
}

/**
 * Individual notification item with action buttons
 */
interface NotificationItemProps {
  readonly notification: Notification;
  readonly onMarkAsRead: (id: string | number) => Promise<void>;
  readonly onMarkAsUnread: (id: string | number) => Promise<void>;
}

function InnerNotificationItem({ notification, onMarkAsRead, onMarkAsUnread }: NotificationItemProps) {
  const navigate = useNavigate();
  const isNew = isNewNotification(notification.createdAt);

  const handleMainClick = () => {
    if (!notification.isRead) {
      void onMarkAsRead(notification.id);
    }
  };

  const handleToggleRead = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (notification.isRead) {
      void onMarkAsUnread(notification.id);
    } else {
      void onMarkAsRead(notification.id);
    }
  };

  const handleNavigate = (event: React.MouseEvent) => {
    event.stopPropagation();
    const route = getEntityRoute(notification.entityType, notification.entityId);
    if (route) {
      navigate(route);
    }
  };

  const entityRoute = getEntityRoute(notification.entityType, notification.entityId);

  return (
    <>
      <ListItem disablePadding sx={{ position: 'relative' }}>
        <ListItemButton onClick={handleMainClick} sx={{ py: 2, pr: 10 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {!notification.isRead && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    flexShrink: 0
                  }}
                />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{
                    fontWeight: notification.isRead ? 400 : 600,
                    color: notification.isRead ? 'text.secondary' : 'text.primary'
                  }}
                >
                  {notification.title}
                </Typography>
                {notification.message && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {notification.message}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatRelativeTime(notification.createdAt)}
                  </Typography>
                  {!notification.isRead && (
                    <Chip
                      label="Unread"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: '#ffebee',
                        color: '#d32f2f',
                        fontWeight: 500
                      }}
                    />
                  )}
                  {isNew && (
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: '#fff3e0',
                        color: '#e65100',
                        fontWeight: 500
                      }}
                    />
                  )}
                </Box>
              </Box>
              {notification.type && (
                <Chip
                  label={notification.type}
                  color={getTypeColor(notification.type)}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'capitalize', flexShrink: 0 }}
                />
              )}
            </Box>
          </Box>
        </ListItemButton>

        <Box
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: 0.5
          }}
        >
          <Tooltip title={notification.isRead ? 'Mark as unread' : 'Mark as read'}>
            <IconButton size="small" onClick={handleToggleRead}>
              {notification.isRead ? <IconX size={18} /> : <IconCheck size={18} />}
            </IconButton>
          </Tooltip>

          {entityRoute && (
            <Tooltip title={`Open ${notification.entityType || 'entity'}`}>
              <IconButton size="small" onClick={handleNavigate}>
                <IconExternalLink size={18} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </ListItem>
      <Divider />
    </>
  );
}

const NotificationItem = memo(InnerNotificationItem, (prev, next) => {
  const a = prev.notification;
  const b = next.notification;
  return (
    a.id === b.id &&
    a.isRead === b.isRead &&
    a.createdAt === b.createdAt &&
    a.title === b.title &&
    a.message === b.message &&
    (a.entityType ?? '') === (b.entityType ?? '') &&
    (a.entityId ?? '') === (b.entityId ?? '')
  );
});

/**
 * Preferences UI component
 */
function NotificationPreferences() {
  const { mutedTypes, isMuted, toggleMute, muteAll, unmuteAll } = useNotificationPreferences();

  const notificationTypes: Array<{ type: NotificationType; label: string }> = [
    { type: 'comment', label: 'Comments' },
    { type: 'attachment', label: 'Attachments' },
    { type: 'notification', label: 'System Notifications' },
    { type: 'email', label: 'Emails' },
    { type: 'mention', label: 'Mentions' }
  ];

  const allMuted = mutedTypes.length === notificationTypes.length;
  const noneMuted = mutedTypes.length === 0;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<IconChevronDown />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconSettings size={20} />
          <Typography variant="subtitle1">Notification Preferences</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Choose which types of notifications you want to receive as toasts.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {notificationTypes.map(({ type, label }) => (
              <FormControlLabel
                key={type}
                control={<Switch checked={!isMuted(type)} onChange={() => toggleMute(type)} />}
                label={label}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={unmuteAll} disabled={noneMuted}>
              Enable All
            </Button>
            <Button size="small" variant="outlined" color="secondary" onClick={muteAll} disabled={allMuted}>
              Disable All
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * Notifications Center Page - Berry Frame Version
 */
export default function Notifications() {
  const navigate = useNavigate();
  const {
    paginatedNotifications,
    filteredNotifications,
    unreadCount,
    loading,
    error,
    page,
    totalPages,
    filter,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    setPage,
    setFilter,
    refresh
  } = useNotifications();

  const hasNotifications = paginatedNotifications.length > 0;
  const filterCount = filteredNotifications.length;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterChange = (event: SelectChangeEvent<NotificationFilter>) => {
    const newFilter = event.target.value as NotificationFilter;
    setFilter(newFilter);
    track('notifications_filter_change', { filter: newFilter });
  };

  const handleMarkAllAsRead = () => {
    track('notifications_mark_all', { unreadCount });
    void markAllAsRead();
  };

  const notificationPlural = unreadCount > 1 ? 's' : '';
  const subtitle = unreadCount > 0
    ? `${unreadCount} unread notification${notificationPlural}`
    : 'All caught up!';

  const actions = (
    <Button
      variant="outlined"
      startIcon={<IconRefresh />}
      onClick={() => void refresh()}
      disabled={loading}
      size="small"
    >
      Refresh
    </Button>
  );

  const toolbar = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <NotificationPreferences />
      
      {!loading && !error && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Filter</InputLabel>
              <Select value={filter} onChange={handleFilterChange} label="Filter">
                <MenuItem value="all">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    All Notifications
                    {filterCount > 0 && (
                      <Chip
                        label={filterCount}
                        size="small"
                        sx={{
                          height: 20,
                          bgcolor: '#ff9800',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Box>
                </MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            {unreadCount > 0 && (
              <Button variant="text" size="small" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </Box>
          <Divider />
        </>
      )}

      {!loading && !error && hasNotifications && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconBell size={20} />
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      )}
    </Box>
  );

  const emptySlot = (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <IconBellOff size={64} stroke={1.5} style={{ opacity: 0.3 }} />
      <Typography variant="h4" color="text.secondary" sx={{ mt: 2 }}>
        No notifications yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        You're all caught up! We'll notify you when something new happens.
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => {
          track('notifications_empty_cta_click', { destination: 'leads/new' });
          navigate('/leads/new');
        }}
      >
        Create a lead
      </Button>
    </Box>
  );

  const footer = totalPages > 1 ? (
    <Pagination
      count={totalPages}
      page={page}
      onChange={handlePageChange}
      color="primary"
      showFirstButton
      showLastButton
    />
  ) : undefined;

  return (
    <AppPage
      title="Notifications"
      subtitle={subtitle}
      actions={actions}
      toolbar={toolbar}
      loading={loading}
      error={error}
      empty={!hasNotifications}
      emptySlot={emptySlot}
      onRetry={() => void refresh()}
      footer={footer}
      ariaLabel="Notifications center"
    >
      <List sx={{ p: 0 }}>
        {paginatedNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={markAsRead}
            onMarkAsUnread={markAsUnread}
          />
        ))}
      </List>
    </AppPage>
  );
}

