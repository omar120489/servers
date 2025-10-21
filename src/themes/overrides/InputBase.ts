import { alpha, type Components, type Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - INPUT BASE ||============================== //

export default function InputBase(theme: Theme): Components['MuiInputBase'] {
  return {
    styleOverrides: {
      input: {
        color: theme.palette.text.primary,
        '&::placeholder': {
          color: alpha(theme.palette.text.secondary, 0.6),
          fontSize: '0.875rem'
        }
      }
    }
  };
}
