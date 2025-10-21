import React from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

// project imports
import CustomDateTime from './CustomDateTime';
import LandscapeDateTime from './LandscapeDateTime';
import ViewsDateTimePicker from './ViewsDateTimePicker';
import ViewRendererDateTime from './ViewRendererDateTime';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';

// assets
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';

// ==============================|| DATETIME ||============================== //

export default function DateTime() {
  const [valueBasic, setValueBasic] = React.useState(new Date());

  return (
    <MainCard title="Date & Time" secondary={<SecondaryAction link="https://next.material-ui.com/components/date-time-picker/" />}>
      <Grid container spacing={gridSpacing}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title="Basic Datetime Picker">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                slotProps={{ textField: { fullWidth: true } }}
                label="Date & Time"
                value={valueBasic}
                onChange={(newValue) => {
                  setValueBasic(newValue);
                }}
                slots={{ openPickerIcon: () => <CalendarTodayTwoToneIcon /> }}
              />
            </LocalizationProvider>
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title="Disabled">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                slots={{ openPickerIcon: () => <CalendarTodayTwoToneIcon /> }}
                slotProps={{ textField: { fullWidth: true } }}
                label="Date & Time"
                value={valueBasic}
                onChange={(newValue) => {
                  setValueBasic(newValue);
                }}
                disabled
              />
            </LocalizationProvider>
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title="Mobile Mode">
            <CustomDateTime />
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title="View Renderer Mode">
            <ViewRendererDateTime />
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title="Views Mode">
            <ViewsDateTimePicker />
          </SubCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubCard title="Landscape Mode">
            <LandscapeDateTime />
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}
