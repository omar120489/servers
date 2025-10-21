// material-ui
import Grid from '@mui/material/Grid';

// project imports
import BasicGrid from './BasicGrid';
import MultipleBreakPoints from './MultipleBreakPoints';
import SpacingGrid from './SpacingGrid';
import ComplexGrid from './ComplexGrid';
import AutoGrid from './AutoGrid';
import ColumnsGrid from './ColumnsGrid';
import NestedGrid from './NestedGrid';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ===============================|| GRID SYSTEM||=============================== //

export default function GridSystem() {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Basic Grid">
          <BasicGrid />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Multiple Breakpoints">
          <MultipleBreakPoints />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Spacing Grid">
          <SpacingGrid />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Complex Grid">
          <ComplexGrid />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Auto Grid">
          <AutoGrid />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Column Grid">
          <ColumnsGrid />
        </MainCard>
      </Grid>
      <Grid size={12}>
        <MainCard title="Nested Grid">
          <NestedGrid />
        </MainCard>
      </Grid>
    </Grid>
  );
}
