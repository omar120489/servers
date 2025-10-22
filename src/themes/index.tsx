import { useMemo, type ReactNode } from 'react';

// material-ui
import { createTheme, ThemeProvider, StyledEngineProvider, type Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// project imports
import { CSS_VAR_PREFIX, DEFAULT_THEME_MODE, ThemeMode, ThemeDirection } from 'config';
import CustomShadows from './custom-shadows';
import useConfig from 'hooks/useConfig';
import { buildPalette } from './palette';
import getTypography from './typography';
import componentsOverrides from './overrides';
import type { PresetColor } from './types';

// Import augmentation to register custom theme properties
import './mui-augmentation';

// ==============================|| THEME FACTORY ||============================== //

/**
 * Create a typed Material-UI theme with custom properties
 * @param presetColor - Color preset to use
 * @param fontFamily - Font family for typography
 * @param borderRadius - Border radius for components
 * @param outlinedFilled - Whether to use outlined filled style
 * @param themeDirection - Text direction (LTR/RTL)
 * @returns Fully configured Material-UI theme
 */
export function createAppTheme(
  presetColor: PresetColor,
  fontFamily: string,
  borderRadius: number,
  outlinedFilled: boolean,
  themeDirection: ThemeDirection
): Theme {
  const palette = buildPalette(presetColor);
  const typography = getTypography(fontFamily);

  const themeOptions = {
    direction: themeDirection,
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography,
    colorSchemes: {
      light: {
        palette: palette.light,
        customShadows: CustomShadows(palette.light, ThemeMode.LIGHT)
      },
      dark: {
        palette: palette.dark,
        customShadows: CustomShadows(palette.dark, ThemeMode.DARK)
      }
    },
    cssVariables: {
      cssVarPrefix: CSS_VAR_PREFIX,
      colorSchemeSelector: 'data-color-scheme'
    }
  };

  const theme = createTheme(themeOptions);

  // Add component overrides
  theme.components = componentsOverrides(theme, borderRadius, outlinedFilled);

  return theme;
}

// ==============================|| THEME CUSTOMIZATION PROVIDER ||============================== //

interface ThemeCustomizationProps {
  readonly children: ReactNode;
}

export default function ThemeCustomization({ children }: ThemeCustomizationProps) {
  const {
    state: { borderRadius, fontFamily, outlinedFilled, presetColor, themeDirection }
  } = useConfig();

  const theme = useMemo(
    () =>
      createAppTheme(
        presetColor as PresetColor,
        fontFamily,
        borderRadius,
        outlinedFilled,
        themeDirection
      ),
    [presetColor, fontFamily, borderRadius, outlinedFilled, themeDirection]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider
        disableTransitionOnChange
        theme={theme}
        modeStorageKey="theme-mode"
        defaultMode={DEFAULT_THEME_MODE}
      >
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
