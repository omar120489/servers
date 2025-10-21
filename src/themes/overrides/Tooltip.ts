import type { Components, Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TOOLTIP ||============================== //

export default function Tooltip(theme: Theme): Components['MuiTooltip'] {
  return {
    styleOverrides: {
      tooltip: {
        margin: 0,
        lineHeight: 1.4,
        color: theme.palette.background.paper,
        backgroundColor: theme.palette.text.primary
      },
      arrow: {
        color: theme.palette.text.primary
      }
    }
  };
}
