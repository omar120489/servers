import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { getOverview, dealsByStage, revenueByMonth, activitiesByType } from '../services/reports';

export default function Reports() {
  const [ov, setOv] = useState<any>({});
  const [st, setSt] = useState<any[]>([]);
  const [rev, setRev] = useState<any[]>([]);
  const [acts, setActs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setOv(await getOverview());
        setSt(await dealsByStage());
        setRev(await revenueByMonth());
        setActs(await activitiesByType());
      } catch {
      }
    })();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Reports</Typography>

      <Grid container spacing={2}>
        {['contacts', 'companies', 'deals', 'revenue'].map(k => (
          <Grid item xs={12} sm={6} md={3} key={k}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {k.toUpperCase()}
                </Typography>
                <Typography variant="h4">
                  {k === 'revenue' ? `$${(ov[k] || 0).toLocaleString()}` : (ov[k] || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Deals by Stage</Typography>
              {st.length > 0 && (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: st.map(x => x.stage) }]}
                  series={[{ data: st.map(x => x.count) }]}
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Revenue by Month</Typography>
              {rev.length > 0 && (
                <LineChart
                  xAxis={[{ data: rev.map((x, i) => i), scaleType: 'point' }]}
                  series={[{ data: rev.map(x => x.revenue), label: 'Revenue' }]}
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Activities by Type</Typography>
              {acts.length > 0 && (
                <PieChart
                  series={[{
                    data: acts.map((x: any, i: number) => ({
                      id: i,
                      value: x.count,
                      label: x.type
                    }))
                  }]}
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
