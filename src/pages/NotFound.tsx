import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 120, color: 'error.main', opacity: 0.5 }} />
        <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary">
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
            size="large"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
            size="large"
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

