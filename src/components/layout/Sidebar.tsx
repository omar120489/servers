import React from 'react';
import { Drawer, Toolbar, Box, Typography } from '@mui/material';
import SidebarNav from './SidebarNav';

export default function Sidebar({ open, onClose, width = 280 }: Readonly<{ open: boolean; onClose: () => void; width?: number; }>) {
  return (
    <Drawer variant="temporary" open={open} onClose={onClose} ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width } }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Traffic CRM
          </Typography>
        </Box>
      </Toolbar>
      <SidebarNav />
    </Drawer>
  );
}
