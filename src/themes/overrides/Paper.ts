import type { Components } from '@mui/material/styles';

export default function Paper(borderRadius: number): Components['MuiPaper'] {
  return {
    styleOverrides: {
      rounded: {
        borderRadius
      }
    }
  };
}
