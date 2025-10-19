import React from 'react';
import { Stack, Box } from '@mui/material';

export interface FormField {
  id: string;
  component: React.ReactNode;
  tabOrder: number;
}

interface FormWithTabOrderProps {
  fields: FormField[];
  spacing?: number;
}

export default function FormWithTabOrder({ fields, spacing = 2 }: FormWithTabOrderProps) {
  const sortedFields = [...fields].sort((a, b) => a.tabOrder - b.tabOrder);

  return (
    <Stack spacing={spacing}>
      {sortedFields.map((field) => (
        <Box key={field.id} tabIndex={field.tabOrder}>
          {field.component}
        </Box>
      ))}
    </Stack>
  );
}

