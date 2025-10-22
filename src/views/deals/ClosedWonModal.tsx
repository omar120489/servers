import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography
} from '@mui/material';

type Props = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (values: { grossRevenue: number; directCost: number }) => void;
};

export default function ClosedWonModal({ open, onClose, onConfirm }: Props) {
  const [grossRevenue, setGrossRevenue] = useState<string>('');
  const [directCost, setDirectCost] = useState<string>('');

  const parsedGross = Number(grossRevenue);
  const parsedCost = Number(directCost);

  const valid = useMemo(() => {
    return Number.isFinite(parsedGross) && parsedGross > 0 && Number.isFinite(parsedCost) && parsedCost > 0;
  }, [parsedGross, parsedCost]);

  const netProfit = useMemo(() => {
    if (!valid) return null;
    return parsedGross - parsedCost;
  }, [valid, parsedGross, parsedCost]);

  const handleConfirm = () => {
    if (!valid) return;
    onConfirm({ grossRevenue: parsedGross, directCost: parsedCost });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Closed Won – Financials Required</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            To mark this deal as <strong>Closed Won</strong>, please enter the financials (used for P&amp;L tracking).
          </Typography>

          <TextField
            label="Gross Revenue"
            type="number"
            required
            slotProps={{ htmlInput: { min: 0.01, step: '0.01' } }}
            value={grossRevenue}
            onChange={(e) => setGrossRevenue(e.target.value)}
            helperText="Required and must be greater than 0"
            error={!!grossRevenue && parsedGross <= 0}
            size="small"
          />

          <TextField
            label="Direct Cost"
            type="number"
            required
            slotProps={{ htmlInput: { min: 0.01, step: '0.01' } }}
            value={directCost}
            onChange={(e) => setDirectCost(e.target.value)}
            helperText="Required and must be greater than 0"
            error={!!directCost && parsedCost <= 0}
            size="small"
          />

          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="subtitle2">Net Profit:</Typography>
            <Typography variant="h6">
              {netProfit === null ? '—' : netProfit.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!valid}>
          Confirm &amp; Mark Won
        </Button>
      </DialogActions>
    </Dialog>
  );
}

