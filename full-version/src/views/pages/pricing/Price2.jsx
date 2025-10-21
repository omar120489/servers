import React from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';

// project imports
import { ThemeDirection } from 'config';
import { gridSpacing } from 'store/constant';
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';

// assets
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircle';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

// styles
const FeatureTitleWrapper = styled(CardContent)(({ theme }) => ({
  background: `${theme.vars.palette.grey[100]} !important`,
  ...theme.applyStyles('dark', { background: `${theme.vars.palette.background.default} !important` }),
  textAlign: 'left',
  paddingTop: 12,
  paddingBottom: '12px !important'
}));

const FeatureContentWrapper = styled(CardContent)(({ theme }) => ({
  borderLeft: '1px solid',
  borderColor: `${theme.vars.palette.grey[200]} !important`,
  ...theme.applyStyles('dark', { borderColor: `${theme.vars.palette.background.default} !important` }),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('lg')]: {
    fontSize: '1.25rem',
    padding: '40px 16px'
  }
}));

const PopularBadgeWrapper = styled('div')(({ theme }) => ({
  background: theme.vars.palette.secondary.main,
  color: '#fff',
  display: 'inline-block',
  padding: '40px 40px 5px',
  fontSize: '0.8125rem',
  position: 'absolute',
  top: -24,
  right: -55
}));

const plans = [
  {
    id: 1,
    popular: false,
    title: 'Starters',
    price: {
      monthly: 25,
      yearly: 225
    }
  },
  {
    id: 2,
    popular: true,
    title: 'Scalability',
    price: {
      monthly: 125,
      yearly: 825
    }
  },
  {
    id: 3,
    popular: false,
    title: 'Enterprise',
    price: {
      monthly: 225,
      yearly: 1025
    }
  }
];

const planList = [
  {
    type: 'group',
    label: 'Features'
  },
  {
    type: 'list',
    label: 'Only 1 User uses',
    permission: [1, 1, 1]
  },
  {
    type: 'list',
    label: '10 Projects for',
    permission: [0, 1, 1]
  },
  {
    type: 'list',
    label: 'Unlimited Bandwidth',
    permission: [0, 0, 1]
  },
  {
    type: 'list',
    label: 'Unlimited Data',
    permission: [0, 0, 1]
  },
  {
    type: 'group',
    label: 'Storage & Security'
  },
  {
    type: 'list',
    label: '5GB of Storage',
    permission: [0, 1, 1]
  },
  {
    type: 'list',
    label: 'Fully Security Suite',
    permission: [0, 0, 1]
  }
];

const PlanList = ({ plan, view, priceFlag }) => {
  const {
    state: { themeDirection }
  } = useConfig();

  return (
    <Grid sx={{ display: view !== plan.id ? { xs: 'none', sm: 'block' } : 'block' }} size={{ xs: 12, sm: 3, md: 3 }}>
      <FeatureContentWrapper>
        {plan.popular && (
          <PopularBadgeWrapper sx={{ transform: themeDirection === ThemeDirection.RTL ? 'rotate(316deg)' : 'rotate(45deg)' }}>
            Popular
          </PopularBadgeWrapper>
        )}
        <Grid container spacing={gridSpacing}>
          <Grid size={12}>
            <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 500, position: 'relative', color: 'primary.main' }}>
              {plan.title}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '1.25rem', lg: '1.5rem' },
                fontWeight: 700,
                '& > span': { fontSize: { xs: '1rem', lg: '1.25rem' }, fontWeight: 500 }
              }}
            >
              <sup>$</sup>
              {priceFlag === 'yearly' ? plan.price.yearly : plan.price.monthly}
              <span>/{priceFlag === 'yearly' ? 'Year' : 'Month'}</span>
            </Typography>
          </Grid>
        </Grid>
      </FeatureContentWrapper>
    </Grid>
  );
};

const ListItem = ({ item, index, view }) => (
  <Grid sx={{ display: view !== index + 1 ? { xs: 'none', sm: 'block' } : 'block' }} size={{ xs: 4, sm: 3, md: 3 }}>
    {item === 1 && (
      <Box sx={{ px: 3, py: 1.5 }}>
        <CheckCircleTwoToneIcon sx={{ color: 'success.dark' }} />
      </Box>
    )}
    {item === 0 && (
      <Box sx={{ px: 3, py: 1.5 }}>
        <RemoveRoundedIcon sx={{ opacity: '0.3' }} />
      </Box>
    )}
  </Grid>
);

const OrderButton = ({ view, index, popular }) => (
  <Grid sx={{ display: view !== index ? { xs: 'none', sm: 'block' } : 'block' }} size={{ xs: 12, sm: 3, md: 3 }}>
    <FeatureContentWrapper>
      <Button variant={popular ? 'contained' : 'outlined'} color={popular ? 'secondary' : 'primary'}>
        Order Now
      </Button>
    </FeatureContentWrapper>
  </Grid>
);

// =============================|| PRICING - PRICE 2 ||============================= //

export default function Price2() {
  const theme = useTheme();
  const {
    state: { themeDirection }
  } = useConfig();

  const [priceFlag, setPriceFlag] = React.useState('monthly');

  const [view, setView] = React.useState(1);
  const handleChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Alert variant="outlined" severity="info">
          <AlertTitle>Note</AlertTitle>
          <Typography>
            The pricing provided is for demonstration purposes only. For actual product pricing, please refer to the official
            <Link
              sx={{
                textDecoration: 'none',
                ml: 0.5,
                color: 'primary.main',
                ...(themeDirection === ThemeDirection.RTL && { mr: 0.5, ml: 0 })
              }}
              variant="subtitle1"
              target="_blank"
              href="https://mui.com/store/items/berry-react-material-admin/"
            >
              pricing page
            </Link>
          </Typography>
        </Alert>
      </Grid>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <ButtonGroup disableElevation variant="contained">
            <Button
              size="large"
              sx={{ bgcolor: priceFlag === 'yearly' ? 'primary.main' : 'primary.200' }}
              onClick={() => setPriceFlag('yearly')}
            >
              Annual
            </Button>
            <Button
              size="large"
              sx={{ bgcolor: priceFlag === 'monthly' ? 'primary.main' : 'primary.200' }}
              onClick={() => setPriceFlag('monthly')}
            >
              Monthly
            </Button>
          </ButtonGroup>
        </Stack>
      </Grid>
      <Grid sx={{ display: { xs: 'block', sm: 'none' } }} size={12}>
        <Card>
          <CardContent>
            <ToggleButtonGroup
              orientation="vertical"
              value={view}
              exclusive
              onChange={handleChange}
              sx={{
                width: '100%',
                '& > button': {
                  border: 'none',
                  borderRadius: '5px ​!important'
                },
                '& > button.Mui-selected': {
                  bgcolor: `${theme.vars.palette.background.default}!important`,
                  color: 'primary.main'
                }
              }}
            >
              {plans.map((plan, index) => (
                <ToggleButton key={index} value={plan.id}>
                  {plan.title}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <MainCard content={false} sx={{ textAlign: 'center' }}>
          <Grid container spacing={0}>
            <Grid size={{ xs: 12, sm: 3, md: 3 }} />
            {plans.map((plan, index) => (
              <PlanList plan={plan} view={view} priceFlag={priceFlag} key={index} />
            ))}
          </Grid>
          {planList.map((list, index) => (
            <React.Fragment key={index}>
              {list.type === 'group' && (
                <FeatureTitleWrapper>
                  <Typography variant="subtitle1">{list.label}</Typography>
                </FeatureTitleWrapper>
              )}
              {list.type === 'list' && (
                <Grid
                  container
                  spacing={0}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: `${theme.vars.palette.grey[200]} !important`,
                    ...theme.applyStyles('dark', { borderColor: `${theme.vars.palette.background.default} !important` })
                  }}
                >
                  <Grid size={{ xs: 12, sm: 3, md: 3 }}>
                    <Box sx={{ px: 3, py: 1.5 }}>
                      <Typography variant="body2" align="left">
                        {list.label}
                      </Typography>
                    </Box>
                  </Grid>
                  {list.permission?.map((item, i) => (
                    <ListItem key={i} item={item} index={index} view={view} />
                  ))}
                </Grid>
              )}
            </React.Fragment>
          ))}
          <Grid container spacing={0}>
            <Grid size={{ xs: 12, sm: 3, md: 3 }} />
            <OrderButton view={view} index={1} />
            <OrderButton view={view} index={2} popular />
            <OrderButton view={view} index={3} />
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}
