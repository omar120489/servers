import React from 'react';
import { Card, CardContent, CardHeader, CardProps } from '@mui/material';

export default function BerryCard({ title, subheader, children, ...rest }: CardProps & { title?: React.ReactNode; subheader?: React.ReactNode; }) {
  return (
    <Card {...rest}>
      {(title || subheader) && <CardHeader title={title} subheader={subheader} />}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
