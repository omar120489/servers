/**
 * Material-UI theme augmentation for custom properties
 */

import type {
  CustomShadows,
  CustomPaletteColor,
  CustomTextColor,
  CustomTypographyVariants
} from './types';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }

  interface ThemeOptions {
    customShadows?: Partial<CustomShadows>;
  }

  interface Palette {
    orange: CustomPaletteColor;
    dark: CustomPaletteColor;
  }

  interface PaletteOptions {
    orange?: Partial<CustomPaletteColor>;
    dark?: Partial<CustomPaletteColor>;
  }

  interface TypedText extends CustomTextColor {}

  interface TypographyVariants extends CustomTypographyVariants {}

  interface TypographyVariantsOptions extends Partial<CustomTypographyVariants> {}
}
