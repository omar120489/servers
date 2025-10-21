import type { Components } from '@mui/material/styles';

export default function Dialog(): Components['MuiDialog'] {
  return {
    styleOverrides: {
      paper: {
        overflowY: 'visible'
      }
    }
  };
}
