import type { Components, Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TYPOGRAPHY ||============================== //

export default function Typography(theme: Theme): Components['MuiTypography'] {
  const headingColor = theme.palette.text.primary;
  const bodyColor = theme.palette.text.primary;
  const secondaryColor = theme.palette.text.secondary;

  return {
    styleOverrides: {
      root: {}
    },
    variants: [
      { props: { variant: 'h1' }, style: { color: headingColor } },
      { props: { variant: 'h2' }, style: { color: headingColor } },
      { props: { variant: 'h3' }, style: { color: headingColor } },
      { props: { variant: 'h4' }, style: { color: headingColor } },
      { props: { variant: 'h5' }, style: { color: headingColor } },
      { props: { variant: 'h6' }, style: { color: headingColor } },
      { props: { variant: 'subtitle1' }, style: { color: bodyColor } },
      { props: { variant: 'subtitle2' }, style: { color: secondaryColor } },
      { props: { variant: 'caption' }, style: { color: secondaryColor } },
      { props: { variant: 'body2' }, style: { color: bodyColor } }
    ]
  };
}
