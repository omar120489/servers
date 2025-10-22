import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { useWebSocketEvents } from './useWebSocketEvents';
import { useNotificationPreferences } from './useNotificationPreferences';
import type { Attachment, Comment, Notification } from 'types/api';

/**
 * Hook to display toast notifications for WebSocket events
 *
 * This hook subscribes to various WebSocket events and displays
 * snackbar toasts when events occur. It should be mounted once
 * at the app root level.
 *
 * Events handled:
 * - comment:new → info variant
 * - comment:updated → info variant
 * - comment:deleted → default variant
 * - attachment:uploaded → success variant
 * - attachment:deleted → default variant
 * - notification:new → default variant (uses notification title)
 * - email:sent → success variant
 * - mention:new → info variant
 *
 * @example
 * ```tsx
 * // In App.jsx or AppWrapper
 * function App() {
 *   useWebSocketToasts();
 *   return <div>...</div>;
 * }
 * ```
 */
export function useWebSocketToasts(): void {
  const { subscribe } = useWebSocketEvents();
  const { enqueueSnackbar } = useSnackbar();
  const { isMuted } = useNotificationPreferences();

  // Handle comment:new
  useEffect(() => {
    const unsubscribe = subscribe('comment:new', (data) => {
      try {
        if (isMuted('comment')) return;
        const comment = data as Comment;
        const entityType = comment.entityType || 'item';
        enqueueSnackbar(`New comment on ${entityType}`, {
          variant: 'info',
          autoHideDuration: 3000
        });
      } catch (err) {
        console.error('[useWebSocketToasts] Failed to handle comment:new:', err);
      }
    });
    return unsubscribe;
  }, [subscribe, enqueueSnackbar, isMuted]);

  // Handle comment:updated
  useEffect(() => {
    const unsubscribe = subscribe('comment:updated', (data) => {
      try {
        if (isMuted('comment')) return;
        const comment = data as Comment;
        const entityType = comment.entityType || 'item';
        enqueueSnackbar(`Comment updated on ${entityType}`, {
          variant: 'info',
          autoHideDuration: 3000
        });
      } catch (err) {
        console.error('[useWebSocketToasts] Failed to handle comment:updated:', err);
      }
    });
    return unsubscribe;
  }, [subscribe, enqueueSnackbar, isMuted]);

  // Handle comment:deleted
  useEffect(() => {
    const unsubscribe = subscribe('comment:deleted', (data) => {
      try {
        if (isMuted('comment')) return;
        const { entityType } = data as { entityType: string };
        enqueueSnackbar(`Comment deleted from ${entityType || 'item'}`, {
          variant: 'default',
          autoHideDuration: 3000
        });
      } catch (err) {
        console.error('[useWebSocketToasts] Failed to handle comment:deleted:', err);
      }
    });
    return unsubscribe;
  }, [subscribe, enqueueSnackbar, isMuted]);

  // Handle attachment:uploaded
  useEffect(() => {
    const unsubscribe = subscribe('attachment:uploaded', (data) => {
      try {
        if (isMuted('attachment')) return;
        const attachment = data as Attachment;
        const filename = attachment.filename || 'File';
        enqueueSnackbar(`File uploaded: ${filename}`, {
          variant: 'success',
          autoHideDuration: 3000
        });
      } catch (err) {
        console.error('[useWebSocketToasts] Failed to handle attachment:uploaded:', err);
      }
    });
    return unsubscribe;
  }, [subscribe, enqueueSnackbar, isMuted]);

  // Handle attachment:deleted
  useEffect(() => {
    const unsubscribe = subscribe('attachment:deleted', (data) => {
      try {
        if (isMuted('attachment')) return;
        const { filename } = data as { filename?: string };
        enqueueSnackbar(`File deleted: ${filename || 'Attachment'}`, {
          variant: 'default',
          autoHideDuration: 3000
        });
      } catch (err) {
        console.error('[useWebSocketToasts] Failed to handle attachment:deleted:', err);
      }
    });
    return unsubscribe;
  }, [subscribe, enqueueSnackbar, isMuted]);

  // Handle notification:new
  useEffect(() => {
    const unsubscribe = subscribe('notification:new', (data) => {
      try {
        if (isMuted('notification')) return;
        const notification = data as Notification;
        const variant = notification.type || 'default';
        enqueueSnackbar(notification.title, {
          variant,
          autoHideDuration: 5000
        });
      } catch (err) {
        console.error('[useWebSocketToasts] Failed to handle notification:new:', err);
      }
    });
    return unsubscribe;
  }, [subscribe, enqueueSnackbar, isMuted]);

  // Handle email:sent
  useEffect(() => {
    const unsubscribe = subscribe('email:sent', (data) => {
      try {
        if (isMuted('email')) return;
        const { to } = data as { to?: string };
        const toSuffix = to ? ` to ${to}` : '';
        enqueueSnackbar(`Email sent${toSuffix}`, {
          variant: 'success',
          autoHideDuration: 3000
        });
      } catch (err) {
        console.error('[useWebSocketToasts] Failed to handle email:sent:', err);
      }
    });
    return unsubscribe;
  }, [subscribe, enqueueSnackbar, isMuted]);

  // Handle mention:new
  useEffect(() => {
    const unsubscribe = subscribe('mention:new', (data) => {
      try {
        if (isMuted('mention')) return;
        const { entityType } = data as { entityType?: string };
        enqueueSnackbar(`You were mentioned in a ${entityType || 'comment'}`, {
          variant: 'info',
          autoHideDuration: 4000
        });
      } catch (err) {
        console.error('[useWebSocketToasts] Failed to handle mention:new:', err);
      }
    });
    return unsubscribe;
  }, [subscribe, enqueueSnackbar, isMuted]);
}

export default useWebSocketToasts;

