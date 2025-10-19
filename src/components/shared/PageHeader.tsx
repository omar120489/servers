/**
 * PageHeader Component
 * 
 * A reusable page header with title, description, and action buttons.
 * Extracted from common pattern used across 10+ pages.
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="Leads"
 *   description="Manage and qualify your sales leads"
 *   actions={
 *     <>
 *       <Button startIcon={<SortIcon />}>Sort</Button>
 *       <Button startIcon={<AddIcon />}>Add Lead</Button>
 *     </>
 *   }
 * />
 * ```
 */

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

export interface PageHeaderProps {
  /** Page title (h1) */
  title: string;
  /** Optional page description */
  description?: string;
  /** Action buttons or other elements to display on the right */
  actions?: React.ReactNode;
  /** Additional spacing below the header */
  mb?: number;
}

/**
 * PageHeader component for consistent page headers across the application.
 * 
 * Features:
 * - Semantic HTML (h1 for title)
 * - Flexible action area
 * - Responsive layout
 * - Accessible with proper heading hierarchy
 */
export default function PageHeader({
  title,
  description,
  actions,
  mb = 3,
}: PageHeaderProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={mb}
      flexWrap="wrap"
      gap={2}
    >
      <Box>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {actions && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {actions}
        </Stack>
      )}
    </Stack>
  );
}

