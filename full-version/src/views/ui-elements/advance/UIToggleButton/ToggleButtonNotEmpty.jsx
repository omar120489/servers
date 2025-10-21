import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// assets
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeftTwoTone';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenterTwoTone';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRightTwoTone';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustifyTwoTone';
import LaptopIcon from '@mui/icons-material/LaptopTwoTone';
import TvIcon from '@mui/icons-material/TvTwoTone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroidTwoTone';

// ============================|| UI TOGGLE BUTTON - NO EMPTY ||============================ //

export default function ToggleButtonNotEmpty() {
  const theme = useTheme();

  const [formats, setFormats] = React.useState(() => ['phone']);
  const handleFormat = (_event, newFormats) => {
    if (newFormats.length) {
      setFormats(newFormats);
    }
  };

  const [alignment, setAlignment] = React.useState('left');
  const handleAlignment = (_event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: 1, gap: 2 }}>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
        sx={{ color: 'success.dark', bgcolor: 'primary.light', ...theme.applyStyles('dark', { bgcolor: 'dark.800' }) }}
      >
        <ToggleButton value="left" aria-label="left aligned">
          <FormatAlignLeftIcon />
        </ToggleButton>
        <ToggleButton value="center" aria-label="centered">
          <FormatAlignCenterIcon />
        </ToggleButton>
        <ToggleButton value="right" aria-label="right aligned">
          <FormatAlignRightIcon />
        </ToggleButton>
        <ToggleButton value="justify" aria-label="justified" disabled>
          <FormatAlignJustifyIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        value={formats}
        onChange={handleFormat}
        aria-label="device"
        sx={{ color: 'warning.dark', bgcolor: 'primary.light', ...theme.applyStyles('dark', { bgcolor: 'dark.800' }) }}
      >
        <ToggleButton value="laptop" aria-label="laptop">
          <LaptopIcon />
        </ToggleButton>
        <ToggleButton value="tv" aria-label="tv">
          <TvIcon />
        </ToggleButton>
        <ToggleButton value="phone" aria-label="phone">
          <PhoneAndroidIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
