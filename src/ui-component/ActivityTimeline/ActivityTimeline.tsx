import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import {
  IconCheck,
  IconMessage,
  IconSwitch,
  IconUserCheck,
  IconFileInvoice,
  IconAlertCircle,
  IconCirclePlus,
  IconTrophy,
  IconX
} from '@tabler/icons-react';
import type { JourneyEvent } from 'types/api';

interface ActivityTimelineProps {
  readonly events: JourneyEvent[];
  readonly loading: boolean;
  readonly error: Error | null;
  readonly onRetry?: () => void;
}

// Map event types to icons and colors
function getEventIcon(type: string): {
  icon: React.ElementType;
  color: string;
  bgcolor: string;
} {
  switch (type) {
    case 'status_change':
      return { icon: IconSwitch, color: 'primary.main', bgcolor: 'primary.light' };
    case 'deal_won':
      return { icon: IconTrophy, color: 'success.main', bgcolor: 'success.light' };
    case 'deal_lost':
      return { icon: IconX, color: 'error.main', bgcolor: 'error.light' };
    case 'first_quote_sent':
      return { icon: IconFileInvoice, color: 'secondary.main', bgcolor: 'secondary.light' };
    case 'message_sent':
      return { icon: IconMessage, color: 'info.main', bgcolor: 'info.light' };
    case 'agent_handoff':
      return { icon: IconUserCheck, color: 'warning.main', bgcolor: 'warning.light' };
    case 'deal_created':
    case 'lead_created':
      return { icon: IconCirclePlus, color: 'primary.main', bgcolor: 'primary.light' };
    case 'lead_converted':
      return { icon: IconCheck, color: 'success.main', bgcolor: 'success.light' };
    default:
      return { icon: IconAlertCircle, color: 'text.secondary', bgcolor: 'action.hover' };
  }
}

// Generate human-readable title from event type and payload
function getEventTitle(event: JourneyEvent): string {
  const { type, payload } = event;

  switch (type) {
    case 'status_change':
      if (payload?.from && payload?.to) {
        return `Status changed from ${payload.from} to ${payload.to}`;
      }
      return 'Status changed';
    case 'deal_won':
      return 'Deal marked as Won';
    case 'deal_lost':
      return payload?.reason
        ? `Deal marked as Lost: ${payload.reason}`
        : 'Deal marked as Lost';
    case 'first_quote_sent':
      return 'First quote sent to customer';
    case 'message_sent':
      return payload?.subject
        ? `Message sent: ${payload.subject}`
        : 'Message sent';
    case 'agent_handoff':
      return payload?.agent
        ? `Handed off to ${payload.agent}`
        : 'Handed off to another agent';
    case 'deal_created':
      return 'Deal created';
    case 'lead_created':
      return 'Lead created';
    case 'lead_converted':
      return 'Lead converted to deal';
    default:
      return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
}

// Generate optional description from payload
function getEventDescription(event: JourneyEvent): string | null {
  const { payload } = event;

  if (!payload) return null;

  if (payload.description) {
    return String(payload.description);
  }

  if (payload.notes) {
    return String(payload.notes);
  }

  return null;
}

// Format timestamp
function formatTimestamp(date: string): string {
  const eventDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - eventDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Relative time for recent events
  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  // Absolute time for older events
  return eventDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: eventDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export default function ActivityTimeline({
  events,
  loading,
  error,
  onRetry
}: ActivityTimelineProps) {
  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Failed to load activity timeline. Please try again.
        </Typography>
        {onRetry && (
          <Button size="small" variant="outlined" onClick={onRetry}>
            Retry
          </Button>
        )}
      </Alert>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No activity yet. Events will appear here as actions are taken.
        </Typography>
      </Box>
    );
  }

  // Timeline
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {events.map((event) => {
        const { icon: Icon, color, bgcolor } = getEventIcon(event.type);
        const title = getEventTitle(event);
        const description = getEventDescription(event);
        const timestamp = formatTimestamp(event.occurredAt);

        return (
          <ListItem
            key={event.id}
            alignItems="flex-start"
            sx={{
              borderLeft: 2,
              borderColor: 'divider',
              '&:first-of-type': {
                borderTopLeftRadius: 1,
                borderTopRightRadius: 1
              },
              '&:last-of-type': {
                borderBottomLeftRadius: 1,
                borderBottomRightRadius: 1
              }
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor, color }}>
                <Icon size={20} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle2" component="span">
                  {title}
                </Typography>
              }
              secondary={
                <>
                  {description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5, mb: 0.5 }}
                    >
                      {description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {timestamp}
                  </Typography>
                </>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}


