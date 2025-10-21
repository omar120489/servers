import { alpha, type Components, type Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - SLIDER ||============================== //

export default function Slider(theme: Theme): Components['MuiSlider'] {
  const isDark = theme.palette.mode === 'dark';
  const disabledColor = isDark ? alpha(theme.palette.text.primary, 0.5) : theme.palette.grey[300];
  const valueLabelColor = isDark ? theme.palette.primary.main : theme.palette.primary.light;

  return {
    styleOverrides: {
      root: {
        '&.Mui-disabled': {
          color: disabledColor
        }
      },
      mark: {
        backgroundColor: theme.palette.background.paper,
        width: '4px'
      },
      valueLabel: {
        color: valueLabelColor
      }
    }
  };
}
