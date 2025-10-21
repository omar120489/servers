import * as React from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import { DataGrid, GridEditInputCell } from '@mui/x-data-grid';

// project imports
import useDataGrid from 'hooks/useDataGrid';
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { withAlpha } from 'utils/colorUtils';
import { CSVExport } from 'views/forms/tables/TableExports';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  '& .MuiDataGrid-cell--editable': {
    backgroundColor: withAlpha(theme.vars.palette.success.dark, 0.1),
    '& .MuiInputBase-root': {
      height: '100%'
    }
  },
  '& .Mui-error': {
    backgroundColor: withAlpha(theme.vars.palette.error.dark, 0.1)
  }
}));

let promiseTimeout;
function validateName(username) {
  const existingUsers = rows.map((row) => row.name.toLowerCase());

  return new Promise((resolve) => {
    promiseTimeout = setTimeout(
      () => {
        const exists = existingUsers.includes(username.toLowerCase());
        resolve(exists ? `${username} is already taken.` : null);
      },
      Math.random() * 500 + 100
    ); // simulate network latency
  });
}

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.vars.palette.error.main,
    color: theme.vars.palette.error.contrastText
  }
}));

function NameEditInputCell(props) {
  const { error } = props;

  return (
    <StyledTooltip open={!!error} title={error}>
      <GridEditInputCell {...props} />
    </StyledTooltip>
  );
}

function renderEditName(params) {
  return <NameEditInputCell {...params} />;
}

// ==============================|| VALIDTION DATA GRID ||============================== //

export default function ValidateServerNameGrid() {
  const dataGridStyles = useDataGrid();

  const preProcessEditCellProps = async (params) => {
    const errorMessage = await validateName(params.props.value.toString());
    return { ...params.props, error: errorMessage };
  };

  const columns = [
    {
      field: 'name',
      headerName: 'MUI Contributor',
      width: 180,
      editable: true,
      preProcessEditCellProps,
      renderEditCell: renderEditName
    }
  ];

  React.useEffect(() => {
    return () => {
      clearTimeout(promiseTimeout);
    };
  }, []);

  let headers = [];
  columns.map((item) => {
    return headers.push({ label: item.headerName, key: item.field });
  });

  return (
    <MainCard
      content={false}
      title="Validation"
      secondary={
        <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
          <CSVExport data={rows} filename={'validation-data-grid-table.csv'} header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/editing/#validation" />
        </Stack>
      }
    >
      <StyledBox sx={{ ...dataGridStyles }}>
        <DataGrid rows={rows} columns={columns} isCellEditable={(params) => params.row.id === 5} hideFooter className="custom-data-grid" />
      </StyledBox>
    </MainCard>
  );
}

const rows = [
  {
    id: 1,
    name: 'Damien'
  },
  {
    id: 2,
    name: 'Olivier'
  },
  {
    id: 3,
    name: 'Danail'
  },
  {
    id: 4,
    name: 'Matheus'
  },
  {
    id: 5,
    name: 'You?'
  }
];
