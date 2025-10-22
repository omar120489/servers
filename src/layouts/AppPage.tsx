import { ReactNode } from 'react';
import {
  Alert, Box, Breadcrumbs, Button, Skeleton, Stack, Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

const BERRY_MAX_WIDTH = 1200;      // matches Berry preview feel (≈ 1200–1240px)
const GUTTER_X = { xs: 2, sm: 3, lg: 4 }; // left/right padding
const SECTION_GAP = 2;             // vertical rhythm (16px)

type AppPageProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  toolbar?: ReactNode;
  loading?: boolean;
  error?: string | Error | null;
  empty?: boolean;
  emptySlot?: ReactNode;
  loadingSlot?: ReactNode;
  errorSlot?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  padding?: number;
  gap?: number;
  ariaLabel?: string;
  onRetry?: () => void;
};

export default function AppPage({
  title,
  subtitle,
  breadcrumbs,
  actions,
  toolbar,
  loading,
  error,
  empty,
  emptySlot,
  loadingSlot,
  errorSlot,
  children,
  footer,
  padding = 3,
  gap = SECTION_GAP,
  ariaLabel,
  onRetry
}: AppPageProps) {
  const hasError = !!error;
  const isEmpty = !!empty && !loading && !hasError;
  const errorText =
    typeof error === 'string' ? error : error instanceof Error ? error.message : 'Something went wrong.';

  return (
    <Box
      id="page-frame"
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        // hard lock to Berry preview frame
        px: GUTTER_X,
        overflowX: 'hidden',           // stop horizontal scroll/bleed
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: BERRY_MAX_WIDTH,
        }}
      >
        <MainCard title={undefined} content={false}>
          <Box
            aria-label={ariaLabel ?? title}
            sx={{
              p: padding,
              display: 'flex',
              flexDirection: 'column',
              gap,
              position: 'relative',
              // containment so children can't escape the card
              overflow: 'hidden',
              // make nested flex boxes truncate instead of overflow
              '& *': { minWidth: 0 },
              // media should never overflow the frame
              '& img, & video, & canvas': { maxWidth: '100%', height: 'auto' }
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
                {breadcrumbs && <Breadcrumbs sx={{ mb: 0.25 }} separator="›">{breadcrumbs}</Breadcrumbs>}
                <Typography variant="h4" noWrap>{title}</Typography>
                {subtitle && <Typography variant="body2" color="text.secondary" noWrap>{subtitle}</Typography>}
              </Box>
              {actions && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>{actions}</Box>}
            </Box>

            {/* Toolbar */}
            {toolbar && <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{toolbar}</Box>}

            {/* Content switcher */}
            {loading ? (
              loadingSlot ?? (
                <Stack data-testid="page-skeletons" spacing={1}>
                  {[...Array(6)].map((_, i) => <Skeleton key={i} height={28} variant="rounded" />)}
                </Stack>
              )
            ) : hasError ? (
              errorSlot ?? (
                <Alert
                  severity="error"
                  action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Retry</Button> : undefined}
                >
                  {errorText}
                </Alert>
              )
            ) : isEmpty ? (
              emptySlot ?? (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography variant="h4" color="text.secondary" sx={{ mt: 2 }}>Nothing here yet</Typography>
                  <Typography variant="body2" color="text.secondary">Try adjusting filters or come back later.</Typography>
                </Box>
              )
            ) : (
              <Box>{children}</Box>
            )}

            {/* Footer */}
            {footer && <Box sx={{ display: 'flex', justifyContent: 'center' }}>{footer}</Box>}
          </Box>
        </MainCard>
      </Box>
    </Box>
  );
}

