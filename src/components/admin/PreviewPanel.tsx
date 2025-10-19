import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Grid,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import BarChartIcon from '@mui/icons-material/BarChart';
import { VisualizationSettings } from '../../pages/admin/Visualization';

interface PreviewPanelProps {
  settings: VisualizationSettings;
}

export default function PreviewPanel({ settings }: PreviewPanelProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(settings.formats.numberFormat, {
      style: 'currency',
      currency: settings.formats.currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    const format = settings.formats.dateFormat;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'MMM DD, YYYY':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      default: // MM/DD/YYYY
        return `${month}/${day}/${year}`;
    }
  };

  return (
    <Card sx={{ position: 'sticky', top: 16 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Live Preview
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Mini Dashboard Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Dashboard Cards
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Card
                elevation={settings.layout.cardElevation}
                sx={{
                  p: 1,
                  borderRadius: `${settings.theme.borderRadius}px`,
                }}
              >
                <Typography variant="caption">Revenue</Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: settings.theme.primaryColor,
                  }}
                >
                  {formatCurrency(845000)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card
                elevation={settings.layout.cardElevation}
                sx={{
                  p: 1,
                  borderRadius: `${settings.theme.borderRadius}px`,
                }}
              >
                <Typography variant="caption">Deals</Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: settings.theme.secondaryColor,
                  }}
                >
                  23
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Mini Chart Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Chart Sample ({settings.charts.defaultType})
          </Typography>
          <Box
            sx={{
              height: 120,
              bgcolor: 'action.hover',
              borderRadius: `${settings.theme.borderRadius}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChartIcon sx={{ fontSize: 48, color: 'action.disabled' }} />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Color scheme: {settings.charts.colorScheme}
          </Typography>
        </Box>

        {/* Buttons Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Buttons
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: settings.theme.primaryColor,
                borderRadius: `${settings.theme.borderRadius}px`,
                '&:hover': {
                  bgcolor: settings.theme.primaryColor,
                  opacity: 0.9,
                },
              }}
            >
              Primary
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: settings.theme.secondaryColor,
                color: settings.theme.secondaryColor,
                borderRadius: `${settings.theme.borderRadius}px`,
              }}
            >
              Secondary
            </Button>
          </Stack>
        </Box>

        {/* Density Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Density: {settings.layout.density}
          </Typography>
          <List
            dense={settings.layout.density === 'compact'}
            sx={{
              bgcolor: 'action.hover',
              borderRadius: `${settings.theme.borderRadius}px`,
              py: settings.layout.density === 'spacious' ? 2 : settings.layout.density === 'comfortable' ? 1 : 0.5,
            }}
          >
            <ListItem>
              <ListItemText primary="Sample Item 1" secondary="Description" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Sample Item 2" secondary="Description" />
            </ListItem>
          </List>
        </Box>

        {/* Format Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Format Examples
          </Typography>
          <Card variant="outlined" sx={{ p: 1, borderRadius: `${settings.theme.borderRadius}px` }}>
            <Typography variant="caption" display="block">
              Date: {formatDate(new Date())}
            </Typography>
            <Typography variant="caption" display="block">
              Time: {settings.formats.timeFormat === '12h' ? '3:30 PM' : '15:30'}
            </Typography>
            <Typography variant="caption" display="block">
              Currency: {formatCurrency(1234.56)}
            </Typography>
          </Card>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: settings.theme.primaryColor,
              borderRadius: `${settings.theme.borderRadius}px`,
              '&:hover': {
                bgcolor: settings.theme.primaryColor,
                opacity: 0.9,
              },
            }}
          >
            Save Settings
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<PreviewIcon />}
            size="small"
            sx={{
              borderRadius: `${settings.theme.borderRadius}px`,
            }}
          >
            Preview in New Tab
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

