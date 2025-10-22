import { useEffect, useMemo, type ComponentType, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import HorizontalBar from './HorizontalBar';
import MainContentStyled from './MainContentStyled';
import Loader from 'ui-component/Loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

export default function MainLayout() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const {
    state: { borderRadius, container, miniDrawer, menuOrientation }
  } = useConfig();

  const { menuMaster, menuMasterLoading } = useGetMenuMaster() as {
    menuMaster: { isDashboardDrawerOpened: boolean } | undefined;
    menuMasterLoading: boolean;
  };

  const drawerOpen = Boolean(menuMaster?.isDashboardDrawerOpened);

  const StyledMainContent = MainContentStyled as unknown as ComponentType<{
    borderRadius: number;
    menuOrientation: MenuOrientation;
    open: boolean;
    children?: ReactNode;
  }>;
  const BreadcrumbsComponent = Breadcrumbs as ComponentType<Record<string, unknown>>;

  useEffect(() => {
    handlerDrawerOpen(!miniDrawer);
  }, [miniDrawer]);

  useEffect(() => {
    if (downMD) {
      handlerDrawerOpen(false);
    }
  }, [downMD]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  const menu = useMemo<ReactNode>(
    () => (isHorizontal ? <HorizontalBar /> : <Sidebar />),
    [isHorizontal]
  );

  if (menuMasterLoading) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ bgcolor: 'background.default' }}
      >
        <Toolbar sx={{ p: isHorizontal ? 1.25 : 2 }}>
          <Header />
        </Toolbar>
      </AppBar>

      {menu}

      <StyledMainContent
        borderRadius={borderRadius}
        menuOrientation={menuOrientation}
        open={drawerOpen}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowX: 'hidden', // hard stop for horizontal scroll
            overflowY: 'auto',
            width: '100%'
          }}
        >
          <Container
            maxWidth={container ? 'lg' : false}
            sx={{
              ...(!container && { px: { xs: 0 } }),
              minHeight: 'calc(100vh - 128px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <BreadcrumbsComponent />
            <Outlet />
            <Footer />
          </Container>
        </Box>
      </StyledMainContent>
    </Box>
  );
}
