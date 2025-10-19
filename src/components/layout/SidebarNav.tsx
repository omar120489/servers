import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import BusinessIcon from '@mui/icons-material/Business';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import RuleIcon from '@mui/icons-material/Rule';
import LinkIcon from '@mui/icons-material/Link';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { label: 'Leads', icon: <ContactPageIcon />, href: '/leads' },
  { label: 'Deals', icon: <ViewKanbanIcon />, href: '/deals' },
  { label: 'Contacts', icon: <ContactPageIcon />, href: '/contacts' },
  { label: 'Companies', icon: <BusinessIcon />, href: '/companies' },
  { label: 'Pipeline', icon: <TimelineIcon />, href: '/pipeline' },
  { label: 'Activities', icon: <FactCheckIcon />, href: '/activities' },
  { label: 'Reports', icon: <BarChartIcon />, href: '/reports' },
  { label: 'Calendar', icon: <CalendarMonthIcon />, href: '/calendar' },
  { label: 'Notifications', icon: <NotificationsIcon />, href: '/notifications' },
  {
    label: 'Admin',
    icon: <SettingsIcon />,
    children: [
      { label: 'Users', icon: <GroupIcon />, href: '/admin/users' },
      { label: 'Roles', icon: <RuleIcon />, href: '/admin/roles' },
      { label: 'Webhooks', icon: <LinkIcon />, href: '/admin/webhooks' },
      { label: 'Audit Log', icon: <FactCheckIcon />, href: '/admin/audit-log' },
      { label: 'Visualization', icon: <PaletteIcon />, href: '/admin/visualization' },
      { label: 'Settings', icon: <SettingsIcon />, href: '/settings' },
      { label: 'Profile', icon: <PersonIcon />, href: '/profile' },
    ],
  },
];

export default function SidebarNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openAdmin, setOpenAdmin] = React.useState(false);

  const handleAdminClick = () => {
    setOpenAdmin(!openAdmin);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <List component="nav" sx={{ px: 1 }}>
      {navItems.map((item, index) => {
        if (item.children) {
          return (
            <React.Fragment key={item.label}>
              <ListItemButton onClick={handleAdminClick}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {openAdmin ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.href}
                      sx={{ pl: 4 }}
                      selected={isActive(child.href)}
                      onClick={() => child.href && navigate(child.href)}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        }

        return (
          <ListItemButton
            key={item.href}
            selected={isActive(item.href)}
            onClick={() => item.href && navigate(item.href)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      })}
    </List>
  );
}

