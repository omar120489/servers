import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// assets
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import SearchIcon from '@mui/icons-material/Search';

// ==============================|| LEAD - FILTER LIST ||============================== //

export default function FilterLeadList({ handleToggleDrawer }) {
  const theme = useTheme();

  const [value, setValue] = useState(new Date());
  const [value2, setValue2] = useState(new Date());

  return (
    <Box sx={{ bgcolor: 'grey.50', ...theme.applyStyles('dark', { bgcolor: 'dark.main' }) }}>
      <Card sx={{ borderRadius: 0 }}>
        <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
          <TextField
            fullWidth
            placeholder="Search Lead"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />
        </CardContent>
        <Divider />
        <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Source</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={1}
              label="Source"
              slotProps={{ input: { placeholder: 'Source' } }}
            >
              <MenuItem value={1}>Facebook</MenuItem>
              <MenuItem value={2}>Linkedin</MenuItem>
              <MenuItem value={3}>Contact</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
        <Divider />
        <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={1}
              label="Status"
              slotProps={{ input: { placeholder: 'Status' } }}
            >
              <MenuItem value={1}>Lost</MenuItem>
              <MenuItem value={2}>Contacted</MenuItem>
              <MenuItem value={3}>Qualified</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
        <Divider />

        <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
          <TextField placeholder="Name" fullWidth />
        </CardContent>
        <Divider />
        <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
          <Stack sx={{ gap: 4 }}>
            <Stack sx={{ gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="From"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  slots={{ openPickerIcon: () => <CalendarTodayTwoToneIcon /> }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="To"
                  value={value2}
                  onChange={(newValue) => setValue2(newValue)}
                  slots={{ openPickerIcon: () => <CalendarTodayTwoToneIcon /> }}
                />
              </LocalizationProvider>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'center', gap: 1 }}>
              <Button variant="contained" sx={{ borderRadius: 2.5 }} color="primary" startIcon={<ReplayIcon />}>
                Reset
              </Button>
              <Button variant="outlined" sx={{ borderRadius: 2.5 }} onClick={handleToggleDrawer} color="error" startIcon={<CloseIcon />}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

FilterLeadList.propTypes = { handleToggleDrawer: PropTypes.func };
