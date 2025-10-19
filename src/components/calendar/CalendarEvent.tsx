import React from 'react';
import { Box, Typography, Chip, Stack, Tooltip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PhoneIcon from '@mui/icons-material/Phone';
import TaskIcon from '@mui/icons-material/Task';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface CalendarEvent {
  id: number;
  title: string;
  type: 'meeting' | 'call' | 'task' | 'deadline';
  date: Date;
  time: string;
  duration: string;
  contact?: string;
  company?: string;
  description?: string;
}

interface CalendarEventProps {
  event: CalendarEvent;
  onClick?: () => void;
  compact?: boolean;
}

const EVENT_TYPE_CONFIG = {
  meeting: {
    icon: EventIcon,
    color: '#7367F0',
    bgColor: '#F3F2FF',
    label: 'Meeting',
  },
  call: {
    icon: PhoneIcon,
    color: '#28C76F',
    bgColor: '#E8FAF0',
    label: 'Call',
  },
  task: {
    icon: TaskIcon,
    color: '#FF9F43',
    bgColor: '#FFF4E5',
    label: 'Task',
  },
  deadline: {
    icon: AccessTimeIcon,
    color: '#EA5455',
    bgColor: '#FFE5E6',
    label: 'Deadline',
  },
};

export default function CalendarEvent({ event, onClick, compact = false }: CalendarEventProps) {
  const config = EVENT_TYPE_CONFIG[event.type];
  const Icon = config.icon;

  return (
    <Tooltip title={event.description || event.title} arrow placement="top">
      <Box
        onClick={onClick}
        sx={{
          p: compact ? 1 : 1.5,
          borderRadius: 1,
          bgcolor: config.bgColor,
          borderLeft: `4px solid ${config.color}`,
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': onClick
            ? {
                boxShadow: 2,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
              }
            : {},
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Icon sx={{ fontSize: compact ? 16 : 20, color: config.color }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant={compact ? 'caption' : 'body2'}
              fontWeight="bold"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {event.title}
            </Typography>
            {!compact && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {event.time}
                </Typography>
                {event.duration !== '-' && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.duration}
                    </Typography>
                  </>
                )}
              </Stack>
            )}
            {!compact && (event.company || event.contact) && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {event.company && event.contact
                  ? `${event.contact} @ ${event.company}`
                  : event.company || event.contact}
              </Typography>
            )}
          </Box>
          {!compact && (
            <Chip
              label={config.label}
              size="small"
              sx={{
                bgcolor: config.color,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                height: 20,
              }}
            />
          )}
        </Stack>
      </Box>
    </Tooltip>
  );
}

