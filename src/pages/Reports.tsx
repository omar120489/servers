import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, Alert } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { getOverview, dealsByStage, revenueByMonth, activitiesByType } from '../services/reports';

// Mock data for demo mode
const mockOverview = {
  contacts: 156,
  companies: 42,
  deals: 23,
  revenue: 845000,
};

const mockDealsByStage = [
  { stage: 'Prospecting', count: 8 },
  { stage: 'Qualification', count: 5 },
  { stage: 'Proposal', count: 4 },
  { stage: 'Negotiation', count: 3 },
  { stage: 'Closed Won', count: 2 },
  { stage: 'Closed Lost', count: 1 },
];

const mockRevenueByMonth = [
  { month: 'Jan', revenue: 65000 },
  { month: 'Feb', revenue: 72000 },
  { month: 'Mar', revenue: 68000 },
  { month: 'Apr', revenue: 85000 },
  { month: 'May', revenue: 92000 },
  { month: 'Jun', revenue: 105000 },
];

const mockActivitiesByType = [
  { type: 'Calls', count: 45 },
  { type: 'Emails', count: 78 },
  { type: 'Meetings', count: 32 },
  { type: 'Tasks', count: 56 },
];

export default function Reports() {
  const [ov, setOv] = useState<any>({});
  const [st, setSt] = useState<any[]>([]);
  const [rev, setRev] = useState<any[]>([]);
  const [acts, setActs] = useState<any[]>([]);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const overview = await getOverview();
        const stages = await dealsByStage();
        const revenue = await revenueByMonth();
        const activities = await activitiesByType();
        
        setOv(overview);
        setSt(stages);
        setRev(revenue);
        setActs(activities);
      } catch {
        // Use mock data if API fails
        setOv(mockOverview);
        setSt(mockDealsByStage);
        setRev(mockRevenueByMonth);
        setActs(mockActivitiesByType);
        setUsingMockData(true);
      }
    })();
  }, []);

  // Use mock data if no data loaded
  const displayOv = Object.keys(ov).length > 0 ? ov : mockOverview;
  const displaySt = st.length > 0 ? st : mockDealsByStage;
  const displayRev = rev.length > 0 ? rev : mockRevenueByMonth;
  const displayActs = acts.length > 0 ? acts : mockActivitiesByType;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Reports & Analytics
      </Typography>

      {usingMockData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Using demo data (API unavailable)
        </Alert>
      )}

      <Grid container spacing={2}>
        {['contacts', 'companies', 'deals', 'revenue'].map(k => (
          <Grid item xs={12} sm={6} md={3} key={k}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" fontWeight="bold">
                  {k.toUpperCase()}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {k === 'revenue' ? `$${(displayOv[k] || 0).toLocaleString()}` : (displayOv[k] || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Deals by Stage
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Distribution of deals across pipeline stages
              </Typography>
              {displaySt.length > 0 && (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: displaySt.map(x => x.stage) }]}
                  series={[{ 
                    data: displaySt.map(x => x.count),
                    label: 'Deals',
                    color: '#7367F0'
                  }]}
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Revenue by Month
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monthly revenue trend for the last 6 months
              </Typography>
              {displayRev.length > 0 && (
                <LineChart
                  xAxis={[{ 
                    scaleType: 'point',
                    data: displayRev.map(x => x.month)
                  }]}
                  series={[{ 
                    data: displayRev.map(x => x.revenue), 
                    label: 'Revenue',
                    color: '#28C76F'
                  }]}
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Activities by Type
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Breakdown of activities by type
              </Typography>
              {displayActs.length > 0 && (
                <PieChart
                  series={[{
                    data: displayActs.map((x: any, i: number) => ({
                      id: i,
                      value: x.count,
                      label: x.type
                    })),
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  }]}
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Key Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Win Rate
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      67%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Avg Deal Size
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      $36,739
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sales Cycle
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="info.main">
                      28 days
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Conversion Rate
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      24%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
