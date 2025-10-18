import { CSSProperties } from 'react';

const fontFamily = [
  'Inter','Public Sans','-apple-system','BlinkMacSystemFont','Segoe UI',
  'Roboto','Helvetica Neue','Arial','Noto Sans','Apple Color Emoji',
  'Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'
].join(',');

type Variant = CSSProperties;

const typography = {
  fontFamily,
  h1: { fontWeight: 700, fontSize: '2.75rem', lineHeight: 1.2 } as Variant,
  h2: { fontWeight: 700, fontSize: '2rem',    lineHeight: 1.25 } as Variant,
  h3: { fontWeight: 700, fontSize: '1.5rem',  lineHeight: 1.3 } as Variant,
  h4: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.4 } as Variant,
  h5: { fontWeight: 600, fontSize: '1.125rem',lineHeight: 1.5 } as Variant,
  h6: { fontWeight: 600, fontSize: '1rem',    lineHeight: 1.5 } as Variant,
  subtitle1: { fontWeight: 500, fontSize: '0.95rem' } as Variant,
  subtitle2: { fontWeight: 500, fontSize: '0.85rem' } as Variant,
  body1: { fontSize: '0.95rem' } as Variant,
  body2: { fontSize: '0.85rem' } as Variant,
  button: { textTransform: 'none', fontWeight: 600 } as Variant,
  caption: { fontSize: '0.75rem' } as Variant,
  overline: { fontSize: '0.7rem', letterSpacing: 0.5, textTransform: 'uppercase' } as Variant
};

export default typography;
