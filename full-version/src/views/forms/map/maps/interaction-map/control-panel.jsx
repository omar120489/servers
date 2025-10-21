import PropTypes from 'prop-types';
import { memo } from 'react';

// material-ui
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

// project imports
import ControlPanelStyled from 'ui-component/third-party/map/ControlPanelStyled';
import { withAlpha } from 'utils/colorUtils';

const camelPattern = /(^|[A-Z])[a-z]*/g;

function formatSettingName(name) {
  return name.match(camelPattern)?.join(' ');
}

// ==============================|| CONTROL - INTERATION MAP ||============================== //

function ControlPanel({ settings, onChange }) {
  const renderSetting = (name, value) => {
    switch (typeof value) {
      case 'boolean':
        return (
          <Stack
            direction="row"
            key={name}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              textTransform: 'capitalize',
              '&:not(:last-of-type)': { mb: 1 },
              gap: 0.75
            }}
          >
            <Typography variant="body2">{formatSettingName(name)}</Typography>
            <Switch size="small" checked={value} onChange={(event) => onChange(name, event.target.checked)} />
          </Stack>
        );
      case 'number':
        return (
          <Stack
            direction="row"
            key={name}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              textTransform: 'capitalize',
              '&:not(:last-of-type)': { mb: 1 },
              gap: 0.75
            }}
          >
            <Typography variant="body2">{formatSettingName(name)}</Typography>
            <InputBase
              value={value}
              onChange={(event) => onChange(name, Number(event.target.value))}
              slotProps={{ input: { type: 'number' } }}
              sx={{
                '& input': {
                  py: 0.25,
                  width: 40,
                  fontSize: 14,
                  borderRadius: 1,
                  textAlign: 'center',
                  bgcolor: (theme) => withAlpha(theme.vars.palette.grey[500], 0.12)
                }
              }}
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  return <ControlPanelStyled>{Object.keys(settings).map((name) => renderSetting(name, settings[name]))}</ControlPanelStyled>;
}

export default memo(ControlPanel);

ControlPanel.propTypes = { settings: PropTypes.any, onChange: PropTypes.func };
