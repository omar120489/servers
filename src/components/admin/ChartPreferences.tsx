import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';

interface ChartSettings {
  defaultType: string;
  colorScheme: string;
  showGridLines: boolean;
  showLegend: boolean;
}

interface ChartPreferencesProps {
  charts: ChartSettings;
  onChange: (charts: ChartSettings) => void;
}

const COLOR_SCHEMES = [
  { id: 'default', name: 'Default', colors: ['#7367F0', '#28C76F', '#FF9F43', '#EA5455', '#00CFE8'] },
  { id: 'vibrant', name: 'Vibrant', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'] },
  { id: 'pastel', name: 'Pastel', colors: ['#FFB6C1', '#B0E0E6', '#DDA0DD', '#F0E68C', '#98FB98'] },
  { id: 'monochrome', name: 'Monochrome', colors: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'] },
];

export default function ChartPreferences({ charts, onChange }: ChartPreferencesProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chart Preferences
        </Typography>
        <Stack spacing={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel>Default Chart Type</InputLabel>
            <Select
              value={charts.defaultType}
              label="Default Chart Type"
              onChange={(e) => onChange({ ...charts, defaultType: e.target.value })}
            >
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="pie">Pie Chart</MenuItem>
              <MenuItem value="area">Area Chart</MenuItem>
              <MenuItem value="scatter">Scatter Plot</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Color Scheme
            </Typography>
            <Grid container spacing={1}>
              {COLOR_SCHEMES.map((scheme) => (
                <Grid item xs={6} key={scheme.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      cursor: 'pointer',
                      border: charts.colorScheme === scheme.id ? 2 : 1,
                      borderColor: charts.colorScheme === scheme.id ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: 'primary.light',
                      },
                    }}
                    onClick={() => onChange({ ...charts, colorScheme: scheme.id })}
                  >
                    <Typography variant="caption" fontWeight="bold" gutterBottom display="block">
                      {scheme.name}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      {scheme.colors.map((color) => (
                        <Box
                          key={color}
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: color,
                            borderRadius: 0.5,
                          }}
                        />
                      ))}
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={charts.showGridLines}
                onChange={(e) => onChange({ ...charts, showGridLines: e.target.checked })}
              />
            }
            label="Show Grid Lines"
          />

          <FormControlLabel
            control={
              <Switch
                checked={charts.showLegend}
                onChange={(e) => onChange({ ...charts, showLegend: e.target.checked })}
              />
            }
            label="Show Legend"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

