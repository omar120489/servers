// This is example of menu item without group for horizontal layout. There will be no children.

// assets
import { IconBrandChrome } from '@tabler/icons-react';
import type { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
  IconBrandChrome
} as const;

const samplePage: NavItemType = {
  id: 'sample-page',
  title: 'sample-page',
  icon: icons.IconBrandChrome,
  type: 'group',
  children: [
    {
      id: 'sample-page-item',
      title: 'Sample Page',
      type: 'item',
      url: '/sample-page',
      breadcrumbs: false
    }
  ]
};

export default samplePage;
