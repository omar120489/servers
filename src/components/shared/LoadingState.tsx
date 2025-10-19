/**
 * LoadingState Component
 * 
 * A reusable loading indicator with consistent styling.
 * Extracted from common pattern used across 11+ pages.
 * 
 * @example
 * ```tsx
 * <LoadingState message="Loading leads..." />
 * ```
 */

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingStateProps {
  /** Optional loading message to display */
  message?: string;
  /** Minimum height of the loading container */
  minHeight?: string;
  /** Size of the circular progress indicator */
  size?: number;
}

/**
 * LoadingState component for consistent loading UI across the application.
 * 
 * Features:
 * - Centered circular progress indicator
 * - Optional loading message
 * - Customizable height
 * - Accessible with proper ARIA attributes
 */
export default function LoadingState({
  message,
  minHeight = '60vh',
  size = 40,
}: LoadingStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={minHeight}
      gap={2}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

