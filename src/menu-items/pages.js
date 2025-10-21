// assets
import {
  IconKey,
  IconReceipt2,
  IconBug,
  IconBellRinging,
  IconPhoneCall,
  IconQuestionMark,
  IconShieldLock,
  IconFileInvoice,
  IconUsers,
  IconChartLine
} from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconReceipt2,
  IconBug,
  IconBellRinging,
  IconPhoneCall,
  IconQuestionMark,
  IconShieldLock,
  IconFileInvoice,
  IconUsers,
  IconChartLine
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'pages',
  caption: 'pages-caption',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'contacts',
      title: 'contacts',
      type: 'item',
      url: '/contacts',
      icon: icons.IconPhoneCall,
      breadcrumbs: false
    },
    {
      id: 'companies',
      title: 'companies',
      type: 'item',
      url: '/companies',
      icon: icons.IconReceipt2,
      breadcrumbs: false
    },
    {
      id: 'leads',
      title: 'leads',
      type: 'item',
      url: '/leads',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'deals',
      title: 'deals',
      type: 'item',
      url: '/deals',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: 'analytics',
      title: 'analytics',
      type: 'item',
      url: '/analytics',
      icon: icons.IconChartLine,
      breadcrumbs: true
    },
    {
      id: 'maintenance',
      title: 'maintenance',
      type: 'collapse',
      icon: icons.IconBug,
      children: [
        {
          id: 'error',
          title: 'error-404',
          type: 'item',
          url: '/pages/error',
          target: true
        },
        {
          id: '500',
          title: 'error-500',
          type: 'item',
          url: '/pages/500',
          target: true
        },
        {
          id: 'coming-soon',
          title: 'coming-soon',
          type: 'collapse',
          children: [
            {
              id: 'coming-soon1',
              title: 'coming-soon 01',
              type: 'item',
              url: '/pages/coming-soon1',
              target: true
            },
            {
              id: 'coming-soon2',
              title: 'coming-soon 02',
              type: 'item',
              url: '/pages/coming-soon2',
              target: true
            }
          ]
        },
        {
          id: 'under-construction',
          title: 'under-construction',
          type: 'item',
          url: '/pages/under-construction',
          target: true
        }
      ]
    }
  ]
};

export default pages;
