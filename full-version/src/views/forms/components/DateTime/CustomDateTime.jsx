import * as React from 'react';

// material-ui
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// assets
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';

// ==============================|| CUSTOM DATETIME ||============================== //

export default function CustomDateTime() {
  const [value, setValue] = React.useState(new Date('2019-01-01T18:54'));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDateTimePicker
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        label="Mobile Datetime Picker"
        onError={console.log}
        minDate={new Date('2018-01-01T00:00')}
        format="yyyy/MM/dd hh:mm a"
        slots={{ openPickerIcon: () => <CalendarTodayTwoToneIcon /> }}
        slotProps={{ textField: { margin: 'normal', fullWidth: true } }}
      />
    </LocalizationProvider>
  );
}
