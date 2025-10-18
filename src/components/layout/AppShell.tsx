import React from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((o) => !o);
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar onMenu={toggle} />
      <Sidebar open={open} onClose={toggle} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children ?? <Outlet />}
        </Container>
      </Box>
    </Box>
  );
}
