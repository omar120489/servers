import React, { useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper, Stack, Button, Chip } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { useNavigate } from 'react-router-dom';

// Simple mock analytics for the pipeline view (demo mode)
const STAGES = [
  { id: 'prospecting', label: 'Prospecting' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Closed Won' },
  { id: 'closed_lost', label: 'Closed Lost' },
];

const mockStageStats = [
  { stage: 'Prospecting', count: 8, value: 120000 },
  { stage: 'Qualification', count: 5, value: 95000 },
  { stage: 'Proposal', count: 4, value: 136000 },
  { stage: 'Negotiation', count: 3, value: 110000 },
  { stage: 'Closed Won', count: 2, value: 90000 },
  { stage: 'Closed Lost', count: 1, value: 30000 },
];

const mockVelocityDays = [
  { stage: 'Prospecting', days: 6 },
  { stage: 'Qualification', days: 7 },
  { stage: 'Proposal', days: 9 },
  { stage: 'Negotiation', days: 6 },
  { stage: 'Closed Won', days: 3 },
  { stage: 'Closed Lost', days: 2 },
];

export default function Pipeline() {
  const navigate = useNavigate();

  const totals = useMemo(() => {
    const dealCount = mockStageStats.reduce((a, b) => a + b.count, 0);
    const dealValue = mockStageStats.reduce((a, b) => a + b.value, 0);
    const avgVelocity = Math.round(
      mockVelocityDays.reduce((a, b) => a + b.days, 0) / mockVelocityDays.length
    );
    // Naive win rate: won / (won + lost)
    const won = mockStageStats.find((s) => s.stage === 'Closed Won')?.count ?? 0;
    const lost = mockStageStats.find((s) => s.stage === 'Closed Lost')?.count ?? 0;
    const winRate = (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : 0;
    return { dealCount, dealValue, avgVelocity, winRate };
  }, []);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" component="h1">
            Pipeline Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of pipeline health, velocity, and distribution by stage
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate('/deals')}>
            Back to Deals
          </Button>
          <Chip label={`${totals.dealCount} deals`} color="primary" variant="outlined" />
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Total Value
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              ${totals.dealValue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Avg Stage Velocity
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="info.main">
              {totals.avgVelocity} days
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Win Rate
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {totals.winRate}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Open Stages
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {STAGES.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Deals by Stage (Count)
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: mockStageStats.map((s) => s.stage) }]}
                series={[{ data: mockStageStats.map((s) => s.count), label: 'Deals', color: '#7367F0' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Pipeline Value by Stage
              </Typography>
              <LineChart
                xAxis={[{ scaleType: 'point', data: mockStageStats.map((s) => s.stage) }]}
                series={[{ data: mockStageStats.map((s) => s.value), label: 'Value', color: '#28C76F' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Stage Velocity (days)
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: mockVelocityDays.map((s) => s.stage) }]}
                series={[{ data: mockVelocityDays.map((s) => s.days), label: 'Days', color: '#FF9F43' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Distribution by Outcome
              </Typography>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: mockStageStats.find((s) => s.stage === 'Closed Won')?.count ?? 0, label: 'Won' },
                      { id: 1, value: mockStageStats.find((s) => s.stage === 'Closed Lost')?.count ?? 0, label: 'Lost' },
                      {
                        id: 2,
                        value: mockStageStats
                          .filter((s) => !s.stage.startsWith('Closed'))
                          .reduce((a, b) => a + b.count, 0),
                        label: 'Open',
                      },
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  },
                ]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

