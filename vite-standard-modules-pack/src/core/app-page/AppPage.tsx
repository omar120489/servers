import * as React from 'react';
import { Box, Typography, Divider, Alert, Button, Stack, Skeleton, Paper } from '@mui/material';
type AppPageProps = {
  title: React.ReactNode; subtitle?: React.ReactNode; actions?: React.ReactNode; toolbar?: React.ReactNode;
  loading?: boolean; error?: React.ReactNode | boolean; empty?: boolean;
  emptySlot?: React.ReactNode; loadingSlot?: React.ReactNode; errorSlot?: React.ReactNode;
  footer?: React.ReactNode; onRetry?: () => void; children?: React.ReactNode;
};
export default function AppPage(props: AppPageProps){
  const { title, subtitle, actions, toolbar, loading, error, empty, emptySlot, loadingSlot, errorSlot, footer, onRetry, children } = props;
  const isError = Boolean(error); const isLoading = Boolean(loading); const isEmpty = Boolean(empty) && !isLoading && !isError;
  return (
    <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 }, overflowX: 'hidden' }}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
          <Box sx={{ flex: '1 1 auto', minWidth: 200 }}>
            <Typography variant="h4">{title}</Typography>
            {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
          </Box>
          {actions && <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>{actions}</Stack>}
        </Box>
        <Divider sx={{ my: 1.5 }} />
        {toolbar && <Box sx={{ mb: 2 }}>{toolbar}</Box>}
        <Box sx={{ minHeight: 120 }}>
          {isLoading ? (loadingSlot ?? (<Stack spacing={1}><Skeleton variant="rounded" height={36} /><Skeleton variant="rounded" height={240} /></Stack>))
          : isError ? (errorSlot ?? (<Alert severity="error" action={onRetry && <Button onClick={onRetry}>Retry</Button>}>{typeof error==='boolean'?'Something went wrong.':error}</Alert>))
          : isEmpty ? (emptySlot ?? (<Alert severity="info">No data to display.</Alert>))
          : (<Box sx={{ '& *': { minWidth: 0 } }}>{children}</Box>)}
        </Box>
        {footer && <Divider sx={{ my: 1.5 }} />}
        {footer}
      </Paper>
    </Box>
  );
}
