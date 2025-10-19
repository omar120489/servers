import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  Box,
  LinearProgress,
  Checkbox,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  company?: string;
  contact?: string;
  owner?: string;
  probability?: number;
  expectedCloseDate?: string;
  tags?: string[];
  notes?: string;
}

interface DealCardProps {
  deal: Deal;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, deal: Deal) => void;
  formatCurrency: (value: number) => string;
}

const getHealthIndicator = (probability?: number) => {
  if (!probability) return null;
  if (probability >= 70) return <CheckCircleIcon fontSize="small" color="success" />;
  if (probability >= 40) return <TrendingUpIcon fontSize="small" color="warning" />;
  return <WarningIcon fontSize="small" color="error" />;
};

export default function DealCard({ deal, isSelected, onSelect, onMenuClick, formatCurrency }: DealCardProps) {
  return (
    <Card
      sx={{
        mb: 0.75,
        cursor: 'grab',
        '&:hover': { boxShadow: 2 },
        bgcolor: isSelected ? 'action.selected' : 'background.paper',
      }}
    >
      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
          <Stack direction="row" spacing={0.5} alignItems="center" flex={1}>
            <Checkbox
              size="small"
              checked={isSelected}
              onChange={() => onSelect(deal.id)}
              onClick={(e) => e.stopPropagation()}
              sx={{ p: 0 }}
            />
            <Typography variant="body2" fontWeight="bold" sx={{ flex: 1, fontSize: '0.875rem' }}>
              {deal.title}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.25} alignItems="center">
            {getHealthIndicator(deal.probability)}
            <IconButton
              size="small"
              sx={{ p: 0.25 }}
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick(e, deal);
              }}
            >
              <MoreVertIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Stack>

        <Typography variant="h6" color="primary" sx={{ fontSize: '1rem', mb: 0.5 }}>
          {formatCurrency(deal.value)}
        </Typography>

        {deal.probability && (
          <Box sx={{ mb: 0.75 }}>
            <Stack direction="row" justifyContent="space-between" mb={0.25}>
              <Typography variant="caption" color="textSecondary" fontSize="0.7rem">Probability</Typography>
              <Typography variant="caption" fontWeight="bold" fontSize="0.7rem">{deal.probability}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={deal.probability}
              sx={{ height: 3, borderRadius: 1 }}
              color={deal.probability >= 70 ? 'success' : deal.probability >= 40 ? 'warning' : 'error'}
            />
          </Box>
        )}

        {deal.company && (
          <Typography variant="caption" display="block" color="text.secondary" fontSize="0.7rem">
            🏢 {deal.company}
          </Typography>
        )}
        {deal.owner && (
          <Typography variant="caption" display="block" color="text.secondary" fontSize="0.7rem">
            👨‍💼 {deal.owner}
          </Typography>
        )}
        {deal.expectedCloseDate && (
          <Typography variant="caption" display="block" color="text.secondary" fontSize="0.7rem">
            📅 {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Typography>
        )}

        {deal.tags && deal.tags.length > 0 && (
          <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap" gap={0.5}>
            {deal.tags.slice(0, 2).map(tag => (
              <Chip key={tag} label={tag} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
            ))}
            {deal.tags.length > 2 && (
              <Chip label={`+${deal.tags.length - 2}`} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

