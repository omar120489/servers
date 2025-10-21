import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthForgotPassword from '../jwt/AuthForgotPassword';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import AuthMultiCard from 'assets/images/auth/auth-forgot-pass-multi-card.svg';

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

// ============================|| AUTH1 - FORGOT PASSWORD ||============================ //

export default function ForgotPassword() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', minHeight: '100vh' }}>
        <Grid container sx={{ justifyContent: 'center', my: 3 }} size={{ xs: 12, md: 6, lg: 7 }}>
          <AuthCardWrapper>
            <Stack sx={{ justifyContent: 'center', gap: 2 }}>
              <Stack
                direction={{ xs: 'column-reverse', md: 'row' }}
                sx={{ alignItems: { xs: 'center', md: 'inherit' }, justifyContent: { xs: 'center', md: 'space-between' } }}
              >
                <Stack sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'inherit' } }}>
                  <Typography gutterBottom variant={downMD ? 'h3' : 'h2'} sx={{ color: 'secondary.main' }}>
                    Forgot password?
                  </Typography>
                  <Typography gutterBottom variant="h4" sx={{ color: 'text.primary' }}>
                    Enter credentials to continue
                  </Typography>
                </Stack>
                <Box sx={{ mb: { xs: 3, sm: 0 } }}>
                  <Link to="#" aria-label="theme logo">
                    <Logo />
                  </Link>
                </Box>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="caption" sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}>
                  Enter your email address below and we&apos;ll send you password reset OTP.
                </Typography>
              </Stack>
              <AuthForgotPassword link={'check-mail1'} />
              <Divider />
              <Stack sx={{ alignItems: 'flex-end' }}>
                <Typography component={Link} to="/pages/login/login1" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                  Already have an account?
                </Typography>
              </Stack>
            </Stack>
          </AuthCardWrapper>
        </Grid>
        <Grid sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }} size={{ xs: 12, md: 6, lg: 5 }}>
          <BackgroundPattern1>
            <Grid container spacing={3} sx={{ alignItems: 'flex-end', justifyContent: 'center' }}>
              <Grid size={12}>
                <span />
                <Stack sx={{ jaustifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ position: 'absolute', top: '20%', height: 470, width: { xs: 450, xl: 'auto' } }}>
                    <CardMedia
                      component="img"
                      src={AuthMultiCard}
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
