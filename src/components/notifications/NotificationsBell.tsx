import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Badge,
  IconButton,
  Drawer,
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { listNotifications, markAllRead, markNotificationRead, Notification } from '../../services/notifications';

dayjs.extend(relativeTime);

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);

  const load = async () => {
    try {
      const data = await listNotifications();
      setItems(data);
    } catch {
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unread = items.filter(x => !x.is_read).length;

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <Badge color="error" badgeContent={unread}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 420, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6">Notifications</Typography>
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              disabled={!unread}
              onClick={async () => {
                await markAllRead();
                load();
              }}
            >
              Mark all read
            </Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            {items.map((n) => (
              <Card
                key={n.id}
                variant={n.is_read ? 'outlined' : undefined}
                sx={{
                  cursor: 'pointer',
                  bgcolor: n.is_read ? 'background.paper' : 'action.hover',
                }}
                onClick={async () => {
                  await markNotificationRead(n.id);
                  load();
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: n.is_read ? 500 : 700 }}>
                    {n.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {n.message}
                  </Typography>
                  {n.created_at && (
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(n.created_at).fromNow()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
            {!items.length && (
              <Typography color="text.secondary">You're all caught up 🎉</Typography>
            )}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

