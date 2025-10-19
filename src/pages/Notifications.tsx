import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';
import CommentIcon from '@mui/icons-material/Comment';
import SettingsIcon from '@mui/icons-material/Settings';

interface Notification {
  id: number;
  type: 'deal' | 'contact' | 'company' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'deal',
    title: 'Deal Won!',
    message: 'SaaS Subscription deal with CloudFirst has been marked as won. Value: $60,000',
    timestamp: '5 minutes ago',
    read: false,
    actionUrl: '/deals',
  },
  {
    id: 2,
    type: 'mention',
    title: 'You were mentioned',
    message: 'Sarah Johnson mentioned you in a comment on "Cloud Migration Project"',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/deals',
  },
  {
    id: 3,
    type: 'contact',
    title: 'New Contact Added',
    message: 'Mike Chen added a new contact: Robert Taylor from DataFlow Inc',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/contacts',
  },
  {
    id: 4,
    type: 'deal',
    title: 'Deal Stage Changed',
    message: 'Enterprise Software License moved to Negotiation stage',
    timestamp: '3 hours ago',
    read: true,
    actionUrl: '/deals',
  },
  {
    id: 5,
    type: 'company',
    title: 'Company Updated',
    message: 'Acme Corp information has been updated by John Smith',
    timestamp: '5 hours ago',
    read: true,
    actionUrl: '/companies',
  },
  {
    id: 6,
    type: 'system',
    title: 'Weekly Report Ready',
    message: 'Your weekly sales report is now available for download',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/reports',
  },
  {
    id: 7,
    type: 'deal',
    title: 'Deal Approaching Deadline',
    message: 'Proposal for Global Systems is due in 2 days',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/deals',
  },
  {
    id: 8,
    type: 'mention',
    title: 'Comment Reply',
    message: 'Emily Davis replied to your comment on "Custom Development" deal',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/deals',
  },
  {
    id: 9,
    type: 'contact',
    title: 'Contact Activity',
    message: 'John Smith from Acme Corp opened your email',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/contacts',
  },
  {
    id: 10,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance completed successfully',
    timestamp: '3 days ago',
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deal': return <AttachMoneyIcon />;
      case 'contact': return <PersonAddIcon />;
      case 'company': return <BusinessIcon />;
      case 'mention': return <CommentIcon />;
      case 'system': return <SettingsIcon />;
      default: return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'deal': return 'success.main';
      case 'contact': return 'info.main';
      case 'company': return 'warning.main';
      case 'mention': return 'secondary.main';
      case 'system': return 'grey.600';
      default: return 'primary.main';
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setAnchorEl(null);
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, notification: Notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            Stay updated with your CRM activities
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<MarkEmailReadIcon />}
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </Stack>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={filter}
          onChange={(e, newValue) => setFilter(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={`All (${notifications.length})`} 
            value="all" 
          />
          <Tab 
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <span>Unread</span>
                {unreadCount > 0 && (
                  <Chip 
                    label={unreadCount} 
                    size="small" 
                    color="primary" 
                    sx={{ height: 20, minWidth: 20 }}
                  />
                )}
              </Stack>
            } 
            value="unread" 
          />
        </Tabs>
      </Paper>

      {filteredNotifications.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {filter === 'unread' ? 'unread' : ''} notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You're all caught up!
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' },
                    cursor: notification.actionUrl ? 'pointer' : 'default',
                    py: 2,
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleMenuClick(e, notification)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: getNotificationColor(notification.type),
                        width: 48,
                        height: 48,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        )}
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.timestamp}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem onClick={() => selectedNotification && handleMarkAsRead(selectedNotification.id)}>
            <MarkEmailReadIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as Read
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => selectedNotification && handleDelete(selectedNotification.id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary" align="center">
          Showing {filteredNotifications.length} notifications
        </Typography>
      </Box>
    </Box>
  );
}

