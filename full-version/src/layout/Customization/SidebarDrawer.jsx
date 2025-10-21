// material-ui
import CardMedia from '@mui/material/CardMedia';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import useConfig from 'hooks/useConfig';

// assets
import mini from 'assets/images/customization/mini.svg';
import max from 'assets/images/customization/max.svg';

var DrawerType;

(function (DrawerType) {
  DrawerType['MINI'] = 'mini';
  DrawerType['DEFAULT'] = 'default';
})(DrawerType || (DrawerType = {}));

// ==============================|| CUSTOMIZATION - SIDEBAR DRAWER ||============================== //

export default function SidebarDrawer() {
  const {
    state: { miniDrawer },
    setField
  } = useConfig();

  return (
    <Stack direction="row" sx={{ alignItems: 'center', pb: 2, px: 2, justifyContent: 'space-between' }}>
      <Typography variant="h5">SIDEBAR DRAWER</Typography>
      <RadioGroup
        row
        aria-label="layout"
        value={miniDrawer ? DrawerType.MINI : DrawerType.DEFAULT}
        onChange={(e) => setField('miniDrawer', e.target.value === DrawerType.MINI)}
        name="row-radio-buttons-group"
      >
        <Tooltip title="Mini Drawer">
          <FormControlLabel
            control={<Radio value={DrawerType.MINI} sx={{ display: 'none' }} />}
            label={
              <Avatar
                size="md"
                variant="rounded"
                outline
                sx={{ mr: 1.25, width: 48, height: 48, ...(!miniDrawer && { borderColor: 'divider' }) }}
              >
                <CardMedia component="img" src={mini} alt="defaultLayout" sx={{ width: 34, height: 34 }} />
              </Avatar>
            }
          />
        </Tooltip>
        <Tooltip title="Default">
          <FormControlLabel
            control={<Radio value={DrawerType.DEFAULT} sx={{ display: 'none' }} />}
            label={
              <Avatar size="md" variant="rounded" outline sx={{ width: 48, height: 48, ...(miniDrawer && { borderColor: 'divider' }) }}>
                <CardMedia component="img" src={max} alt="defaultLayout" sx={{ width: 34, height: 34 }} />
              </Avatar>
            }
          />
        </Tooltip>
      </RadioGroup>
    </Stack>
  );
}
