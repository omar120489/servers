import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AnimateButton from 'ui-component/extended/AnimateButton';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import AuthBlueCard from 'assets/images/auth/auth-mail-blue-card.svg';

// carousel items
const items = [
  {
    title: 'Powerful and easy to use multipurpose theme.',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Power of React with Material UI',
    description: 'Powerful and easy to use multipurpose theme'
  },
  {
    title: 'Power of React with Material UI',
    description: 'Powerful and easy to use multipurpose theme'
  }
];

// ==============================|| AUTH1 - CHECK MAIL ||============================== //

export default function CheckMail() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', minHeight: '100vh' }}>
        <Grid container sx={{ justifyContent: 'center', my: 3 }} size={{ xs: 12, md: 6, lg: 7 }}>
          <AuthCardWrapper>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              <Grid size={12}>
                <Grid
                  container
                  direction={{ xs: 'column-reverse', md: 'row' }}
                  sx={{ alignItems: { xs: 'center', md: 'inherit' }, justifyContent: { xs: 'center', md: 'space-between' } }}
                >
                  <Grid>
                    <Stack sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'inherit' } }}>
                      <Typography gutterBottom variant={downMD ? 'h3' : 'h2'} sx={{ color: 'secondary.main' }}>
                        Check Mail
                      </Typography>
                      <Typography gutterBottom variant="h4" sx={{ color: 'text.primary' }}>
                        Avoid getting locked out.
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid sx={{ mb: { xs: 3, sm: 0 } }}>
                    <Link to="#" aria-label="theme logo">
                      <Logo />
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Stack direction="row" sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="caption" sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}>
                    We have sent a password recover instructions to your email.
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
                    Open Mail
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }} size={{ md: 6, lg: 5 }}>
          <BackgroundPattern1>
            <Grid container spacing={3} sx={{ alignItems: 'flex-end', justifyContent: 'center' }}>
              <Grid size={12}>
                <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ position: 'absolute', top: '20%', height: 470, width: { xs: 450, xl: 'auto' } }}>
                    <CardMedia
                      component="img"
                      src={AuthBlueCard}
                      alt="demo"
                      title="Auth Multi Card"
                      sx={{ animation: '15s wings ease-in-out infinite', animationDelay: '1s' }}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Grid container sx={{ justifyContent: 'center', pb: 8 }}>
                  <Grid sx={{ '& .slick-list': { pb: 2 } }} size={{ xs: 10, lg: 8 }}>
                    <AuthSlider items={items} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </BackgroundPattern1>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
}
