import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import NoteIcon from '@mui/icons-material/Note';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';

interface Activity {
  id: number;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  contact: string;
  company: string;
  timestamp: string;
  status?: 'completed' | 'pending';
}

const mockActivities: Activity[] = [
  {
    id: 1,
    type: 'email',
    title: 'Sent proposal to John Smith',
    description: 'Sent detailed proposal for Enterprise Software License including pricing and timeline.',
    contact: 'John Smith',
    company: 'Acme Corp',
    timestamp: '2 hours ago',
    status: 'completed',
  },
  {
    id: 2,
    type: 'call',
    title: 'Follow-up call with Sarah Johnson',
    description: 'Discussed cloud migration requirements and technical specifications.',
    contact: 'Sarah Johnson',
    company: 'TechStart Inc',
    timestamp: '4 hours ago',
    status: 'completed',
  },
  {
    id: 3,
    type: 'meeting',
    title: 'Demo scheduled with Mike Chen',
    description: 'Product demonstration scheduled for next week.',
    contact: 'Mike Chen',
    company: 'Global Systems',
    timestamp: '1 day ago',
    status: 'pending',
  },
  {
    id: 4,
    type: 'note',
    title: 'Added notes from Emily Davis meeting',
    description: 'Key requirements: custom integrations, dedicated support, and training for 20 users.',
    contact: 'Emily Davis',
    company: 'Innovate LLC',
    timestamp: '1 day ago',
    status: 'completed',
  },
  {
    id: 5,
    type: 'task',
    title: 'Prepare contract for David Wilson',
    description: 'Draft consulting services agreement with revised terms.',
    contact: 'David Wilson',
    company: 'StartupXYZ',
    timestamp: '2 days ago',
    status: 'pending',
  },
  {
    id: 6,
    type: 'email',
    title: 'Sent training materials to Lisa Anderson',
    description: 'Shared onboarding documentation and video tutorials.',
    contact: 'Lisa Anderson',
    company: 'EduTech',
    timestamp: '2 days ago',
    status: 'completed',
  },
  {
    id: 7,
    type: 'call',
    title: 'Discovery call with Robert Taylor',
    description: 'Initial conversation about API integration needs and timeline.',
    contact: 'Robert Taylor',
    company: 'DataFlow Inc',
    timestamp: '3 days ago',
    status: 'completed',
  },
  {
    id: 8,
    type: 'meeting',
    title: 'Kickoff meeting with Jennifer Lee',
    description: 'Project kickoff for mobile app development. Discussed design requirements.',
    contact: 'Jennifer Lee',
    company: 'AppMakers',
    timestamp: '3 days ago',
    status: 'completed',
  },
];

export default function Activities() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'call': return <PhoneIcon />;
      case 'meeting': return <EventIcon />;
      case 'note': return <NoteIcon />;
      case 'task': return <CheckCircleIcon />;
      default: return <NoteIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'email': return 'primary';
      case 'call': return 'success';
      case 'meeting': return 'info';
      case 'note': return 'warning';
      case 'task': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Activities</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Log Activity
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          {mockActivities.map((activity, index) => (
            <Box key={activity.id}>
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: `${getActivityColor(activity.type)}.main`,
                    width: 48,
                    height: 48,
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Avatar>
                
                <Box flex={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {activity.title}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                        <Chip
                          label={activity.type}
                          size="small"
                          color={getActivityColor(activity.type) as any}
                          sx={{ textTransform: 'capitalize' }}
                        />
                        {activity.status && (
                          <Chip
                            label={activity.status}
                            size="small"
                            variant="outlined"
                            color={activity.status === 'completed' ? 'success' : 'default'}
                          />
                        )}
                      </Stack>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {activity.timestamp}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {activity.description}
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption" color="text.secondary">
                      👤 {activity.contact}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      🏢 {activity.company}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {index < mockActivities.length - 1 && <Divider sx={{ mt: 3 }} />}
            </Box>
          ))}
        </Stack>
      </Paper>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary" align="center">
          Showing {mockActivities.length} recent activities
        </Typography>
      </Box>
    </Box>
  );
}
