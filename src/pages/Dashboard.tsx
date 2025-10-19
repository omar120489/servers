import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

export default function Dashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$845K', change: '+12.5%', icon: <AttachMoneyIcon />, color: 'success.main' },
    { label: 'Active Deals', value: '23', change: '+8.2%', icon: <TrendingUpIcon />, color: 'primary.main' },
    { label: 'Contacts', value: '156', change: '+15.3%', icon: <PeopleIcon />, color: 'info.main' },
    { label: 'Companies', value: '42', change: '+5.1%', icon: <BusinessIcon />, color: 'warning.main' },
  ];

  const recentDeals = [
    { name: 'Enterprise Software', company: 'Acme Corp', value: 50000, stage: 'Prospecting', progress: 20 },
    { name: 'Cloud Migration', company: 'TechStart Inc', value: 75000, stage: 'Qualification', progress: 40 },
    { name: 'Custom Development', company: 'Innovate LLC', value: 100000, stage: 'Proposal', progress: 60 },
    { name: 'API Integration', company: 'DataFlow Inc', value: 45000, stage: 'Negotiation', progress: 80 },
  ];

  const pipelineData = [
    { id: 0, value: 125000, label: 'Prospecting' },
    { id: 1, value: 125000, label: 'Qualification' },
    { id: 2, value: 50000, label: 'Proposal' },
    { id: 3, value: 125000, label: 'Negotiation' },
    { id: 4, value: 90000, label: 'Closed Won' },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 65000 },
    { month: 'Feb', revenue: 72000 },
    { month: 'Mar', revenue: 68000 },
    { month: 'Apr', revenue: 85000 },
    { month: 'May', revenue: 92000 },
    { month: 'Jun', revenue: 105000 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.change}
                      size="small"
                      color="success"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Revenue trend over the last 6 months
              </Typography>
              <Box sx={{ width: '100%', height: 300 }} data-fetchpriority="high">
                <BarChart
                  xAxis={[{ scaleType: 'band', data: monthlyRevenue.map(d => d.month) }]}
                  series={[{ data: monthlyRevenue.map(d => d.revenue), label: 'Revenue', color: '#7367F0' }]}
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pipeline Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Pipeline Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Deals by stage
              </Typography>
              <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                <PieChart
                  series={[
                    {
                      data: pipelineData,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                  ]}
                  height={300}
                  slotProps={{
                    legend: { hidden: true },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Deals */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Recent Deals
              </Typography>
              <Stack spacing={2}>
                {recentDeals.map((deal, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Box flex={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {deal.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {deal.company}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip label={deal.stage} size="small" color="primary" variant="outlined" />
                        <Typography variant="subtitle2" fontWeight="bold" color="primary">
                          {formatCurrency(deal.value)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={deal.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    {index < recentDeals.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
