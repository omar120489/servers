import { apiGet, apiPost, apiPatch } from 'utils/axios';
import type { Notification, NotificationCreateDto, NotificationListResponse } from 'types/api';

/**
 * Map backend snake_case notification to frontend camelCase
 */
function mapNotificationFromDto(dto: Record<string, unknown>): Notification {
  return {
    id: dto.id as string,
    title: dto.title as string,
    message: dto.message as string | undefined,
    type: dto.type as 'info' | 'success' | 'warning' | 'error' | undefined,
    isRead: dto.is_read as boolean,
    userId: dto.user_id as string | undefined,
    entityType: dto.entity_type as string | undefined,
    entityId: dto.entity_id as string | number | undefined,
    createdAt: dto.created_at as string,
    updatedAt: dto.updated_at as string
  };
}

/**
 * Map frontend camelCase notification to backend snake_case
 */
function mapNotificationToDto(notification: NotificationCreateDto): Record<string, unknown> {
  return {
    title: notification.title,
    message: notification.message,
    type: notification.type,
    entity_type: notification.entityType,
    entity_id: notification.entityId
  };
}

/**
 * List all notifications for the current user
 */
export async function listNotifications(): Promise<NotificationListResponse> {
  const response = await apiGet<{ items: Record<string, unknown>[]; total: number }>(
    '/api/v1/notifications'
  );
  return {
    items: response.items.map(mapNotificationFromDto),
    total: response.total
  };
}

/**
 * Create a new notification
 */
export async function createNotification(payload: NotificationCreateDto): Promise<Notification> {
  const dto = mapNotificationToDto(payload);
  const response = await apiPost<Record<string, unknown>>('/api/v1/notifications', dto);
  return mapNotificationFromDto(response);
}

/**
 * Mark a notification as read
 */
export async function markAsRead(id: string | number): Promise<Notification> {
  const response = await apiPatch<Record<string, unknown>>(
    `/api/v1/notifications/${id}/read`,
    {}
  );
  return mapNotificationFromDto(response);
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<void> {
  await apiPatch('/api/v1/notifications/mark-all-read', {});
}

export const notificationsService = {
  listNotifications,
  createNotification,
  markAsRead,
  markAllAsRead
};

