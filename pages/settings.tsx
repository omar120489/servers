import Head from 'next/head';
import { Container, Box, Typography, Grid, Card, CardContent, Button, Stack } from '@mui/material';

export default function SettingsPage() {
  return (
    <>
      <Head><title>Settings — Traffic CRM</title></Head>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4">Settings</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained">Primary</Button>
            <Button variant="outlined">Secondary</Button>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Personal and workspace settings.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="subtitle1">Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Replace with real content.
              </Typography>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="subtitle1">Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Replace with real content.
              </Typography>
            </CardContent></Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
