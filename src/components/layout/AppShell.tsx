import React, { useEffect } from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import GlobalSearch from '../search/GlobalSearch';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const toggle = () => setOpen((o) => !o);

  // Global keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar onMenu={toggle} onSearch={() => setSearchOpen(true)} />
      <Sidebar open={open} onClose={toggle} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children ?? <Outlet />}
        </Container>
      </Box>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
}
