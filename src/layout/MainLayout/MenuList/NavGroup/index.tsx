import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type Dispatch,
  type SetStateAction
} from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import NavCollapse from '../NavCollapse';
import NavItem from '../NavItem';
import Transitions from 'ui-component/extended/Transitions';
import { useGetMenuMaster } from 'api/menu';
import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import type {
  MenuGroup,
  NavItemType,
  RemainingMenuItem,
  MenuItem as MenuItemType
} from 'types/menu';

import { IconChevronDown, IconChevronRight, IconMinusVertical } from '@tabler/icons-react';

interface NavGroupProps {
  item: MenuGroup;
  lastItem?: number | null;
  remItems: RemainingMenuItem[];
  lastItemId?: string;
  selectedID: string;
  setSelectedID: Dispatch<SetStateAction<string>>;
}

function flattenRemaining(remItems: RemainingMenuItem[]): NavItemType[] {
  return remItems.flatMap((rem) => rem.elements ?? []);
}

export default function NavGroup({
  item,
  lastItem,
  remItems,
  lastItemId,
  selectedID,
  setSelectedID
}: NavGroupProps) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const { pathname } = useLocation();

  const {
    state: { menuOrientation, borderRadius }
  } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = Boolean(menuMaster?.isDashboardDrawerOpened);
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentItem, setCurrentItem] = useState<MenuGroup>(item);

  const openMini = Boolean(anchorEl);
  const popperId = openMini ? `group-pop-${item.id}` : undefined;

  useEffect(() => {
    if (lastItem && item.id === lastItemId) {
      const children = flattenRemaining(remItems);
      setCurrentItem({ ...item, children });
    } else {
      setCurrentItem(item);
    }
  }, [item, lastItem, lastItemId, remItems]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!openMini) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Icon = currentItem.icon as ComponentType<{ stroke?: number; size?: string }> | undefined;
  const itemIcon = Icon ? <Icon stroke={1.5} size="20px" /> : null;

  const items = useMemo(() => {
    return currentItem.children?.map((menu) => {
      switch (menu.type) {
        case 'collapse':
          return <NavCollapse key={menu.id} menu={menu} level={1} parentId={currentItem.id} />;
        case 'item':
          return <NavItem key={menu.id} item={menu} level={1} />;
        case 'group':
          return (
            <Typography key={menu.id} variant="h6" align="center" sx={{ color: 'error.main' }}>
              Menu Items Error
            </Typography>
          );
        default:
          return null;
      }
    });
  }, [currentItem]);

  const moreItems = useMemo(() => {
    return remItems.map((itemRem, index) => (
      <Fragment key={itemRem.id ?? index.toString()}>
        {itemRem.type === 'item' && itemRem.url ? (
          <NavItem
            item={
              {
                id: itemRem.id,
                title: itemRem.title,
                icon: itemRem.icon,
                type: 'item',
                url: itemRem.url,
                link: itemRem.link,
                external: itemRem.external,
                target: itemRem.target,
                breadcrumbs: itemRem.breadcrumbs,
                disabled: itemRem.disabled,
                caption: itemRem.caption,
                chip: itemRem.chip
              } as MenuItemType
            }
            level={1}
          />
        ) : null}
        {itemRem.title && !itemRem.url && (
          <Typography variant="caption" sx={{ pl: 2 }}>
            {itemRem.title} {itemRem.url}
          </Typography>
        )}
        {itemRem.elements?.map((menu) => {
          switch (menu.type) {
            case 'collapse':
              return <NavCollapse key={menu.id} menu={menu} level={1} parentId={currentItem.id} />;
            case 'item':
              return <NavItem key={menu.id} item={menu} level={1} />;
            default:
              return (
                <Typography key={menu.id} variant="h6" align="center" sx={{ color: 'error.main' }}>
                  Menu Items Error
                </Typography>
              );
          }
        })}
      </Fragment>
    ));
  }, [currentItem.id, remItems]);

  const checkOpenForParent = (children: NavItemType[], id: string) => {
    children.forEach((child) => {
      if ('children' in child && child.children?.length) {
        checkOpenForParent(child.children, currentItem.id);
      }
      const childUrl = child.link ?? child.url;
      if (childUrl && matchPath({ path: childUrl, end: true }, pathname)) {
        setSelectedID(id);
      }
    });
  };

  const checkSelectedOnload = (data: MenuGroup) => {
    data.children?.forEach((child) => {
      if ('children' in child && child.children?.length) {
        checkOpenForParent(child.children, currentItem.id);
      }
      const childUrl = child.link ?? child.url;
      if (childUrl && matchPath({ path: childUrl, end: true }, pathname)) {
        setSelectedID(currentItem.id);
      }
    });

    const currentUrl = data.link ?? data.url;
    if (currentUrl && matchPath({ path: currentUrl, end: true }, pathname)) {
      setSelectedID(currentItem.id);
    }
  };

  useEffect(() => {
    checkSelectedOnload(currentItem);
    if (openMini) setAnchorEl(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, currentItem]);

  const isSelected = selectedID === currentItem.id;

  return (
    <>
      {!isHorizontal ? (
        <List
          disablePadding={!drawerOpen}
          subheader={
            currentItem.title &&
            drawerOpen && (
              <Typography
                variant="caption"
                gutterBottom
                sx={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.heading',
                  padding: 0.75,
                  textTransform: 'capitalize',
                  marginTop: 1.25
                }}
              >
                <FormattedMessage id={currentItem.title} />
                {currentItem.caption && (
                  <Typography
                    gutterBottom
                    sx={{
                      display: 'block',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      textTransform: 'capitalize',
                      lineHeight: 1.66
                    }}
                  >
                    <FormattedMessage id={currentItem.caption} />
                  </Typography>
                )}
              </Typography>
            )
          }
        >
          {items}
          {drawerOpen && <Divider sx={{ mt: 0.25, mb: 1.25 }} />}
        </List>
      ) : (
        <List>
          <ListItemButton
            selected={isSelected}
            sx={{
              borderRadius: `${borderRadius}px`,
              p: 1,
              my: 0.5,
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'inherit'
            }}
            onMouseEnter={handleClick}
            onClick={handleClick}
            onMouseLeave={handleClose}
            aria-describedby={popperId}
            className={anchorEl ? 'Mui-selected' : ''}
          >
            {itemIcon && (
              <ListItemIcon sx={{ minWidth: 36 }}>
                {currentItem.id === lastItemId ? (
                  <IconMinusVertical stroke={1.5} size="20px" />
                ) : (
                  itemIcon
                )}
              </ListItemIcon>
            )}
            <ListItemText
              sx={{ mr: 1, mb: 0.25 }}
              primary={
                <Typography variant={isSelected ? 'h5' : 'body1'} sx={{ color: 'inherit' }}>
                  {currentItem.id === lastItemId ? (
                    <FormattedMessage id="more-items" />
                  ) : (
                    <FormattedMessage id={currentItem.title ?? 'menu-group'} />
                  )}
                </Typography>
              }
            />
            {anchorEl ? (
              <IconChevronDown stroke={1.5} size="16px" />
            ) : (
              <IconChevronRight stroke={1.5} size="16px" />
            )}

            {anchorEl && (
              <Popper
                id={popperId}
                open={openMini}
                anchorEl={anchorEl}
                placement="bottom-start"
                sx={{
                  overflow: 'visible',
                  zIndex: 2001,
                  minWidth: 180,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 5,
                    left: 32,
                    width: 12,
                    height: 12,
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 120,
                    borderWidth: '6px',
                    borderStyle: 'solid',
                    borderTopColor: 'background.paper',
                    borderLeftColor: 'background.paper',
                    borderRightColor: 'transparent',
                    borderBottomColor: 'transparent'
                  }
                }}
              >
                {({ TransitionProps }) => (
                  <Transitions sx={{}} in={openMini} {...TransitionProps}>
                    <Paper
                      sx={{
                        mt: 0.5,
                        py: 1.25,
                        boxShadow: theme.shadows[8],
                        backgroundImage: 'none'
                      }}
                    >
                      <ClickAwayListener onClickAway={handleClose}>
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
                          {currentItem.id !== lastItemId ? items : moreItems}
                        </Box>
                      </ClickAwayListener>
                    </Paper>
                  </Transitions>
                )}
              </Popper>
            )}
          </ListItemButton>
        </List>
      )}
    </>
  );
}
