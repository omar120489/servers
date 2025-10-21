import React from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';

// assets
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

// ==============================|| VOLUME SLIDER ||============================== //

export default function VolumeSlider() {
  const [value, setValue] = React.useState(30);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
      <Grid>
        <VolumeDown color="primary" />
      </Grid>
      <Grid size="grow">
        <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
      </Grid>
      <Grid>
        <VolumeUp color="primary" />
      </Grid>
    </Grid>
  );
}
