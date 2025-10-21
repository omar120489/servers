import type { Theme } from '@mui/material/styles';

type DataGridOverrides = {
  MuiDataGrid: {
    styleOverrides: {
      root: {
        '& .MuiDataGrid-columnSeparator': {
          color: string;
        };
      };
    };
  };
};

export default function DataGrid(theme: Theme): DataGridOverrides {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-columnSeparator': { color: theme.palette.grey[300] }
        }
      }
    }
  };
}
