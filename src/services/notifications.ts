import { api } from '../api/client';
import config from '../config';

export type Notification = {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at?: string;
  entity_type?: string;
  entity_id?: number;
};

const mockNotifications: Notification[] = [
  { id: 1, title: 'New Deal Created', message: 'Enterprise Software License deal was created', is_read: false, entity_type: 'deal', entity_id: 1, created_at: '2024-10-18T08:00:00Z' },
  { id: 2, title: 'Contact Updated', message: 'John Smith updated their profile', is_read: false, entity_type: 'contact', entity_id: 1, created_at: '2024-10-18T09:30:00Z' },
  { id: 3, title: 'Deal Won', message: 'SaaS Subscription deal was marked as won', is_read: true, entity_type: 'deal', entity_id: 9, created_at: '2024-10-17T14:00:00Z' },
];

export const listNotifications = async () => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    return Promise.resolve(mockNotifications);
  }

  // Real API call with fallback
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    return mockNotifications;
  }
};

export const markNotificationRead = async (id: number) => {
  // Demo mode: update mock data
  if (config.isDemoMode) {
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) notification.is_read = true;
    return Promise.resolve({ success: true });
  }

  // Real API call
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllRead = async () => {
  // Demo mode: update all mock data
  if (config.isDemoMode) {
    mockNotifications.forEach(n => n.is_read = true);
    return Promise.resolve({ success: true });
  }

  // Real API call
  const response = await api.patch('/notifications/mark-all-read');
  return response.data;
};

