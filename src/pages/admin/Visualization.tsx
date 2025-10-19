import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Stack, Button, Snackbar, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
// cspell:ignore Customizer
import ThemeCustomizer from '../../components/admin/ThemeCustomizer';
import LayoutDensityControl from '../../components/admin/LayoutDensityControl';
import ChartPreferences from '../../components/admin/ChartPreferences';
import FormatSettings from '../../components/admin/FormatSettings';
import PreviewPanel from '../../components/admin/PreviewPanel';

export interface VisualizationSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    mode: 'light' | 'dark';
    borderRadius: number;
  };
  layout: {
    density: 'compact' | 'comfortable' | 'spacious';
    sidebarWidth: number;
    cardElevation: number;
  };
  charts: {
    defaultType: string;
    colorScheme: string;
    showGridLines: boolean;
    showLegend: boolean;
  };
  formats: {
    dateFormat: string;
    timeFormat: string;
    currency: string;
    numberFormat: string;
    timezone: string;
  };
}

const DEFAULT_SETTINGS: VisualizationSettings = {
  theme: {
    primaryColor: '#7367F0',
    secondaryColor: '#28C76F',
    mode: 'light',
    borderRadius: 8,
  },
  layout: {
    density: 'comfortable',
    sidebarWidth: 260,
    cardElevation: 1,
  },
  charts: {
    defaultType: 'bar',
    colorScheme: 'default',
    showGridLines: true,
    showLegend: true,
  },
  formats: {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    numberFormat: 'en-US',
    timezone: 'America/New_York',
  },
};

export default function Visualization() {
  const [settings, setSettings] = useState<VisualizationSettings>(() => {
    const saved = localStorage.getItem('visualization-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSave = () => {
    try {
      localStorage.setItem('visualization-settings', JSON.stringify(settings));
      setSnackbar({ open: true, message: 'Settings saved successfully! Refresh the page to see changes.', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('visualization-settings');
    setSnackbar({ open: true, message: 'Settings reset to defaults', severity: 'info' });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Visualization & Appearance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customize the look and feel of your CRM interface
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            Save Settings
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <ThemeCustomizer
              theme={settings.theme}
              onChange={(theme) => setSettings({ ...settings, theme })}
            />
            <LayoutDensityControl
              density={settings.layout}
              onChange={(layout) => setSettings({ ...settings, layout })}
            />
            <ChartPreferences
              charts={settings.charts}
              onChange={(charts) => setSettings({ ...settings, charts })}
            />
            <FormatSettings
              formats={settings.formats}
              onChange={(formats) => setSettings({ ...settings, formats })}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <PreviewPanel settings={settings} />
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

