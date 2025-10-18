import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Tooltip, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsBell from '../notifications/NotificationsBell';
import { useColorModeTheme } from '../../theme/ColorModeProvider';

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const { mode, toggleColorMode } = useColorModeTheme();
  return (
    <AppBar position="fixed" color="inherit" sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton onClick={onMenu} edge="start" sx={{ mr: 2 }}><MenuIcon /></IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>Traffic CRM</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <NotificationsBell />
          <Tooltip title="Toggle light/dark">
            <IconButton onClick={toggleColorMode}>
              {mode === 'light' ? <Brightness4Icon/> : <Brightness7Icon/>}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
