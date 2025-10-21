// material-ui
import Stack from '@mui/material/Stack';
import { DataGrid, GridColumnMenu } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';

// project imports
import useDataGrid from 'hooks/useDataGrid';
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { CSVExport } from 'views/forms/tables/TableExports';

function CustomColumnMenu(props) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Hide `columnMenuColumnsItem`
        columnMenuColumnsItem: null
      }}
    />
  );
}

// ==============================|| HIDE MENU ITEM DATA GRID ||============================== //

export default function HideMenuItem() {
  const dataGridStyles = useDataGrid();

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 5,
    maxColumns: 8
  });

  let headers = [];
  data.columns.map((item) => {
    return headers.push({ label: item.headerName, key: item.field });
  });

  return (
    <MainCard
      content={false}
      title="Hide Menu Item"
      secondary={
        <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
          <CSVExport data={data.rows} filename={'hide-menu-data-grid-table.csv'} header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/column-menu/#hiding-a-menu-item" />
        </Stack>
      }
    >
      <Box sx={{ width: '100%', ...dataGridStyles }}>
        <DataGrid hideFooter {...data} slots={{ columnMenu: CustomColumnMenu }} className="custom-data-grid" />
      </Box>
    </MainCard>
  );
}
