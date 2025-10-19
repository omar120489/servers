/**
 * Email Composer Component
 * 
 * Compose and send emails via Microsoft Graph API
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TemplateIcon from '@mui/icons-material/Description';
import { sendEmail, linkEmailToRecord, EMAIL_TEMPLATES, type GraphEmailMessage } from '../../utils/emailGraph';

interface EmailComposerProps {
  open: boolean;
  onClose: () => void;
  to?: string;
  subject?: string;
  recordType?: 'lead' | 'contact' | 'deal';
  recordId?: string;
  onSent?: (messageId: string) => void;
}

export default function EmailComposer({
  open,
  onClose,
  to = '',
  subject = '',
  recordType,
  recordId,
  onSent,
}: EmailComposerProps) {
  const [formData, setFormData] = useState({
    to,
    subject,
    body: '',
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    if (!sending) {
      setFormData({ to: '', subject: '', body: '' });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const handleSend = async () => {
    if (!formData.to || !formData.subject || !formData.body) {
      setError('Please fill in all required fields');
      return;
    }

    setSending(true);
    setError(null);

    try {
      // In production: get access token from auth context
      // const accessToken = await getAccessToken();
      
      // For now, show what would be sent
      // noop

      const message: GraphEmailMessage = {
        subject: formData.subject,
        body: {
          contentType: 'HTML',
          content: formData.body.replace(/\n/g, '<br>'),
        },
        toRecipients: [
          {
            emailAddress: {
              address: formData.to,
            },
          },
        ],
      };

      // Mock send (in production: await sendEmail(accessToken, message))
      await new Promise(resolve => setTimeout(resolve, 1000));
      const messageId = `msg-${Date.now()}`;

      // Link email to record
      if (recordType && recordId) {
        await linkEmailToRecord(messageId, recordType, recordId);
      }

      setSuccess(true);
      
      if (onSent) {
        onSent(messageId);
      }

      // Close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('[Email] Failed to send:', err);
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = (templateKey: keyof typeof EMAIL_TEMPLATES) => {
    const template = EMAIL_TEMPLATES[templateKey];
    const name = formData.to.split('@')[0] || 'there';
    
    setFormData({
      ...formData,
      subject: template.subject,
      body: template.body(name, 3).content.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Compose Email
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={sending}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Templates */}
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Quick templates:
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<TemplateIcon />}
                label="Demo Follow-up"
                size="small"
                onClick={() => applyTemplate('DEMO_FOLLOWUP')}
                disabled={sending}
              />
              <Chip
                icon={<TemplateIcon />}
                label="Trial Reminder"
                size="small"
                onClick={() => applyTemplate('TRIAL_REMINDER')}
                disabled={sending}
              />
            </Stack>
          </Box>

          {/* To */}
          <TextField
            label="To"
            type="email"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            disabled={sending}
            required
            fullWidth
          />

          {/* Subject */}
          <TextField
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            disabled={sending}
            required
            fullWidth
          />

          {/* Body */}
          <TextField
            label="Message"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            disabled={sending}
            required
            multiline
            rows={10}
            fullWidth
          />

          {/* Record Link Info */}
          {recordType && recordId && (
            <Alert severity="info" variant="outlined">
              This email will be linked to {recordType} #{recordId}
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Success */}
          {success && (
            <Alert severity="success">
              Email sent successfully! Closing...
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Tooltip title="Attachments coming soon">
          <span>
            <IconButton disabled>
              <AttachFileIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Box flex={1} />
        <Button onClick={handleClose} disabled={sending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={sending ? <CircularProgress size={16} /> : <SendIcon />}
          onClick={handleSend}
          disabled={sending || !formData.to || !formData.subject || !formData.body}
        >
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

