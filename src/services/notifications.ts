import { api } from '../api/client';

export type Notification = {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at?: string;
  entity_type?: string;
  entity_id?: number;
};

export const listNotifications = () => api.get('/notifications').then(r => r.data);
export const markNotificationRead = (id: number) =>
  api.patch(`/notifications/${id}/read`).then(r => r.data);
export const markAllRead = () => api.patch('/notifications/mark-all-read').then(r => r.data);

