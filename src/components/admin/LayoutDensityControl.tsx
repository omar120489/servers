import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
} from '@mui/material';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

interface LayoutSettings {
  density: 'compact' | 'comfortable' | 'spacious';
  sidebarWidth: number;
  cardElevation: number;
}

interface LayoutDensityControlProps {
  density: LayoutSettings;
  onChange: (density: LayoutSettings) => void;
}

export default function LayoutDensityControl({ density, onChange }: LayoutDensityControlProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Layout & Density
        </Typography>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Density Preset
            </Typography>
            <ToggleButtonGroup
              value={density.density}
              exclusive
              onChange={(_, value) => value && onChange({ ...density, density: value })}
              fullWidth
              size="small"
            >
              <ToggleButton value="compact">
                <ViewCompactIcon sx={{ mr: 1 }} />
                Compact
              </ToggleButton>
              <ToggleButton value="comfortable">
                <ViewComfyIcon sx={{ mr: 1 }} />
                Comfortable
              </ToggleButton>
              <ToggleButton value="spacious">
                <ViewModuleIcon sx={{ mr: 1 }} />
                Spacious
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {density.density === 'compact' && 'Maximizes screen space, smaller padding'}
              {density.density === 'comfortable' && 'Balanced spacing (recommended)'}
              {density.density === 'spacious' && 'Generous spacing, easier to scan'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sidebar Width: {density.sidebarWidth}px
            </Typography>
            <Slider
              value={density.sidebarWidth}
              onChange={(_, value) => onChange({ ...density, sidebarWidth: value as number })}
              min={200}
              max={320}
              step={20}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Card Elevation
            </Typography>
            <Stack direction="row" spacing={1}>
              {[0, 1, 2, 3, 4].map((elevation) => (
                <Card
                  key={elevation}
                  elevation={elevation}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: density.cardElevation === elevation ? 2 : 0,
                    borderColor: 'primary.main',
                    flex: 1,
                    textAlign: 'center',
                    '&:hover': {
                      borderColor: 'primary.light',
                      borderWidth: 1,
                    },
                  }}
                  onClick={() => onChange({ ...density, cardElevation: elevation })}
                >
                  <Typography variant="caption">{elevation}</Typography>
                </Card>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

