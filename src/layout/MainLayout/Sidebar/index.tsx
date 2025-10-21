import { memo, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { SxProps, Theme } from '@mui/material/styles';

import MenuCard from './MenuCard';
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';

import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';
import SimpleBar from 'ui-component/third-party/SimpleBar';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

function SidebarComponent() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster() as {
    menuMaster: { isDashboardDrawerOpened: boolean } | undefined;
  };

  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;

  const {
    state: { menuOrientation, miniDrawer }
  } = useConfig();

  const logo = useMemo(
    () => (
      <Box sx={{ display: 'flex', p: 2 }}>
        <LogoSection />
      </Box>
    ),
    []
  );

  const drawer = useMemo(() => {
    const isVerticalOpen = menuOrientation === MenuOrientation.VERTICAL && drawerOpen;
    const drawerContent = (
      <>
        <MenuCard />
        <Stack direction="row" sx={{ justifyContent: 'center', mb: 2 }}>
          <Chip label={import.meta.env.VITE_APP_VERSION || ''} size="small" color="default" />
        </Stack>
      </>
    );

    let drawerSX: SxProps<Theme> = { paddingLeft: '0px', paddingRight: '0px', marginTop: '20px' };
    if (drawerOpen) {
      drawerSX = { paddingLeft: '16px', paddingRight: '16px', marginTop: '0px' };
    }

    return downMD ? (
      <Box sx={drawerSX}>
        <MenuList />
        {isVerticalOpen && drawerContent}
      </Box>
    ) : (
      <SimpleBar sx={{ height: 'calc(100vh - 90px)', ...drawerSX }}>
        <MenuList />
        {isVerticalOpen && drawerContent}
      </SimpleBar>
    );
  }, [downMD, drawerOpen, menuOrientation]);

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }}
      aria-label="primary navigation"
    >
      {downMD || (miniDrawer && drawerOpen) ? (
        <Drawer
          variant={downMD ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          slotProps={{
            paper: {
              sx: {
                mt: downMD ? 0 : 11,
                zIndex: 1099,
                width: drawerWidth,
                bgcolor: 'background.default',
                color: 'text.primary',
                borderRight: 'none'
              }
            }
          }}
          ModalProps={{ keepMounted: true }}
        >
          {downMD && logo}
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {logo}
          {drawer}
        </MiniDrawerStyled>
      )}
    </Box>
  );
}

export default memo(SidebarComponent);
