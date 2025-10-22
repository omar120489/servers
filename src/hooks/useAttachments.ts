import { useCallback, useEffect, useMemo, useState } from 'react';

import { attachmentsService } from 'services/attachments';
import type { Attachment, EntityIdentifier } from 'types/api';
import { useWebSocketEvents } from './useWebSocketEvents';

interface UseAttachmentsOptions {
  entityType: string;
  entityId: EntityIdentifier;
  autoLoad?: boolean;
}

interface UseAttachmentsResult {
  attachments: Attachment[];
  loading: boolean;
  error: unknown;
  uploading: boolean;
  uploadProgress: number | null;
  deletingIds: Set<EntityIdentifier>;
  refresh: () => Promise<void>;
  uploadAttachment: (file: File) => Promise<Attachment>;
  deleteAttachment: (id: EntityIdentifier) => Promise<void>;
}

export function useAttachments(options: UseAttachmentsOptions): UseAttachmentsResult {
  const { entityType, entityId, autoLoad = true } = options;

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [deletingIds, setDeletingIds] = useState<Set<EntityIdentifier>>(new Set());

  const hasValidTarget = useMemo(() => entityType && entityId !== undefined, [entityType, entityId]);
  const { subscribe } = useWebSocketEvents();

  const load = useCallback(async () => {
    if (!hasValidTarget) {
      setAttachments([]);
      return;
    }
    setLoading(true);
    try {
      const response = await attachmentsService.listAttachments(entityType, entityId);
      setAttachments(response);
      setError(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, hasValidTarget]);

  useEffect(() => {
    if (!autoLoad || !hasValidTarget) {
      return;
    }
    void load();
  }, [autoLoad, hasValidTarget, load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const upload = useCallback(
    async (file: File) => {
      if (!hasValidTarget) {
        throw new Error('Cannot upload attachment without a valid entityType/entityId');
      }
      setUploading(true);
      setUploadProgress(0);
      try {
        const attachment = await attachmentsService.uploadAttachment({
          entityType,
          entityId,
          file,
          onUploadProgress: (progress) => {
            setUploadProgress(progress);
          }
        });
        setAttachments((prev) => [attachment, ...prev]);
        setUploadProgress(null);
        return attachment;
      } catch (err) {
        setUploadProgress(null);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [entityId, entityType, hasValidTarget]
  );

  const remove = useCallback(async (id: EntityIdentifier) => {
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    try {
      await attachmentsService.deleteAttachment(id);
      setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  // Auto-refresh on attachment:uploaded WebSocket event
  useEffect(() => {
    if (!hasValidTarget) return;

    const unsubscribe = subscribe('attachment:uploaded', (data) => {
      const attachment = data as Attachment;
      // Only refresh if the event matches our entityType/entityId
      if (attachment.entityType === entityType && attachment.entityId === entityId) {
        refresh().catch((err) => {
          console.error('[useAttachments] Failed to refresh on attachment:uploaded event:', err);
        });
      }
    });

    return unsubscribe;
  }, [subscribe, entityType, entityId, hasValidTarget, refresh]);

  // Auto-refresh on attachment:deleted WebSocket event
  useEffect(() => {
    if (!hasValidTarget) return;

    const unsubscribe = subscribe('attachment:deleted', (data) => {
      const { entityType: evtEntityType, entityId: evtEntityId } = data as {
        entityType: string;
        entityId: EntityIdentifier;
      };
      // Only refresh if the event matches our entityType/entityId
      if (evtEntityType === entityType && evtEntityId === entityId) {
        refresh().catch((err) => {
          console.error('[useAttachments] Failed to refresh on attachment:deleted event:', err);
        });
      }
    });

    return unsubscribe;
  }, [subscribe, entityType, entityId, hasValidTarget, refresh]);

  return {
    attachments,
    loading,
    error,
    uploading,
    uploadProgress,
    deletingIds,
    refresh,
    uploadAttachment: upload,
    deleteAttachment: remove
  };
}

export default useAttachments;
