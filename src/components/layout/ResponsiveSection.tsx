import React from 'react';
import { Box, Paper, Typography, Collapse } from '@mui/material';
import GridLayout from './GridLayout';

interface ResponsiveSectionProps {
  title?: string;
  children: React.ReactNode;
  breakpoints?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  collapsible?: boolean;
  defaultExpanded?: boolean;
  elevation?: number;
}

export default function ResponsiveSection({
  title,
  children,
  breakpoints = { xs: 12, sm: 6, md: 4 },
  collapsible = false,
  defaultExpanded = true,
  elevation = 0,
}: ResponsiveSectionProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const content = (
    <GridLayout breakpoints={breakpoints} gap={2}>
      {children}
    </GridLayout>
  );

  if (!title) {
    return <Box sx={{ mb: 2 }}>{content}</Box>;
  }

  return (
    <Paper elevation={elevation} sx={{ p: 2, mb: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        onClick={collapsible ? () => setExpanded(!expanded) : undefined}
        sx={{
          cursor: collapsible ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        {title}
      </Typography>
      {collapsible ? (
        <Collapse in={expanded} timeout="auto">
          {content}
        </Collapse>
      ) : (
        content
      )}
    </Paper>
  );
}

