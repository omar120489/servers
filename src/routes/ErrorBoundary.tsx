import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

interface DebugInfoProps {
  error: unknown;
}

const STATUS_MESSAGES: Record<number, string> = {
  401: "Error 401 - You aren't authorized to see this",
  404: "Error 404 - This page doesn't exist!",
  418: 'Error 418 - Contact administrator',
  503: 'Error 503 - Looks like our API is down'
};

function DebugInfo({ error }: DebugInfoProps) {
  if (!import.meta.env.DEV) {
    return null;
  }

  let payload = 'Unknown error';

  try {
    payload =
      typeof error === 'string'
        ? error
        : JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2);
  } catch {
    payload = String(error);
  }

  return (
    <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography
        component="pre"
        sx={{ m: 0, fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}
      >
        {payload}
      </Typography>
    </Box>
  );
}

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const message = STATUS_MESSAGES[error.status] ?? 'An unexpected routing error occurred.';

    return (
      <Alert severity="error">
        {message}
        <DebugInfo error={error} />
      </Alert>
    );
  }

  if (error instanceof Error) {
    return (
      <Alert severity="error">
        {error.message || 'An unexpected application error occurred.'}
        <DebugInfo error={error} />
      </Alert>
    );
  }

  return (
    <Alert severity="error">
      Under Maintenance
      <DebugInfo error={error} />
    </Alert>
  );
}
