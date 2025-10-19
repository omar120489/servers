import React from 'react';
import { Box, Typography, Stack, LinearProgress, Tooltip, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export interface Score {
  overall: number;
  health: number;
  engagement: number;
  urgency: number;
  conversion: number;
}

interface ScoreBreakdownProps {
  scores: Score;
  compact?: boolean;
}

interface ScoreItemProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  description: string;
  compact?: boolean;
}

function ScoreItem({ label, value, color, icon, description, compact = false }: ScoreItemProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'success.main';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };

  return (
    <Tooltip title={description} arrow placement="top">
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ color, display: 'flex', alignItems: 'center' }}>{icon}</Box>
            <Typography variant={compact ? 'caption' : 'body2'} fontWeight="medium">
              {label}
            </Typography>
          </Stack>
          <Typography variant={compact ? 'caption' : 'body2'} fontWeight="bold" sx={{ color: getScoreColor(value) }}>
            {value}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: compact ? 4 : 6,
            borderRadius: 3,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              bgcolor: getScoreColor(value),
              borderRadius: 3,
            },
          }}
        />
      </Box>
    </Tooltip>
  );
}

export default function ScoreBreakdown({ scores, compact = false }: ScoreBreakdownProps) {
  const scoreItems = [
    {
      label: 'Health',
      value: scores.health,
      color: '#28C76F',
      icon: <FavoriteIcon sx={{ fontSize: compact ? 14 : 18 }} />,
      description: 'Overall health of the lead/deal based on data quality and completeness',
    },
    {
      label: 'Engagement',
      value: scores.engagement,
      color: '#7367F0',
      icon: <TrendingUpIcon sx={{ fontSize: compact ? 14 : 18 }} />,
      description: 'Level of interaction and engagement with your team',
    },
    {
      label: 'Urgency',
      value: scores.urgency,
      color: '#FF9F43',
      icon: <FlashOnIcon sx={{ fontSize: compact ? 14 : 18 }} />,
      description: 'How urgent this opportunity is based on timeline and follow-ups',
    },
    {
      label: 'Conversion',
      value: scores.conversion,
      color: '#00CFE8',
      icon: <MonetizationOnIcon sx={{ fontSize: compact ? 14 : 18 }} />,
      description: 'Likelihood of conversion based on historical patterns',
    },
  ];

  const getOverallColor = (score: number) => {
    if (score >= 75) return 'success.main';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };

  return (
    <Paper variant="outlined" sx={{ p: compact ? 1.5 : 2 }}>
      <Stack spacing={compact ? 1 : 1.5}>
        {/* Overall Score */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant={compact ? 'subtitle2' : 'subtitle1'} fontWeight="bold">
              Overall Score
            </Typography>
            <Typography
              variant={compact ? 'h6' : 'h5'}
              fontWeight="bold"
              sx={{ color: getOverallColor(scores.overall) }}
            >
              {scores.overall}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={scores.overall}
            sx={{
              height: compact ? 6 : 8,
              borderRadius: 4,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                bgcolor: getOverallColor(scores.overall),
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Individual Scores */}
        <Stack spacing={compact ? 1 : 1.5}>
          {scoreItems.map((item) => (
            <ScoreItem key={item.label} {...item} compact={compact} />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

