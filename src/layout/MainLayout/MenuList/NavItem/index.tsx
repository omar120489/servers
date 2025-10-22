import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { MenuOrientation, ThemeDirection } from 'config';
import useConfig from 'hooks/useConfig';
import { withAlpha } from 'utils/colorUtils';
import type { NavItemType } from 'types/menu';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import NotificationsBadge from './NotificationsBadge';

interface NavItemProps {
  readonly item: NavItemType;
  readonly level?: number;
  readonly isParents?: boolean;
  readonly setSelectedID?: () => void;
}

export default function NavItem({
  item,
  level = 1,
  isParents = false,
  setSelectedID
}: NavItemProps) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const { pathname } = useLocation();
  const {
    state: { menuOrientation, borderRadius, themeDirection }
  } = useConfig();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = Boolean(menuMaster?.isDashboardDrawerOpened);
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  const matchUrl = item.link ?? item.url ?? '';
  const isSelected = Boolean(matchUrl && matchPath({ path: matchUrl, end: false }, pathname));
  const ariaCurrent = isSelected ? 'page' : undefined;

  const [hoverStatus, setHoverStatus] = useState(false);

  useEffect(() => {
    const compareSize = () => {
      const label = labelRef.current;
      if (!label) return;
      setHoverStatus(label.scrollWidth > label.clientWidth);
    };

    compareSize();
    window.addEventListener('resize', compareSize);
    return () => window.removeEventListener('resize', compareSize);
  }, []);

  const Icon = item.icon;
  const iconSize = drawerOpen ? '20px' : '24px';
  const iconStroke = 1.5;
  const iconStyle = isHorizontal && isParents ? { fontSize: 20, stroke: '1.5' } : undefined;
  
  // Extract icon rendering logic to reduce nesting
  let itemIcon;
  if (Icon) {
    if (item.id === 'notifications') {
      itemIcon = <NotificationsBadge icon={Icon} size={iconSize} stroke={iconStroke} style={iconStyle} />;
    } else {
      itemIcon = <Icon stroke={iconStroke} size={iconSize} style={iconStyle} />;
    }
  } else {
    itemIcon = (
      <FiberManualRecordIcon
        sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }}
        fontSize={level > 0 ? 'inherit' : 'medium'}
      />
    );
  }

  const itemTarget = item.target ? '_blank' : '_self';

  const handleClick = () => {
    if (downMD) handlerDrawerOpen(false);
    if (isParents && setSelectedID) {
      setSelectedID();
    }
  };

  const chip = item.chip;

  if (isHorizontal) {
    return (
      <ListItemButton
        component={Link}
        to={matchUrl}
        target={itemTarget}
        disabled={item.disabled}
        sx={{
          borderRadius: isParents ? `${borderRadius}px` : 0,
          mb: isParents ? 0 : 0.5,
          alignItems: 'flex-start',
          backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
          py: 1,
          pl: 2,
          mr: isParents ? 1 : 0
        }}
        selected={isSelected}
        onClick={handleClick}
        aria-current={ariaCurrent}
      >
        <ListItemIcon sx={{ my: 'auto', minWidth: item.icon ? 36 : 18 }}>{itemIcon}</ListItemIcon>
        <ListItemText
          sx={{ mb: 0.25 }}
          primary={
            <Typography variant={isSelected ? 'h5' : 'body1'} sx={{ color: 'inherit' }}>
              <FormattedMessage id={item.title ?? 'menu-item'} />
            </Typography>
          }
          secondary={
            item.caption && (
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
                {item.caption}
              </Typography>
            )
          }
        />

        {chip && (
          <Chip
            color={chip.color}
            variant={chip.variant}
            size={chip.size}
            label={chip.label}
            avatar={chip.avatar ? <Avatar>{chip.avatar}</Avatar> : undefined}
          />
        )}
      </ListItemButton>
    );
  }

  return (
    <ListItemButton
      component={Link}
      to={matchUrl}
      target={itemTarget}
      disabled={item.disabled}
      disableRipple={!drawerOpen}
      sx={{
        zIndex: 1201,
        borderRadius: `${borderRadius}px`,
        mb: 0.5,
        ...(drawerOpen && level !== 1 && { ml: `${level * 18}px` }),
        ...(!drawerOpen && { pl: 1.25 }),
        ...((!drawerOpen || level !== 1) && {
          py: level === 1 ? 0 : 1,
          '&:hover': { bgcolor: 'transparent' },
          '&.Mui-selected': {
            '&:hover': { bgcolor: 'transparent' },
            bgcolor: 'transparent'
          }
        })
      }}
      selected={isSelected}
      onClick={handleClick}
      aria-current={ariaCurrent}
    >
      <ButtonBase
        aria-label="theme-icon"
        sx={{ borderRadius: `${borderRadius}px` }}
        disableRipple={drawerOpen}
      >
        <ListItemIcon
          sx={{
            minWidth: level === 1 ? 36 : 18,
            color: isSelected ? 'secondary.main' : 'text.primary',
            ...(!drawerOpen &&
              level === 1 && {
                borderRadius: `${borderRadius}px`,
                width: 46,
                height: 46,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': { bgcolor: 'secondary.light' },
                ...(isSelected && {
                  bgcolor: 'secondary.light',
                  '&:hover': { bgcolor: 'secondary.light' }
                })
              }),

            ...theme.applyStyles('dark', {
              color: 'text.primary',
              ...(!drawerOpen &&
                level === 1 && {
                  '&:hover': { bgcolor: withAlpha(theme.palette.secondary.main, 0.25) },
                  ...(isSelected && {
                    bgcolor: withAlpha(theme.palette.secondary.main, 0.25),
                    '&:hover': { bgcolor: withAlpha(theme.palette.secondary.main, 0.3) }
                  })
                })
            })
          }}
        >
          {itemIcon}
        </ListItemIcon>
      </ButtonBase>

      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <Tooltip
          title={<FormattedMessage id={item.title ?? 'menu-item'} />}
          disableHoverListener={!hoverStatus}
        >
          <ListItemText
            primary={
              <Typography
                ref={labelRef}
                noWrap
                variant={isSelected ? 'h5' : 'body1'}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 102,
                  color: 'inherit',
                  ...(themeDirection === ThemeDirection.RTL && {
                    textAlign: 'end',
                    direction: 'rtl'
                  })
                }}
              >
                <FormattedMessage id={item.title ?? 'menu-item'} />
              </Typography>
            }
            secondary={
              item.caption && (
                <Typography
                  variant="caption"
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
                  <FormattedMessage id={item.caption} />
                </Typography>
              )
            }
          />
        </Tooltip>
      )}

      {chip && (
        <Chip
          color={chip.color}
          variant={chip.variant}
          size={chip.size}
          label={chip.label}
          avatar={chip.avatar ? <Avatar>{chip.avatar}</Avatar> : undefined}
        />
      )}
    </ListItemButton>
  );
}
