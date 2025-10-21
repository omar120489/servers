import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Box from '@mui/material/Box';

// assets
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';

// ==============================|| VIEW RENDERER DATETIME ||============================== //

export default function ViewRendererDateTime() {
  const [timeClockValue, setTimeClockValue] = useState(new Date());
  const [rendererValue, setrendererValue] = useState(new Date());

  return (
    <Box
      sx={{
        '&.MuiTypography-root-MuiClock-meridiemText': {
          color: 'inherit'
        }
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <DateTimePicker
              label="With Time Clock"
              slots={{ openPickerIcon: () => <CalendarTodayTwoToneIcon /> }}
              slotProps={{ textField: { fullWidth: true } }}
              value={timeClockValue}
              onChange={(newValue) => setTimeClockValue(newValue)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock
              }}
            />
          </Grid>
          <Grid size={12}>
            <DateTimePicker
              label="Without View Renderers"
              slots={{ openPickerIcon: () => <CalendarTodayTwoToneIcon /> }}
              slotProps={{ textField: { fullWidth: true } }}
              value={rendererValue}
              onChange={(newValue) => setrendererValue(newValue)}
              viewRenderers={{
                hours: null,
                minutes: null,
                seconds: null
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
}
