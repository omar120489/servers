/**
 * Custom theme type definitions for Material-UI augmentation
 */

// ==============================|| CUSTOM SHADOW TYPES ||============================== //

export interface CustomShadows {
  z1: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  primary: string;
  secondary: string;
  orange: string;
  success: string;
  warning: string;
  error: string;
}

// ==============================|| CUSTOM PALETTE COLORS ||============================== //

export interface CustomPaletteColor {
  light: string;
  main: string;
  dark: string;
  200?: string;
  800?: string;
}

export interface CustomPaletteColorOptions {
  light?: string;
  main?: string;
  dark?: string;
  200?: string;
  800?: string;
}

// ==============================|| CUSTOM TEXT COLORS ||============================== //

export interface CustomTextColor {
  primary: string;
  secondary: string;
  dark: string;
  hint: string;
  heading: string;
}

// ==============================|| CUSTOM TYPOGRAPHY ||============================== //

export interface CustomTypographyVariants {
  commonAvatar: {
    cursor: string;
    borderRadius: string;
  };
  smallAvatar: {
    width: string;
    height: string;
    fontSize: string;
  };
  mediumAvatar: {
    width: string;
    height: string;
    fontSize: string;
  };
  largeAvatar: {
    width: string;
    height: string;
    fontSize: string;
  };
}

// ==============================|| PRESET COLOR TYPE ||============================== //

export type PresetColor =
  | 'default'
  | 'theme1'
  | 'theme2'
  | 'theme3'
  | 'theme4'
  | 'theme5'
  | 'theme6';
