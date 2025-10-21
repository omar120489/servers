import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';

// third party
import copy from 'copy-to-clipboard';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Transitions from 'ui-component/extended/Transitions';
import { gridSpacing } from 'store/constant';

// assets
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import { IconGift, IconTrophy } from '@tabler/icons-react';
import discount from 'assets/images/e-commerce/discount.png';

function Transition(props) {
  return <Zoom {...props} />;
}

export default function CouponCode({ open, handleClose, setCoupon }) {
  const [animate, setAnimate] = useState(false);

  const setDiscount = (code) => {
    setAnimate(true);
    setCoupon(code);
    setTimeout(() => {
      setAnimate(false);
    }, 2500);
  };

  return (
    <Dialog
      open={open}
      slots={{ transition: Transition }}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      slotProps={{ paper: { sx: { p: 0 } } }}
    >
      {open && (
        <MainCard
          title="Festival gift for your"
          secondary={
            <IconButton onClick={handleClose} size="large">
              <HighlightOffTwoToneIcon fontSize="small" />
            </IconButton>
          }
        >
          <Grid container spacing={gridSpacing}>
            {animate && (
              <Grid size={12}>
                <Transitions type="zoom" in={animate} direction="down">
                  <Alert variant="outlined" severity="success">
                    coupon copied
                  </Alert>
                </Transitions>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <SubCard
                content={false}
                sx={{
                  backgroundImage: `url(${discount})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'right',
                  borderColor: 'secondary.200'
                }}
              >
                <CardContent>
                  <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography variant="h4">Up to 50% Off</Typography>
                    </Grid>
                    <Grid>
                      <AnimateButton>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          sx={{
                            bgcolor: 'secondary.light',
                            color: 'secondary.dark',
                            border: '2px dashed',
                            '&:hover': { bgcolor: 'secondary.light' }
                          }}
                          onClick={() => {
                            setDiscount('BERRY50');
                            copy('BERRY50');
                          }}
                        >
                          BERRY50
                        </Button>
                      </AnimateButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </SubCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SubCard
                content={false}
                sx={{
                  backgroundImage: `url(${discount})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'right',
                  borderColor: 'error.light'
                }}
              >
                <CardContent>
                  <Grid container spacing={{ xs: 2, sm: 0 }} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid>
                      <Typography variant="h4">Festival Fires</Typography>
                    </Grid>
                    <Grid>
                      <AnimateButton>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{
                            bgcolor: 'orange.light',
                            color: 'error.main',
                            border: '2px dashed',
                            '&:hover': { bgcolor: 'orange.light' }
                          }}
                          onClick={() => {
                            setDiscount('FLAT05');
                            copy('FLAT05');
                          }}
                        >
                          FLAT05
                        </Button>
                      </AnimateButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </SubCard>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={12}>
              <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Avatar color="primary" size="md" variant="rounded">
                    <IconGift />
                  </Avatar>
                </Grid>
                <Grid sx={{ display: { xs: 'block', sm: 'none' } }} size={{ xs: 6, sm: 2 }}>
                  <AnimateButton>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                        border: '2px dashed',
                        '&:hover': { bgcolor: 'primary.light' }
                      }}
                      onClick={() => {
                        setDiscount('SUB150');
                        copy('SUB150');
                      }}
                    >
                      SUB150
                    </Button>
                  </AnimateButton>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Stack sx={{ gap: 0.25 }}>
                    <Typography variant="subtitle1">Get $150 off on your subscription</Typography>
                    <Typography variant="caption">When you subscribe to the unlimited consultation plan on berry.</Typography>
                  </Stack>
                </Grid>
                <Grid sx={{ display: { xs: 'none', sm: 'block' } }} size={{ xs: 12, sm: 2 }}>
                  <AnimateButton>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                        border: '2px dashed',
                        '&:hover': { bgcolor: 'primary.light' }
                      }}
                      onClick={() => {
                        setDiscount('SUB150');
                        copy('SUB150');
                      }}
                    >
                      SUB150
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={12}>
              <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <Avatar color="warning" size="md" variant="rounded">
                    <IconTrophy />
                  </Avatar>
                </Grid>
                <Grid sx={{ display: { xs: 'block', sm: 'none' } }} size={{ xs: 6, sm: 2 }}>
                  <AnimateButton>
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      sx={{
                        bgcolor: 'warning.light',
                        color: 'warning.dark',
                        border: '2px dashed',
                        '&:hover': { bgcolor: 'warning.light' }
                      }}
                      onClick={() => {
                        setDiscount('UPTO200');
                        copy('UPTO200');
                      }}
                    >
                      UPTO200
                    </Button>
                  </AnimateButton>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Stack sx={{ gap: 0.25 }}>
                    <Typography variant="subtitle1">Save up to $200</Typography>
                    <Typography variant="caption">Make 4 play store recharge code purchases & save up to $200</Typography>
                  </Stack>
                </Grid>
                <Grid sx={{ display: { xs: 'none', sm: 'block' } }} size={{ xs: 12, sm: 2 }}>
                  <AnimateButton>
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      sx={{
                        bgcolor: 'warning.light',
                        color: 'warning.dark',
                        border: '2px dashed',
                        '&:hover': { bgcolor: 'warning.light' }
                      }}
                      onClick={() => {
                        setDiscount('UPTO200');
                        copy('UPTO200');
                      }}
                    >
                      UPTO200
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </Dialog>
  );
}

CouponCode.propTypes = { open: PropTypes.bool, handleClose: PropTypes.func, setCoupon: PropTypes.func };
