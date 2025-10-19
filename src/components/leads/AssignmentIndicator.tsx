/**
 * Assignment Indicator Component
 * 
 * Shows lead assignment status and owner
 */

import React from 'react';
import { Chip, Tooltip, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface AssignmentIndicatorProps {
  ownerId?: string | number;
  assignedBy?: 'manual' | 'auto';
  assignedAt?: string;
  showDetails?: boolean;
}

// Mock owner names (in production, fetch from user service)
const OWNER_NAMES: Record<string, string> = {
  'ae-julia': 'Julia (AE)',
  'user-emea-1': 'Tom (SDR EMEA)',
  'user-emea-2': 'Sarah (SDR EMEA)',
  'user-amer-1': 'Mike (SDR Americas)',
  'user-amer-2': 'Lisa (SDR Americas)',
  'user-apac-1': 'Yuki (SDR APAC)',
  'queue-inbox': 'Unassigned Queue',
};

export default function AssignmentIndicator({
  ownerId,
  assignedBy = 'auto',
  assignedAt,
  showDetails = false,
}: AssignmentIndicatorProps) {
  if (!ownerId) {
    return (
      <Tooltip title="Lead not yet assigned">
        <Chip
          icon={<PendingIcon />}
          label="Unassigned"
          size="small"
          color="warning"
          variant="outlined"
        />
      </Tooltip>
    );
  }

  const ownerName = OWNER_NAMES[ownerId as string] || `User ${ownerId}`;
  const isQueue = ownerId === 'queue-inbox';

  const tooltipContent = (
    <Box>
      <Typography variant="caption" display="block">
        <strong>Owner:</strong> {ownerName}
      </Typography>
      <Typography variant="caption" display="block">
        <strong>Assigned by:</strong> {assignedBy === 'auto' ? 'Auto-routing' : 'Manual'}
      </Typography>
      {assignedAt && (
        <Typography variant="caption" display="block">
          <strong>Assigned at:</strong> {new Date(assignedAt).toLocaleString()}
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent}>
      <Chip
        icon={isQueue ? <PendingIcon /> : assignedBy === 'auto' ? <AutoModeIcon /> : <PersonIcon />}
        label={showDetails ? ownerName : 'Assigned'}
        size="small"
        color={isQueue ? 'warning' : 'success'}
        variant={isQueue ? 'outlined' : 'filled'}
      />
    </Tooltip>
  );
}

