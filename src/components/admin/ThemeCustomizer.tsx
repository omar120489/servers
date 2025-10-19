import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  TextField,
  Chip,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  mode: 'light' | 'dark';
  borderRadius: number;
}

interface ThemeCustomizerProps {
  theme: ThemeSettings;
  onChange: (theme: ThemeSettings) => void;
}

const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#7367F0',
  secondaryColor: '#28C76F',
  mode: 'light',
  borderRadius: 8,
};

export default function ThemeCustomizer({ theme, onChange }: ThemeCustomizerProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Theme Settings
        </Typography>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Primary Color
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="input"
                type="color"
                value={theme.primaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...theme, primaryColor: e.target.value })}
                aria-label="Primary color picker"
                sx={{ width: 50, height: 40, cursor: 'pointer', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              />
              <TextField
                size="small"
                value={theme.primaryColor}
                onChange={(e) => onChange({ ...theme, primaryColor: e.target.value })}
                sx={{ width: 120 }}
              />
              <Chip
                label="Berry Purple"
                size="small"
                onClick={() => onChange({ ...theme, primaryColor: '#7367F0' })}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Secondary Color
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="input"
                type="color"
                value={theme.secondaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...theme, secondaryColor: e.target.value })}
                aria-label="Secondary color picker"
                sx={{ width: 50, height: 40, cursor: 'pointer', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              />
              <TextField
                size="small"
                value={theme.secondaryColor}
                onChange={(e) => onChange({ ...theme, secondaryColor: e.target.value })}
                sx={{ width: 120 }}
              />
              <Chip
                label="Berry Green"
                size="small"
                onClick={() => onChange({ ...theme, secondaryColor: '#28C76F' })}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Mode
            </Typography>
            <ToggleButtonGroup
              value={theme.mode}
              exclusive
              onChange={(_, value) => value && onChange({ ...theme, mode: value })}
              size="small"
              fullWidth
            >
              <ToggleButton value="light">
                <LightModeIcon sx={{ mr: 1 }} />
                Light
              </ToggleButton>
              <ToggleButton value="dark">
                <DarkModeIcon sx={{ mr: 1 }} />
                Dark
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Border Radius: {theme.borderRadius}px
            </Typography>
            <Slider
              value={theme.borderRadius}
              onChange={(_, value) => onChange({ ...theme, borderRadius: value as number })}
              min={0}
              max={24}
              step={2}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={() => onChange(DEFAULT_THEME)}
            size="small"
          >
            Reset Theme
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

