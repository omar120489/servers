import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import NoteIcon from '@mui/icons-material/Note';
import TaskIcon from '@mui/icons-material/Task';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import { Activity } from '../timeline/TimelineItem';
import { canLogActivity, MOCK_USER } from '../../utils/rbac';

interface LogActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  prefilledData?: {
    contact?: string;
    company?: string;
  };
  userRole?: 'SDR' | 'AE' | 'Manager' | 'Marketing' | 'Support' | 'Admin';
}

type ActivityType = 'email' | 'call' | 'meeting' | 'note' | 'task';

export default function LogActivityDialog({ open, onClose, onSave, prefilledData, userRole = MOCK_USER.role }: LogActivityDialogProps) {
  const [activeTab, setActiveTab] = useState<ActivityType>('note');
  
  // RBAC: Check if user can log activities
  const canLog = canLogActivity(userRole);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    duration: '',
    status: 'completed' as 'completed' | 'pending' | 'cancelled',
    priority: 'medium' as 'high' | 'medium' | 'low',
    user: 'Current User', // In real app, get from auth context
  });

  const handleSave = () => {
    const activity: Omit<Activity, 'id' | 'timestamp'> = {
      type: activeTab,
      description: formData.description,
      user: formData.user,
      metadata: {
        subject: formData.subject || undefined,
        duration: formData.duration || undefined,
        status: formData.status,
        priority: formData.priority,
      },
    };

    onSave(activity);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      subject: '',
      description: '',
      duration: '',
      status: 'completed',
      priority: 'medium',
      user: 'Current User',
    });
    setActiveTab('note');
    onClose();
  };

  const tabs = [
    { value: 'email' as ActivityType, label: 'Email', icon: <EmailIcon /> },
    { value: 'call' as ActivityType, label: 'Call', icon: <PhoneIcon /> },
    { value: 'meeting' as ActivityType, label: 'Meeting', icon: <EventIcon /> },
    { value: 'note' as ActivityType, label: 'Note', icon: <NoteIcon /> },
    { value: 'task' as ActivityType, label: 'Task', icon: <TaskIcon /> },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Log Activity</DialogTitle>
      <DialogContent>
        {/* RBAC: Show permission denied if user cannot log activities */}
        {!canLog ? (
          <Alert severity="error" icon={<LockIcon />} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
              Access Denied
            </Typography>
            <Typography variant="body2">
              You do not have permission to log activities. Contact your administrator to request access.
            </Typography>
          </Alert>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} variant="fullWidth">
                {tabs.map((tab) => (
                  <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} iconPosition="start" />
                ))}
              </Tabs>
            </Box>

            <Stack spacing={2.5}>
          {/* Prefilled context */}
          {(prefilledData?.contact || prefilledData?.company) && (
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                Related to:
              </Typography>
              {prefilledData.contact && (
                <Typography variant="body2" fontWeight="bold">
                  Contact: {prefilledData.contact}
                </Typography>
              )}
              {prefilledData.company && (
                <Typography variant="body2" fontWeight="bold">
                  Company: {prefilledData.company}
                </Typography>
              )}
            </Box>
          )}

          {/* Subject field (for email, meeting, task) */}
          {(activeTab === 'email' || activeTab === 'meeting' || activeTab === 'task') && (
            <TextField
              label={activeTab === 'email' ? 'Email Subject' : activeTab === 'meeting' ? 'Meeting Title' : 'Task Title'}
              fullWidth
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          )}

          {/* Description/Notes */}
          <TextField
            label={
              activeTab === 'email'
                ? 'Email Body'
                : activeTab === 'call'
                ? 'Call Notes'
                : activeTab === 'meeting'
                ? 'Meeting Notes'
                : activeTab === 'note'
                ? 'Note'
                : 'Task Description'
            }
            fullWidth
            multiline
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          {/* Duration (for call, meeting) */}
          {(activeTab === 'call' || activeTab === 'meeting') && (
            <TextField
              label="Duration"
              fullWidth
              placeholder="e.g., 30 mins, 1 hour"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            {/* Priority */}
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof formData.priority })}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!canLog || !formData.description || ((activeTab === 'email' || activeTab === 'meeting' || activeTab === 'task') && !formData.subject)}
        >
          Log Activity
        </Button>
      </DialogActions>
    </Dialog>
  );
}

