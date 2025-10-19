import React, { useState } from 'react';
import { Box, Typography, Stack, ToggleButtonGroup, ToggleButton, Chip, Alert } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import TimelineItem, { Activity } from './TimelineItem';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import NoteIcon from '@mui/icons-material/Note';
import TaskIcon from '@mui/icons-material/Task';
import { canViewTimeline, MOCK_USER } from '../../utils/rbac';

interface ActivityTimelineProps {
  activities: Activity[];
  userRole?: 'SDR' | 'AE' | 'Manager' | 'Marketing' | 'Support' | 'Admin';
}

export default function ActivityTimeline({ activities, userRole = MOCK_USER.role }: ActivityTimelineProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['email', 'call', 'meeting', 'note', 'task']);

  // RBAC: Check if user can view timeline
  if (!canViewTimeline(userRole)) {
    return (
      <Alert severity="error" icon={<LockIcon />}>
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
          Access Denied
        </Typography>
        <Typography variant="body2">
          You do not have permission to view activity timeline. Contact your administrator to request access.
        </Typography>
      </Alert>
    );
  }

  // Group activities by date
  const groupByDate = (activities: Activity[]) => {
    const grouped: Record<string, Activity[]> = {};
    
    activities.forEach((activity) => {
      const date = new Date(activity.timestamp);
      const dateKey = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    // Sort activities within each date group by timestamp (newest first)
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });

    return grouped;
  };

  // Filter activities by selected types
  const filteredActivities = activities.filter((activity) => selectedTypes.includes(activity.type));

  // Sort all activities by timestamp (newest first)
  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const groupedActivities = groupByDate(sortedActivities);

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      // Don't allow deselecting if it's the last one
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const activityTypes = [
    { id: 'email', label: 'Email', icon: EmailIcon, color: '#7367F0' },
    { id: 'call', label: 'Call', icon: PhoneIcon, color: '#28C76F' },
    { id: 'meeting', label: 'Meeting', icon: EventIcon, color: '#FF9F43' },
    { id: 'note', label: 'Note', icon: NoteIcon, color: '#00CFE8' },
    { id: 'task', label: 'Task', icon: TaskIcon, color: '#EA5455' },
  ];

  const activityCounts = {
    email: activities.filter((a) => a.type === 'email').length,
    call: activities.filter((a) => a.type === 'call').length,
    meeting: activities.filter((a) => a.type === 'meeting').length,
    note: activities.filter((a) => a.type === 'note').length,
    task: activities.filter((a) => a.type === 'task').length,
  };

  return (
    <Box>
      {/* Filter chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        {activityTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedTypes.includes(type.id);
          const count = activityCounts[type.id as keyof typeof activityCounts];

          return (
            <Chip
              key={type.id}
              icon={<Icon sx={{ fontSize: 16 }} />}
              label={`${type.label} (${count})`}
              onClick={() => handleTypeToggle(type.id)}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                bgcolor: isSelected ? type.color : 'transparent',
                color: isSelected ? 'white' : type.color,
                borderColor: type.color,
                fontWeight: isSelected ? 'bold' : 'normal',
                '&:hover': {
                  bgcolor: isSelected ? type.color : `${type.color}15`,
                },
              }}
            />
          );
        })}
      </Stack>

      {/* Timeline */}
      {Object.keys(groupedActivities).length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No activities found
          </Typography>
        </Box>
      ) : (
        Object.entries(groupedActivities).map(([date, items]) => (
          <Box key={date} sx={{ mb: 3 }}>
            {/* Date separator */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                {date}
              </Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
            </Stack>

            {/* Activities for this date */}
            {items.map((activity) => (
              <TimelineItem key={activity.id} activity={activity} />
            ))}
          </Box>
        ))
      )}
    </Box>
  );
}

