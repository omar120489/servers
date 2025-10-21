import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { IconPlus } from '@tabler/icons-react';

const activityData = [
  { name: 'Adaline Bergfalks', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Profit' },
  { name: 'Agilulf Fuxg', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Profit' },
  { name: 'Peahen', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Loss' },
  { name: 'Wilhelmine Durrg', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Profit' },
  { name: 'Herman Essertg', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Loss' },
  { name: 'Eadwulf Beckete', id: '0697', date: '09/05/2023', amount: '5678.09', status: 'Loss' }
];

export default function RecentActivity({ isLoading }) {
  const theme = useTheme();

  if (isLoading) return <SkeletonPopularCard />;

  return (
    <MainCard
      title="Recent Activity"
      secondary={
        <Button
          size="small"
          variant="outlined"
          sx={{
            px: 1.75,
            borderColor: 'divider',
            borderRadius: theme.shape.borderRadius,
            color: 'grey.900',
            ...theme.applyStyles('dark', { color: 'grey.600' })
          }}
          startIcon={<IconPlus size={14} />}
        >
          Add new
        </Button>
      }
      content={false}
    >
      <CardContent>
        {activityData.map((data, index) => (
          <Box key={index}>
            <Grid container direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid size={4}>
                <Stack sx={{ gap: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ color: 'grey.600' }}>
                    #{data.id}
                  </Typography>
                  <Typography variant="h5">{data.date}</Typography>
                </Stack>
              </Grid>
              <Grid size={8}>
                <Stack direction="row" sx={{ minWidth: 120, justifyContent: 'space-between' }}>
                  <Typography variant="h5">{data.name}</Typography>
                  <Typography variant="h5" sx={{ color: data.status === 'Loss' ? 'orange.dark' : 'success.dark' }}>
                    {data.status === 'Loss' ? '-' : ''} £{data.amount}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 1.5, mb: activityData.length > index + 1 ? 1.5 : 0 }} />
          </Box>
        ))}
      </CardContent>
      <CardActions sx={{ p: 1.25, pt: 0, mt: -1.5, justifyContent: 'center' }}>
        <Button size="small" disableElevation>
          View All
          <ChevronRightOutlinedIcon />
        </Button>
      </CardActions>
    </MainCard>
  );
}

RecentActivity.propTypes = { isLoading: PropTypes.bool };
