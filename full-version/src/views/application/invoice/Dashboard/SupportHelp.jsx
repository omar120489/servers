import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { withAlpha } from 'utils/colorUtils';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ReceiptTwoTone from '@mui/icons-material/ReceiptTwoTone';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonAddTwoTone from '@mui/icons-material/PersonAddTwoTone';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import BugReportIcon from '@mui/icons-material/BugReport';

// tab content customize
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ================================|| SUPPORT & HELP TABS ||================================ //

function SupportTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tipsData = [
    { name: 'Invoice detail', icon: <ReceiptTwoTone color="success" />, background: withAlpha(theme.vars.palette.success.dark, 0.1) },
    { name: 'How to add client', icon: <PersonAddTwoTone color="primary" />, background: withAlpha(theme.vars.palette.primary.dark, 0.1) },
    { name: 'How to add bill', icon: <ReceiptLongIcon color="secondary" />, background: withAlpha(theme.vars.palette.secondary.dark, 0.1) },
    { name: 'Create invoice', icon: <InsertChartIcon color="warning" />, background: withAlpha(theme.vars.palette.warning.dark, 0.1) },
    { name: 'Generate Error', icon: <BugReportIcon color="error" />, background: withAlpha(theme.vars.palette.orange.dark, 0.1) }
  ];

  return (
    <>
      <Tabs
        value={value}
        variant="scrollable"
        onChange={handleChange}
        slotProps={{ indicator: { sx: { bottom: 'inherit' } } }}
        sx={{
          mb: 3,
          '& .MuiTab-root': { minHeight: 'auto', minWidth: 10, py: 1.5, px: 1, mr: 2.2 }
        }}
      >
        <Tab label="Quick Tips" {...a11yProps(0)} />
        <Tab label="Request for demo" {...a11yProps(1)} />
        <Tab label="How to make invoice?" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2.5}>
          {tipsData.map((data, index) => (
            <Grid key={index} size={12}>
              <Grid container direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid>
                  <Grid container spacing={1.5} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.largeAvatar,
                          borderRadius: 2,
                          bgcolor: data.background
                        }}
                      >
                        {data.icon}
                      </Avatar>
                    </Grid>
                    <Grid>
                      <Typography variant="h5" sx={{ color: 'inherit' }}>
                        {data.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid>
                  <Button variant="text">View</Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <CardActions sx={{ p: 1.5, pb: 0, mb: -1, justifyContent: 'center' }}>
          <Button size="small" disableElevation endIcon={<ChevronRightOutlinedIcon />}>
            View All
          </Button>
        </CardActions>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField fullWidth maxRows={4} id="outlined-textarea" label="Name" placeholder="Name" defaultValue="Robin" />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              maxRows={4}
              id="outlined-textarea"
              label="Phone number"
              placeholder="Phone number"
              defaultValue="000 000 0000"
            />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth id="outlined-multiline-static" label="Email ID" defaultValue="codedthemes@gmail.com" />
          </Grid>
          <Grid size={12}>
            <Stack sx={{ alignItems: 'flex-end', gap: 2 }}>
              <TextField
                fullWidth
                id="outlined-multiline-flexible"
                label="Description"
                multiline
                rows={2}
                defaultValue="Silver Business Point, nr. VIP Circle, Uttran, Surat, Gujarat 394105"
              />
              <Button variant="contained" size="small">
                Request a demo
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CardMedia
          sx={{ width: '100%', height: 320, borderRadius: 2 }}
          component="iframe"
          src="https://www.youtube.com/embed/IXdBDo3URuw?si=js-VZNTkVBS_h6N0"
          title="image"
        />
      </TabPanel>
    </>
  );
}

export default function SupportHelp({ isLoading }) {
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard title="Support & Help">
          <SupportTabs />
        </MainCard>
      )}
    </>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };

SupportHelp.propTypes = { isLoading: PropTypes.bool };
