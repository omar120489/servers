import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import typography from './typography';
import shadows from './shadows';
import componentsOverrides from './components';

export const shape = { borderRadius: 12 };

export const createBerryTheme = (mode: 'light' | 'dark' = 'light'): Theme => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  let theme = createTheme({ palette, typography: typography as any, shadows: shadows as any, shape });
  theme.components = { ...componentsOverrides(theme) } as any;
  return responsiveFontSizes(theme);
};
