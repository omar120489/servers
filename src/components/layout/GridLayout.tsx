import React from 'react';
import { Grid2, Grid2Props } from '@mui/material';

interface GridLayoutProps {
  breakpoints: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  children: React.ReactNode;
  gap?: number;
}

export default function GridLayout({ breakpoints, children, gap = 2 }: GridLayoutProps) {
  return (
    <Grid2 container spacing={gap}>
      {React.Children.map(children, (child) => (
        <Grid2 {...breakpoints}>{child}</Grid2>
      ))}
    </Grid2>
  );
}

