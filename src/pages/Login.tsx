import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Stack } from '@mui/material';
import { useAuth } from '../auth/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const loc = useLocation() as any;

  const handleLogin = async () => {
    try {
      await login(email, password);
      nav(loc?.state?.from?.pathname || '/', { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <Box sx={{ p: 3, display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Sign in</Typography>
          <TextField
            label="Email"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <Typography color="error" sx={{ mb: 1 }}>{err}</Typography>}
          <Button fullWidth variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
