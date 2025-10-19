import React from 'react';
import { Chip } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface PriorityBadgeProps {
  score: number;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

export default function PriorityBadge({ score, size = 'small', variant = 'filled' }: PriorityBadgeProps) {
  const getPriority = (score: number) => {
    if (score >= 75) {
      return {
        label: 'High Priority',
        color: 'error' as const,
        icon: <PriorityHighIcon />,
      };
    }
    if (score >= 50) {
      return {
        label: 'Medium Priority',
        color: 'warning' as const,
        icon: <RemoveIcon />,
      };
    }
    return {
      label: 'Low Priority',
      color: 'default' as const,
      icon: <ArrowDownwardIcon />,
    };
  };

  const priority = getPriority(score);

  return (
    <Chip
      label={priority.label}
      color={priority.color}
      size={size}
      variant={variant}
      icon={priority.icon}
      sx={{
        fontWeight: 'bold',
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
      }}
    />
  );
}

