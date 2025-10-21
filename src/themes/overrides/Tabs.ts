import { alpha, type Components, type Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TABS ||============================== //

export default function Tabs(theme: Theme): Components['MuiTabs'] {
  const isDark = theme.palette.mode === 'dark';
  const borderColor = isDark ? alpha(theme.palette.text.primary, 0.2) : theme.palette.grey[200];

  return {
    styleOverrides: {
      flexContainer: {
        borderBottom: '1px solid',
        borderColor
      }
    }
  };
}
