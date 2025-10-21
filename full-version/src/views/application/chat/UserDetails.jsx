import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import AvatarStatus from './AvatarStatus';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

// assets
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';

import images1 from 'assets/images/pages/img-catalog1.png';
import images2 from 'assets/images/pages/img-catalog2.png';
import images3 from 'assets/images/pages/img-catalog3.png';

export default function UserDetails({ user }) {
  const theme = useTheme();

  return (
    <Grid container spacing={gridSpacing} sx={{ width: '100%', maxWidth: 260 }}>
      <Grid size={12}>
        <Card>
          <CardContent
            sx={{
              textAlign: 'center',
              bgcolor: 'primary.light',
              ...theme.applyStyles('dark', { bgcolor: 'dark.main' })
            }}
          >
            <Grid container spacing={1}>
              <Grid size={12}>
                <Avatar
                  alt={user.name}
                  src={user.avatar && getImageUrl(`${user.avatar}`, ImagePath.USERS)}
                  sx={{
                    m: '0 auto',
                    width: 130,
                    height: 130,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    p: 1,
                    bgcolor: 'transparent'
                  }}
                />
              </Grid>
              <Grid size={12}>
                <AvatarStatus status={user.online_status} />
                <Typography variant="caption">{user?.online_status.replaceAll('_', ' ')}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h5">{user.name}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="body2">{user.role}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <SubCard sx={{ bgcolor: 'grey.50', ...theme.applyStyles('dark', { bgcolor: 'dark.main' }) }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h5">Information</Typography>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Typography variant="body2">
                    <PinDropTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625 }} /> 32188 Sips Parkways, U.S
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2">
                    <PhoneTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625 }} /> 995-250-1803
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2">
                    <EmailTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625 }} /> O’Keefe@codedtheme.com
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={12}>
              <Typography variant="h5">Attachment</Typography>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={2.5}>
                <Grid size={12}>
                  <Grid container spacing={1}>
                    <Grid>
                      <CardMedia component="img" image={images1} title="image" sx={{ width: 42, height: 42 }} />
                    </Grid>
                    <Grid size="grow">
                      <Grid container spacing={0}>
                        <Grid size={12}>
                          <Typography variant="h6">File Name.jpg</Typography>
                        </Grid>
                        <Grid size={12}>
                          <Typography variant="caption">4/16/2021 07:47:03</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={12}>
                  <Grid container spacing={1}>
                    <Grid>
                      <CardMedia component="img" image={images2} title="image" sx={{ width: 42, height: 42 }} />
                    </Grid>
                    <Grid size="grow">
                      <Grid container spacing={0}>
                        <Grid size={12}>
                          <Typography variant="h6">File Name.ai</Typography>
                        </Grid>
                        <Grid size={12}>
                          <Typography variant="caption">4/16/2021 07:47:03</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={12}>
                  <Grid container spacing={1}>
                    <Grid>
                      <CardMedia component="img" image={images3} title="image" sx={{ width: 42, height: 42 }} />
                    </Grid>
                    <Grid size="grow">
                      <Grid container spacing={0}>
                        <Grid size={12}>
                          <Typography variant="h6">File Name.pdf</Typography>
                        </Grid>
                        <Grid size={12}>
                          <Typography variant="caption">4/16/2021 07:47:03</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  );
}

UserDetails.propTypes = { user: PropTypes.any };
