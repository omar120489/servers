import React from 'react';
import { Box, Typography, Stack, Avatar, Chip, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import NoteIcon from '@mui/icons-material/Note';
import TaskIcon from '@mui/icons-material/Task';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  description: string;
  timestamp: string;
  user: string;
  metadata?: {
    subject?: string;
    duration?: string;
    status?: 'completed' | 'pending' | 'cancelled';
    priority?: 'high' | 'medium' | 'low';
  };
}

interface TimelineItemProps {
  activity: Activity;
}

const ACTIVITY_CONFIG = {
  email: {
    icon: EmailIcon,
    color: '#7367F0',
    bgColor: '#F3F2FF',
    label: 'Email',
  },
  call: {
    icon: PhoneIcon,
    color: '#28C76F',
    bgColor: '#E8FAF0',
    label: 'Call',
  },
  meeting: {
    icon: EventIcon,
    color: '#FF9F43',
    bgColor: '#FFF4E5',
    label: 'Meeting',
  },
  note: {
    icon: NoteIcon,
    color: '#00CFE8',
    bgColor: '#E0F7FA',
    label: 'Note',
  },
  task: {
    icon: TaskIcon,
    color: '#EA5455',
    bgColor: '#FFE5E6',
    label: 'Task',
  },
};

export default function TimelineItem({ activity }: TimelineItemProps) {
  const config = ACTIVITY_CONFIG[activity.type];
  const Icon = config.icon;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, position: 'relative', pb: 3 }}>
      {/* Timeline line */}
      <Box
        sx={{
          position: 'absolute',
          left: 20,
          top: 40,
          bottom: 0,
          width: 2,
          bgcolor: 'divider',
        }}
      />

      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: config.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <Icon sx={{ fontSize: 20, color: config.color }} />
      </Box>

      {/* Content */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          p: 2,
          '&:hover': {
            boxShadow: 2,
            borderColor: config.color,
          },
          transition: 'all 0.2s',
        }}
      >
        <Stack spacing={1}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
            <Stack direction="row" spacing={1} alignItems="center">
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
              {activity.metadata?.status && (
                <Chip
                  label={activity.metadata.status}
                  size="small"
                  variant="outlined"
                  icon={activity.metadata.status === 'completed' ? <CheckCircleIcon /> : undefined}
                  color={
                    activity.metadata.status === 'completed'
                      ? 'success'
                      : activity.metadata.status === 'cancelled'
                      ? 'error'
                      : 'default'
                  }
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
              {activity.metadata?.priority && activity.metadata.priority === 'high' && (
                <Chip
                  label="High Priority"
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {formatTime(activity.timestamp)}
            </Typography>
          </Stack>

          {/* Subject/Title */}
          {activity.metadata?.subject && (
            <Typography variant="subtitle2" fontWeight="bold">
              {activity.metadata.subject}
            </Typography>
          )}

          {/* Description */}
          <Typography variant="body2" color="text.secondary">
            {activity.description}
          </Typography>

          {/* Footer */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {activity.user.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {activity.user}
              </Typography>
            </Stack>
            {activity.metadata?.duration && (
              <Typography variant="caption" color="text.secondary">
                Duration: {activity.metadata.duration}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

