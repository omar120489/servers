import { ThemeOptions, Theme, Components } from '@mui/material/styles';
import { typographyComponents } from './typography';

export default function componentsOverrides(theme: any): Components<Omit<Theme, 'components'>> {
  const { shape } = theme;
  
  // Merge typography components with Berry theme overrides
  const merged = {
    ...typographyComponents,
    
    // Berry theme visual overrides
    MuiButton: {
      styleOverrides: {
        root: { 
          borderRadius: shape.borderRadius, 
          fontWeight: 500, // MD3: Label/L uses medium weight
          textTransform: 'none' as const, // Sentence-case
          fontSize: '0.875rem',
          lineHeight: 20 / 14,
        },
        containedPrimary: { boxShadow: '0 8px 16px rgba(115,103,240,0.24)' }
      }
    },
    MuiCard: { styleOverrides: { root: { borderRadius: shape.borderRadius * 1.5 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: '0 10px 30px rgba(0,0,0,0.06)' } } }
  };
  
  return merged as Components<Omit<Theme, 'components'>>;
}
