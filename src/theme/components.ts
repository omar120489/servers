import { ThemeOptions } from '@mui/material/styles';

export default function componentsOverrides(theme: any): ThemeOptions['components'] {
  const { shape } = theme;
  return {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: shape.borderRadius, fontWeight: 600 },
        containedPrimary: { boxShadow: '0 8px 16px rgba(115,103,240,0.24)' }
      }
    },
    MuiCard: { styleOverrides: { root: { borderRadius: shape.borderRadius * 1.5 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: '0 10px 30px rgba(0,0,0,0.06)' } } }
  };
}
