import type { Components, Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - DIALOG TITLE ||============================== //

export default function DialogTitle(theme: Theme): Components['MuiDialogTitle'] {
  return {
    styleOverrides: {
      root: {
        fontSize: theme.typography.h6.fontSize,
        fontWeight: theme.typography.h6.fontWeight as number,
        lineHeight: theme.typography.h6.lineHeight,
        padding: theme.spacing(2, 3, 2, 3)
      }
    }
  };
}
