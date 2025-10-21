import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

// project imports
import Profile from './Profile';
import PersonalAccount from './PersonalAccount';
import MyAccount from './MyAccount';
import ChangePassword from './ChangePassword';
import Settings from './Settings';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';

// tabs panel
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// tabs option
const tabsOption = [
  {
    label: 'Profile',
    icon: <AccountCircleTwoToneIcon sx={{ fontSize: '1.3rem' }} />
  },
  {
    label: 'Personal Details',
    icon: <DescriptionTwoToneIcon sx={{ fontSize: '1.3rem' }} />
  },
  {
    label: 'My Account',
    icon: <LibraryBooksTwoToneIcon sx={{ fontSize: '1.3rem' }} />
  },
  {
    label: 'Change Password',
    icon: <LockTwoToneIcon sx={{ fontSize: '1.3rem' }} />
  },
  {
    label: 'Settings',
    icon: <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
  }
];

// ==============================|| PROFILE 1 ||============================== //

export default function Profile1() {
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid size={12}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="simple tabs example"
            variant="scrollable"
            slotProps={{ indicator: { sx: { bottom: 2 } } }}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.25,
                color: 'grey.900',
                ...theme.applyStyles('dark', { color: 'grey.600' })
              },
              '& .Mui-selected': {
                color: 'primary.main'
              },
              '& .MuiTab-root > svg': {
                marginBottom: '0px !important',
                mr: 1.25
              }
            }}
          >
            {tabsOption.map((tab, index) => (
              <Tab key={index} icon={tab.icon} label={tab.label} iconPosition="start" {...a11yProps(index)} />
            ))}
          </Tabs>
          <TabPanel value={value} index={0}>
            <Profile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PersonalAccount />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <MyAccount />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <ChangePassword />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Settings />
          </TabPanel>
        </Grid>
      </Grid>
    </MainCard>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
