import React from 'react';
import { Grid, Typography } from '@mui/material';
import BerryCard from '../components/common/BerryCard';

export default function Dashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h4">Dashboard</Typography></Grid>
      <Grid item xs={12} md={6}><BerryCard title="Pipeline" subheader="Overview">Coming soon</BerryCard></Grid>
      <Grid item xs={12} md={6}><BerryCard title="Activities" subheader="Recent">Coming soon</BerryCard></Grid>
    </Grid>
  );
}
