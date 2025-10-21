import { useEffect } from 'react';
import { matchPath } from 'react-router-dom';

import type { NavItemType, SetBoolean, SetHTMLElement, SetString } from 'types/menu';

// ==============================|| MENU COLLAPSED - RECURSIVE FUNCTION ||============================== //

/**
 * Recursively traverses menu items to find and open the correct parent menu.
 * If a menu item matches the current pathname, it marks the corresponding menu as selected and opens it.
 */
function setParentOpenedMenu(
  items: NavItemType[],
  pathname: string,
  menuId: string | undefined,
  setSelected: SetString,
  setOpen: SetBoolean
): void {
  for (const item of items) {
    if ('children' in item && item.children?.length) {
      setParentOpenedMenu(item.children, pathname, menuId, setSelected, setOpen);
    }

    const matchesLink = item.link && matchPath({ path: item.link, end: false }, pathname);
    const matchesUrl = item.url === pathname;

    if (matchesLink || matchesUrl) {
      setSelected(menuId ?? null);
      setOpen(true);
    }
  }
}

// ==============================|| MENU COLLAPSED - HOOK ||============================== //

/**
 * Hook to handle menu collapse behavior based on the current route.
 * Automatically expands the parent menu of the active route item.
 */
export default function useMenuCollapse(
  menu: NavItemType,
  pathname: string,
  miniMenuOpened: boolean,
  setSelected: SetString,
  setOpen: SetBoolean,
  setAnchorEl: SetHTMLElement
): void {
  useEffect(() => {
    setOpen(false);
    !miniMenuOpened ? setSelected(null) : setAnchorEl(null);

    if ('children' in menu && menu.children?.length) {
      setParentOpenedMenu(menu.children, pathname, menu.id, setSelected, setOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, (menu as any).children]);
}
