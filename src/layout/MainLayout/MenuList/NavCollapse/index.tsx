import { useEffect, useRef, useState, type ComponentType } from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import NavItem from '../NavItem';
import Transitions from 'ui-component/extended/Transitions';
import { useGetMenuMaster } from 'api/menu';
import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import useMenuCollapse from 'hooks/useMenuCollapse';
import type { MenuCollapse as MenuCollapseType, NavItemType } from 'types/menu';

import { IconChevronDown, IconChevronRight, IconChevronUp } from '@tabler/icons-react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const PopperStyled = styled(Popper)(({ theme }) => ({
  overflow: 'visible',
  zIndex: 1202,
  minWidth: 180,
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 34,
    left: -5,
    width: 12,
    height: 12,
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 120,
    borderWidth: '6px',
    borderStyle: 'solid',
    borderColor: `transparent transparent ${theme.palette.background.paper} ${theme.palette.background.paper}`
  },
  '&[data-popper-placement="left-start"]:before': {
    left: 'auto',
    right: -5,
    borderColor: `${theme.palette.background.paper} ${theme.palette.background.paper} transparent transparent`
  },
  '&[data-popper-placement="left-end"]:before': {
    top: 'auto',
    bottom: 15,
    left: 'auto',
    right: -5,
    borderColor: `${theme.palette.background.paper} ${theme.palette.background.paper} transparent transparent`
  },
  '&[data-popper-placement="right-end"]:before': {
    top: 'auto',
    bottom: 15
  }
}));

interface NavCollapseProps {
  menu: MenuCollapseType;
  level: number;
  parentId?: string;
}

export default function NavCollapse({ menu, level, parentId }: NavCollapseProps) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const {
    state: { menuOrientation, borderRadius }
  } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = Boolean(menuMaster?.isDashboardDrawerOpened);
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openMini = Boolean(anchorEl);
  const popperId = openMini ? `collapse-pop-${menu.id}` : undefined;

  const handleClickMini = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
    if (drawerOpen) {
      setOpen((prev) => !prev);
      setSelected((prev) => (prev ? null : menu.id));
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleHover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMiniClose = () => {
    setAnchorEl(null);
  };

  const { pathname } = useLocation();

  useMenuCollapse(menu, pathname, openMini, setSelected, setOpen, setAnchorEl);

  useEffect(() => {
    if (menu.url === pathname) {
      setSelected(menu.id);
      setAnchorEl(null);
      setOpen(true);
    }
  }, [pathname, menu]);

  const Icon = menu.icon as ComponentType<{ strokeWidth?: number; size?: string }> | undefined;
  const menuIcon = Icon ? (
    <Icon strokeWidth={1.5} size={drawerOpen ? '20px' : '24px'} aria-hidden />
  ) : (
    <FiberManualRecordIcon
      sx={{ width: selected === menu.id ? 8 : 6, height: selected === menu.id ? 8 : 6 }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  const collapseIcon = drawerOpen ? (
    <IconChevronUp stroke={1.5} size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
  ) : (
    <IconChevronRight
      stroke={1.5}
      size="16px"
      style={{ marginTop: 'auto', marginBottom: 'auto' }}
    />
  );

  const renderChildren = (children: NavItemType[] | undefined, nextLevel: number) =>
    children?.map((child) => {
      if (child.type === 'collapse') {
        return (
          <NavCollapse
            key={child.id}
            menu={child as any}
            level={nextLevel}
            parentId={parentId ?? menu.id}
          />
        );
      }
      if (child.type === 'item' || child.type === 'group') {
        return <NavItem key={child.id} item={child} level={nextLevel} />;
      }
      // Fallback for unexpected types
      return (
        <Typography
          key={(child as any).id || 'error'}
          variant="h6"
          align="center"
          sx={{ color: 'error.main' }}
        >
          Menu Items Error
        </Typography>
      );
    });

  return (
    <>
      {!isHorizontal ? (
        <>
          <ListItemButton
            sx={{
              zIndex: 1201,
              borderRadius: `${borderRadius}px`,
              mb: 0.5,
              ...(drawerOpen && level !== 1 && { ml: `${level * 18}px` }),
              ...(!drawerOpen && { pl: 1.25 }),
              ...((!drawerOpen || level !== 1) && {
                py: level === 1 ? 0 : 1,
                '&:hover': { bgcolor: 'transparent' },
                '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
              })
            }}
            selected={selected === menu.id}
            onClick={handleClickMini}
            aria-expanded={selected === menu.id}
            aria-controls={`${menu.id}-collapse`}
            aria-haspopup={menu.children && menu.children.length ? 'true' : undefined}
          >
            <ListItemIcon
              ref={labelRef}
              sx={{
                my: 'auto',
                minWidth: level === 1 ? 36 : 18,
                color: selected === menu.id ? 'secondary.main' : 'text.primary',
                ...theme.applyStyles('dark', {
                  color: selected === menu.id && drawerOpen ? 'text.primary' : 'text.primary'
                })
              }}
            >
              {menuIcon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant={selected === menu.id ? 'h5' : 'body1'}
                  sx={{ color: 'inherit' }}
                >
                  <FormattedMessage id={menu.title ?? 'menu-collapse'} />
                </Typography>
              }
              secondary={
                menu.caption && (
                  <Typography
                    variant="caption"
                    gutterBottom
                    sx={{
                      display: 'block',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      textTransform: 'capitalize'
                    }}
                  >
                    <FormattedMessage id={menu.caption} />
                  </Typography>
                )
              }
            />
            {collapseIcon}
          </ListItemButton>

          <Collapse
            in={open && !openMini}
            timeout="auto"
            unmountOnExit
            sx={{ overflow: 'hidden' }}
            id={`${menu.id}-collapse`}
            role="group"
            aria-label={menu.title}
          >
            <List disablePadding sx={{ position: 'relative' }}>
              {renderChildren(menu.children, level + 1)}
            </List>
          </Collapse>
        </>
      ) : (
        <>
          <ListItemButton
            onMouseEnter={handleHover}
            onClick={handleHover}
            onMouseLeave={handleMiniClose}
            aria-describedby={popperId}
            className={openMini ? 'Mui-selected' : ''}
            aria-haspopup={menu.children && menu.children.length ? 'true' : undefined}
            sx={{
              borderRadius: `${borderRadius}px`,
              p: 1,
              my: 0.5,
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'inherit'
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{menuIcon}</ListItemIcon>
            <ListItemText
              sx={{ mr: 1, mb: 0.25 }}
              primary={
                <Typography variant="body1" sx={{ color: 'inherit' }}>
                  <FormattedMessage id={menu.title ?? 'menu-collapse'} />
                </Typography>
              }
            />
            {anchorEl ? (
              <IconChevronDown stroke={1.5} size="16px" />
            ) : (
              <IconChevronRight stroke={1.5} size="16px" />
            )}

            {anchorEl && (
              <PopperStyled
                id={popperId}
                open={openMini}
                anchorEl={anchorEl}
                placement="right-start"
              >
                {({ TransitionProps }) => (
                  <Transitions sx={{}} in={openMini} {...TransitionProps}>
                    <Paper
                      sx={{
                        mt: 2.5,
                        py: 1.25,
                        boxShadow: theme.shadows[8],
                        backgroundImage: 'none'
                      }}
                    >
                      <ClickAwayListener onClickAway={handleMiniClose}>
                        <Box
                          sx={{
                            minWidth: 200,
                            maxHeight: 'calc(100vh - 170px)',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                              opacity: 0,
                              width: 4,
                              '&:hover': {
                                opacity: 0.7
                              }
                            },
                            '&::-webkit-scrollbar-track': {
                              bgcolor: 'transparent'
                            },
                            '&::-webkit-scrollbar-thumb': {
                              bgcolor: 'divider',
                              borderRadius: 4
                            }
                          }}
                        >
                          {renderChildren(menu.children, level + 1)}
                        </Box>
                      </ClickAwayListener>
                    </Paper>
                  </Transitions>
                )}
              </PopperStyled>
            )}
          </ListItemButton>
        </>
      )}
    </>
  );
}
