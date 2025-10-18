import { useMemo, useState } from 'react';
import { Alert, Stack, TextField, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function IcsHint() {
  // CRA: use REACT_APP_ prefix; fallback to current origin
  const url = useMemo(() => {
    const base =
      (process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? window.location.origin : ''))
        .replace(/\/$/, '');
    return base ? `${base}/calendar/feed.ics` : '';
  }, []);

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const copy = async () => {
    setCopyError(null);
    try {
      if (!url) throw new Error('No calendar URL configured');
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e: any) {
      setCopyError(e?.message || 'Unable to copy');
    }
  };

  return (
    <Alert severity={copyError ? 'warning' : 'info'} sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          value={url || '— configure REACT_APP_API_URL or use current origin —'}
          size="small"
          fullWidth
          InputProps={{ readOnly: true }}
          onFocus={(e) => e.target.select()}
        />
        <Tooltip title={copied ? 'Copied!' : 'Copy ICS URL'}>
          <span>
            <IconButton
              onClick={copy}
              aria-label="Copy ICS URL"
              disabled={!url}
            >
              <ContentCopyIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      {copyError && (
        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
          {copyError}
        </Typography>
      )}
    </Alert>
  );
}
