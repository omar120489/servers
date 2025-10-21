import { alpha, type Components, type Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme: Theme): Components['MuiTableCell'] {
  const isDark = theme.palette.mode === 'dark';
  const borderColor = isDark ? alpha(theme.palette.text.primary, 0.15) : theme.palette.grey[200];
  const headColor = isDark ? theme.palette.grey[600] : theme.palette.grey[900];

  return {
    styleOverrides: {
      root: {
        borderColor,

        '&.MuiTableCell-head': {
          fontSize: '0.875rem',
          color: headColor,
          fontWeight: 500
        }
      }
    }
  };
}
