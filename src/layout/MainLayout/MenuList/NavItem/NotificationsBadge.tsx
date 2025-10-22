import Badge from '@mui/material/Badge';
import { useUnreadCount } from 'contexts/NotificationsContext';
import type { ElementType } from 'react';

interface NotificationsBadgeProps {
  readonly icon: ElementType;
  readonly size?: string | number;
  readonly stroke?: string | number;
  readonly style?: React.CSSProperties;
}

/**
 * Wraps notification icon with MUI Badge showing unread count
 * Consumes unread count from NotificationsContext
 *
 * @example
 * ```tsx
 * <NotificationsBadge icon={IconBellRinging} size="20px" stroke={1.5} />
 * ```
 */
export default function NotificationsBadge({ icon: Icon, size, stroke, style }: NotificationsBadgeProps) {
  const unreadCount = useUnreadCount();

  return (
    <Badge
      badgeContent={unreadCount > 0 ? `0${unreadCount}`.slice(-2) : undefined}
      max={99}
      sx={{
        '& .MuiBadge-badge': {
          bgcolor: '#ff9800',
          color: 'white',
          fontWeight: 600,
          minWidth: 20,
          height: 20,
          fontSize: '0.7rem',
          padding: '0 4px'
        }
      }}
    >
      <Icon size={size} stroke={stroke} style={style} />
    </Badge>
  );
}

