import React from 'react';
import { Button, ButtonProps } from '@mui/material';

export default function BerryButton(props: ButtonProps) {
  return <Button variant="contained" color="primary" {...props} />;
}
