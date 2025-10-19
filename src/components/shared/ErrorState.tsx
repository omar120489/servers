/**
 * ErrorState Component
 * 
 * A reusable error display with consistent styling.
 * Extracted from common pattern used across 8+ pages.
 * 
 * @example
 * ```tsx
 * <ErrorState
 *   message="Failed to load leads. Showing cached data."
 *   severity="warning"
 *   onRetry={refetch}
 * />
 * ```
 */

import React from 'react';
import { Box, Alert, Button, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export interface ErrorStateProps {
  /** Error message to display */
  message?: string;
  /** Severity level of the error */
  severity?: 'error' | 'warning' | 'info';
  /** Optional retry callback */
  onRetry?: () => void;
  /** Label for the retry button */
  retryLabel?: string;
}

/**
 * ErrorState component for consistent error UI across the application.
 * 
 * Features:
 * - Material-UI Alert component
 * - Customizable severity
 * - Optional retry button
 * - Accessible with proper ARIA attributes
 */
export default function ErrorState({
  message = 'An error occurred. Please try again.',
  severity = 'error',
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) {
  return (
    <Box sx={{ mb: 2 }} role="alert">
      <Alert
        severity={severity}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              {retryLabel}
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Box>
  );
}

