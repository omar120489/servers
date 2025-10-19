import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered: string;
  successRate: number;
  createdAt: string;
}

const mockWebhooks: Webhook[] = [
  {
    id: 1,
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX',
    events: ['deal.created', 'deal.won', 'contact.created'],
    status: 'active',
    lastTriggered: '2 hours ago',
    successRate: 98.5,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Zapier Integration',
    url: 'https://hooks.zapier.com/hooks/catch/12345/abcdef/',
    events: ['contact.created', 'company.created', 'deal.updated'],
    status: 'active',
    lastTriggered: '1 day ago',
    successRate: 100,
    createdAt: '2024-02-20',
  },
  {
    id: 3,
    name: 'Custom Analytics',
    url: 'https://api.example.com/webhooks/crm-events',
    events: ['deal.created', 'deal.updated', 'deal.won', 'deal.lost'],
    status: 'error',
    lastTriggered: '3 days ago',
    successRate: 45.2,
    createdAt: '2024-03-10',
  },
  {
    id: 4,
    name: 'Email Service',
    url: 'https://api.sendgrid.com/v3/webhooks/crm',
    events: ['contact.created'],
    status: 'inactive',
    lastTriggered: 'Never',
    successRate: 0,
    createdAt: '2024-10-15',
  },
];

const availableEvents = [
  'contact.created',
  'contact.updated',
  'contact.deleted',
  'company.created',
  'company.updated',
  'company.deleted',
  'deal.created',
  'deal.updated',
  'deal.won',
  'deal.lost',
  'deal.deleted',
  'activity.created',
];

export default function Webhooks() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon fontSize="small" />;
      case 'error': return <ErrorIcon fontSize="small" />;
      default: return undefined;
    }
  };

  const handleEditWebhook = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setSelectedEvents(webhook.events);
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setSelectedWebhook(null);
    setSelectedEvents([]);
    setOpenDialog(true);
  };

  const handleEventToggle = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Webhooks</Typography>
          <Typography variant="body2" color="text.secondary">
            Configure outbound webhooks to integrate with external services
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateNew}>
          Add Webhook
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Events</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Success Rate</TableCell>
              <TableCell>Last Triggered</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockWebhooks.map((webhook) => (
              <TableRow key={webhook.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {webhook.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {webhook.url}
                    </Typography>
                    <IconButton size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    {webhook.events.slice(0, 2).map((event, index) => (
                      <Chip key={index} label={event} size="small" variant="outlined" />
                    ))}
                    {webhook.events.length > 2 && (
                      <Chip label={`+${webhook.events.length - 2}`} size="small" />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={webhook.status}
                    color={getStatusColor(webhook.status)}
                    size="small"
                    icon={getStatusIcon(webhook.status)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color={webhook.successRate > 90 ? 'success.main' : webhook.successRate > 50 ? 'warning.main' : 'error.main'}>
                    {webhook.successRate}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {webhook.lastTriggered}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" onClick={() => handleEditWebhook(webhook)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          {mockWebhooks.length} webhooks configured
        </Typography>
      </Box>

      {/* Create/Edit Webhook Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedWebhook ? `Edit Webhook: ${selectedWebhook.name}` : 'Create New Webhook'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Webhook Name"
              fullWidth
              defaultValue={selectedWebhook?.name || ''}
              placeholder="e.g., Slack Notifications"
            />
            <TextField
              label="Webhook URL"
              fullWidth
              defaultValue={selectedWebhook?.url || ''}
              placeholder="https://example.com/webhook"
            />
            
            <FormControl fullWidth>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Status
                </Typography>
                <FormControlLabel
                  control={<Switch defaultChecked={selectedWebhook?.status === 'active'} />}
                  label="Active"
                />
              </Stack>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Events to Subscribe
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                <FormGroup>
                  {availableEvents.map((event) => (
                    <FormControlLabel
                      key={event}
                      control={
                        <Checkbox
                          checked={selectedEvents.includes(event)}
                          onChange={() => handleEventToggle(event)}
                        />
                      }
                      label={event}
                    />
                  ))}
                </FormGroup>
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {selectedEvents.length} events selected
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="outlined" sx={{ mr: 'auto' }}>
            Test Webhook
          </Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            {selectedWebhook ? 'Save Changes' : 'Create Webhook'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

