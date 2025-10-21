import { alpha } from '@mui/material/styles';

type PalettePrimitive = string | number | null | undefined;
type PaletteLike = {
  [key: string]: PalettePrimitive | PaletteLike;
};

function isPaletteLike(value: unknown): value is PaletteLike {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Converts a hex color string to a space-delimited RGB channel string ("r g b").
 *
 * Supports 3, 4, 6, and 8 character hex values (with optional leading '#').
 */
export function hexToRgbChannel(hex: string): string {
  let cleaned = hex.replace(/^#/, '');

  if (cleaned.length === 3 || cleaned.length === 4) {
    cleaned = cleaned
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (cleaned.length !== 6 && cleaned.length !== 8) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = Number.parseInt(cleaned.substring(0, 2), 16);
  const g = Number.parseInt(cleaned.substring(2, 4), 16);
  const b = Number.parseInt(cleaned.substring(4, 6), 16);

  return `${r} ${g} ${b}`;
}

export function extendPaletteWithChannels<T extends PaletteLike>(palette: T): T & PaletteLike {
  const result: PaletteLike = { ...palette };

  Object.entries(palette).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith('#')) {
      result[`${key}Channel`] = hexToRgbChannel(value);
    } else if (isPaletteLike(value)) {
      result[key] = extendPaletteWithChannels(value);
    }
  });

  return result as T & PaletteLike;
}

export function withAlpha(color: string, opacity: number): string {
  if (/^#|rgb|hsl|color/i.test(color)) {
    return alpha(color, opacity);
  }

  if (color.startsWith('var(')) {
    return color
      .replace(/(--[a-zA-Z0-9-]+)(.*)\)/, `$1Channel$2)`)
      .replace(/^var\((.+)\)$/, `rgba(var($1) / ${opacity})`);
  }

  return color;
}
