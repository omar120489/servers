// material-ui
import { useColorScheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import { ThemeMode } from 'config';
import Avatar from 'ui-component/extended/Avatar';

// assets
import { IconCpu, IconMoon, IconSun } from '@tabler/icons-react';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

export default function ThemeModeLayout() {
  const { mode, setMode } = useColorScheme();

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
      <Typography variant="h5">THEME MODE</Typography>
      <RadioGroup row aria-label="layout" value={mode} onChange={handleModeChange} name="row-radio-buttons-group">
        <Tooltip title="Light Mode">
          <FormControlLabel
            control={<Radio value={ThemeMode.LIGHT} sx={{ display: 'none' }} />}
            label={
              <Avatar
                variant="rounded"
                outline
                sx={{
                  mr: 1,
                  width: 48,
                  height: 48,
                  color: 'warning.dark',
                  borderColor: mode === ThemeMode.LIGHT ? 'primary.main' : 'divider'
                }}
              >
                <IconSun />
              </Avatar>
            }
          />
        </Tooltip>
        <Tooltip title="Dark Mode">
          <FormControlLabel
            control={<Radio value={ThemeMode.DARK} sx={{ display: 'none' }} />}
            label={
              <Avatar
                size="md"
                variant="rounded"
                {...(mode === ThemeMode.DARK && { outline: true })}
                sx={{
                  mr: 1,
                  width: 48,
                  height: 48,
                  color: 'grey.100',
                  bgcolor: 'dark.main',
                  borderColor: mode === ThemeMode.DARK ? 'primary.main' : 'divider'
                }}
              >
                <IconMoon style={{ transform: 'rotate(220deg)' }} />
              </Avatar>
            }
          />
        </Tooltip>
        <Tooltip title="System Mode">
          <FormControlLabel
            control={<Radio value={ThemeMode.SYSTEM} sx={{ display: 'none' }} />}
            label={
              <Avatar
                size="md"
                variant="rounded"
                outline
                sx={{ width: 48, height: 48, borderColor: mode === ThemeMode.SYSTEM ? 'primary.main' : 'divider' }}
              >
                <IconCpu />
              </Avatar>
            }
          />
        </Tooltip>
      </RadioGroup>
    </Stack>
  );
}
