import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

// project imports
import Details from './Details';
import Invoice from './Invoice';
import Status from './Status';

import MainCard from 'ui-component/cards/MainCard';

// assets
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';

// tab content
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

// ==============================|| ORDER DETAILS ||============================== //

export default function OrderDetails() {
  const theme = useTheme();

  // set selected tab
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        variant="scrollable"
        aria-label="simple tabs example"
        sx={{
          '& .MuiTab-root': {
            minHeight: 'auto',
            minWidth: 10,
            px: 1,
            py: 1.5,
            mr: 2.25,
            color: 'grey.900',
            ...theme.applyStyles('dark', { color: 'grey.600' })
          },
          '& .Mui-selected': {
            color: 'primary.main'
          },
          '& .MuiTab-root > svg': {
            marginBottom: '0px !important',
            marginRight: 1.25
          },
          mb: 3
        }}
      >
        <Tab icon={<DescriptionTwoToneIcon />} label="Details" iconPosition="start" {...a11yProps(0)} />
        <Tab icon={<ReceiptTwoToneIcon />} label="Invoice" iconPosition="start" {...a11yProps(1)} />
        <Tab icon={<LocalShippingTwoToneIcon />} label="Status" iconPosition="start" {...a11yProps(2)} />
      </Tabs>

      {/* tab - details */}
      <TabPanel value={value} index={0}>
        <Details />
      </TabPanel>

      {/* tab - invoice */}
      <TabPanel value={value} index={1}>
        <Invoice />
      </TabPanel>

      {/* tab - status */}
      <TabPanel value={value} index={2}>
        <Status />
      </TabPanel>
    </MainCard>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
