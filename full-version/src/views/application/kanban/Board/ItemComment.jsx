import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ==============================|| KANBAN BOARD - ITEM COMMENT ||============================== //

export default function ItemComment({ comment, profile }) {
  const theme = useTheme();

  return (
    <Card sx={{ bgcolor: 'grey.50', p: 1.5, mt: 1.25, ...theme.applyStyles('dark', { bgcolor: 'dark.main' }) }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Grid container wrap="nowrap" spacing={1} sx={{ alignItems: 'center' }}>
            <Grid>
              <Avatar
                sx={{ width: 24, height: 24 }}
                size="sm"
                alt="User 1"
                src={profile && profile.avatar && getImageUrl(`${profile.avatar}`, ImagePath.USERS)}
              />
            </Grid>
            <Grid size="grow">
              <Grid container spacing={1} sx={{ alignItems: 'center' }}>
                <Grid>
                  <Typography variant="h5">{profile.name}</Typography>
                </Grid>
                <Grid>
                  <Typography variant="caption">
                    <FiberManualRecordIcon sx={{ width: 10, height: 10, opacity: 0.5, my: 0, mx: 0.625 }} />
                    {profile.time}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ '&.MuiGrid-root': { pt: 1.5 } }} size={12}>
          <Typography variant="body2">{comment?.comment}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

ItemComment.propTypes = { comment: PropTypes.any, profile: PropTypes.any };
