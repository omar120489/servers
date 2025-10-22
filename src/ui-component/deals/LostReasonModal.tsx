import { useState, useMemo, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent
} from '@mui/material';

// Loss Reason Taxonomy
const LOSS_REASONS = [
  { value: 'L-Price/Budget', label: 'Price/Budget' },
  { value: 'L-Timing/Postponed', label: 'Timing/Postponed' },
  { value: 'L-Qualification/Not a fit', label: 'Qualification/Not a fit' },
  { value: 'L-Competitor', label: 'Competitor' },
  { value: 'L-No response', label: 'No response' },
  { value: 'L-Other', label: 'Other' }
] as const;

export interface LostReasonData {
  lossReason: string;
  lossNotes?: string;
}

interface LostReasonModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (data: LostReasonData) => void;
}

export default function LostReasonModal({ open, onClose, onConfirm }: LostReasonModalProps) {
  const [lossReason, setLossReason] = useState('');
  const [lossNotes, setLossNotes] = useState('');

  const valid = useMemo(() => Boolean(lossReason), [lossReason]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setLossReason('');
      setLossNotes('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (!valid) return;
    onConfirm({
      lossReason,
      lossNotes: lossNotes.trim() || undefined
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mark Deal as Lost</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Please select a reason for marking this deal as lost. This helps track why deals are not closing.
          </Typography>

          <FormControl fullWidth required>
            <InputLabel id="loss-reason-label">Loss Reason</InputLabel>
            <Select
              labelId="loss-reason-label"
              id="loss-reason"
              value={lossReason}
              onChange={(e: SelectChangeEvent) => setLossReason(e.target.value)}
              label="Loss Reason"
            >
              {LOSS_REASONS.map((reason) => (
                <MenuItem key={reason.value} value={reason.value}>
                  {reason.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Notes (Optional)"
            placeholder="Add any additional context about why this deal was lost..."
            value={lossNotes}
            onChange={(e) => setLossNotes(e.target.value)}
            helperText="Optional: Provide more details about the loss reason"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!valid}>
          Confirm & Mark Lost
        </Button>
      </DialogActions>
    </Dialog>
  );
}

