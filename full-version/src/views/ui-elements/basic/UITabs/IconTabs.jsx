import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import PanoramaTwoToneIcon from '@mui/icons-material/PanoramaTwoTone';

// tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// icon tab style
const AntTabs = styled(Tabs)(({ theme }) => ({
  background: theme.vars.palette.primary.light,
  ...theme.applyStyles('dark', { background: theme.vars.palette.dark[800] }),
  width: 'fit-content',
  borderRadius: '12px'
}));

// style constant
const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  color: theme.vars.palette.secondary.main,
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:hover': {
    color: theme.vars.palette.secondary.main,
    opacity: 1
  },
  '&.Mui-selected': {
    color: theme.vars.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.vars.palette.secondary.main
  }
}));

// ================================|| UI TABS - ICONS ||================================ //

export default function IconTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AntTabs
        value={value}
        onChange={handleChange}
        aria-label="ant example"
        slotProps={{ indicator: { sx: { backgroundColor: theme.vars.palette.secondary.main } } }}
      >
        <AntTab icon={<MenuTwoToneIcon sx={{ fontSize: '1.3rem' }} />} />
        <AntTab icon={<StarTwoToneIcon sx={{ fontSize: '1.3rem' }} />} />
        <AntTab icon={<PanoramaTwoToneIcon sx={{ fontSize: '1.3rem' }} />} />
      </AntTabs>
      <TabPanel value={value} index={0}>
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
        cupidatat skateboard dolor brunch.
      </TabPanel>
      <TabPanel value={value} index={1}>
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
        cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
      </TabPanel>
      <TabPanel value={value} index={2}>
        Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
      </TabPanel>
    </>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
