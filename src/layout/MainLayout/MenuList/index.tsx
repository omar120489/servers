import { memo, useMemo, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import NavItem from './NavItem';
import NavGroup from './NavGroup';
import { MenuOrientation, HORIZONTAL_MAX_ITEM } from 'config';
import menuItems from 'menu-items';
import useConfig from 'hooks/useConfig';
import { useGetMenuMaster } from 'api/menu';
import type { NavItemType, MenuGroup, RemainingMenuItem } from 'types/menu';

interface MenuListProps {}

function isGroup(item: NavItemType): item is MenuGroup {
  return item.type === 'group';
}

function MenuList(_props: MenuListProps) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const {
    state: { menuOrientation }
  } = useConfig();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = Boolean(menuMaster?.isDashboardDrawerOpened);
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  const [selectedID, setSelectedID] = useState<string>('');

  const { visibleItems, remainingItems, lastItemId, lastItem } = useMemo(() => {
    const lastItemCount = isHorizontal ? HORIZONTAL_MAX_ITEM : null;

    let lastItemIndex = menuItems.items.length - 1;
    let lastId: string | undefined;
    let rem: RemainingMenuItem[] = [];

    if (lastItemCount && lastItemCount < menuItems.items.length) {
      lastItemIndex = lastItemCount - 1;
      lastId = menuItems.items[lastItemIndex]?.id;
      rem = menuItems.items.slice(lastItemIndex).map((item): RemainingMenuItem => {
        // Cast to any to handle JS menu items with loose types
        const anyItem = item as any;
        const baseItem: RemainingMenuItem = {
          id: anyItem.id,
          elements: anyItem.children ?? []
        };

        // Only add properties that exist on the item
        if (anyItem.title !== undefined) baseItem.title = anyItem.title;
        if (anyItem.icon !== undefined) baseItem.icon = anyItem.icon;
        if (anyItem.url !== undefined) baseItem.url = anyItem.url;
        if (anyItem.type !== undefined) baseItem.type = anyItem.type;
        if (anyItem.caption !== undefined) baseItem.caption = anyItem.caption;
        if (anyItem.target !== undefined) baseItem.target = anyItem.target;
        if (anyItem.external !== undefined) baseItem.external = anyItem.external;
        if (anyItem.breadcrumbs !== undefined) baseItem.breadcrumbs = anyItem.breadcrumbs;
        if (anyItem.disabled !== undefined) baseItem.disabled = anyItem.disabled;
        if (anyItem.chip !== undefined) baseItem.chip = anyItem.chip;

        return baseItem;
      });
    }

    return {
      visibleItems: menuItems.items.slice(0, lastItemIndex + 1),
      remainingItems: rem,
      lastItemId: lastId,
      lastItem: lastItemCount
    };
  }, [isHorizontal]);

  const renderNavItem = (item: NavItemType, index: number) => {
    if (!isGroup(item)) {
      return (
        <Typography key={item.id} variant="h6" align="center" sx={{ color: 'error.main' }}>
          Menu Items Error
        </Typography>
      );
    }

    if (item.url && item.id !== lastItemId) {
      return (
        <List key={item.id}>
          <NavItem item={item} level={1} isParents setSelectedID={() => setSelectedID('')} />
          {!isHorizontal && index !== 0 && <Divider sx={{ py: 0.5 }} />}
        </List>
      );
    }

    return (
      <NavGroup
        key={item.id}
        item={item}
        lastItem={lastItem ?? undefined}
        lastItemId={lastItemId}
        remItems={remainingItems}
        selectedID={selectedID}
        setSelectedID={setSelectedID}
      />
    );
  };

  const renderedItems = visibleItems.map((item, index) =>
    renderNavItem(item as NavItemType, index)
  );

  if (isHorizontal) {
    return <>{renderedItems}</>;
  }

  return <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{renderedItems}</Box>;
}

export default memo(MenuList);
