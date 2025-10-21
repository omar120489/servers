import type { Components } from '@mui/material/styles';

// ==============================|| OVERRIDES - SELECT ||============================== //

export default function Select(): Components['MuiSelect'] {
  return {
    styleOverrides: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent'
        }
      }
    }
  };
}
