import { useCallback, useEffect, useMemo, useState } from 'react';

import { commentsService } from 'services/comments';
import type {
  Comment,
  CommentCreateDto,
  CommentListResponse,
  CommentUpdateDto,
  EntityIdentifier
} from 'types/api';
import { useWebSocketEvents } from './useWebSocketEvents';

interface UseCommentsOptions {
  entityType: string;
  entityId: EntityIdentifier;
  autoLoad?: boolean;
}

interface CreateCommentInput {
  content: string;
  mentions?: EntityIdentifier[];
}

interface UseCommentsResult {
  comments: Comment[];
  total: number;
  loading: boolean;
  error: unknown;
  isCreating: boolean;
  updatingIds: Set<EntityIdentifier>;
  deletingIds: Set<EntityIdentifier>;
  refresh: () => Promise<void>;
  createComment: (input: CreateCommentInput) => Promise<Comment>;
  updateComment: (id: EntityIdentifier, payload: CommentUpdateDto) => Promise<Comment>;
  deleteComment: (id: EntityIdentifier) => Promise<void>;
}

export function useComments(options: UseCommentsOptions): UseCommentsResult {
  const { entityType, entityId, autoLoad = true } = options;

  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [updatingIds, setUpdatingIds] = useState<Set<EntityIdentifier>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<EntityIdentifier>>(new Set());

  const hasValidTarget = useMemo(() => entityType && entityId !== undefined, [entityType, entityId]);
  const { subscribe } = useWebSocketEvents();

  const handleResponse = useCallback((response: CommentListResponse) => {
    setComments(response.items);
    setTotal(response.total);
  }, []);

  const load = useCallback(async () => {
    if (!hasValidTarget) {
      setComments([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const response = await commentsService.listComments({
        entityType,
        entityId
      });
      handleResponse(response);
      setError(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, handleResponse, hasValidTarget]);

  useEffect(() => {
    if (!autoLoad || !hasValidTarget) {
      return;
    }
    void load();
  }, [autoLoad, hasValidTarget, load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const create = useCallback(
    async (input: CreateCommentInput) => {
      if (!hasValidTarget) {
        throw new Error('Cannot create comment without a valid entityType/entityId');
      }
      setIsCreating(true);
      try {
        const payload: CommentCreateDto = {
          entityType,
          entityId,
          content: input.content,
          mentions: input.mentions
        };
        const created = await commentsService.createComment(payload);
        setComments((prev) => [created, ...prev]);
        setTotal((prev) => prev + 1);
        return created;
      } finally {
        setIsCreating(false);
      }
    },
    [entityId, entityType, hasValidTarget]
  );

  const update = useCallback(
    async (id: EntityIdentifier, payload: CommentUpdateDto) => {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      try {
        const updated = await commentsService.updateComment(id, payload);
        setComments((prev) => prev.map((comment) => (comment.id === id ? updated : comment)));
        return updated;
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    []
  );

  const remove = useCallback(async (id: EntityIdentifier) => {
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    try {
      await commentsService.deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
      setTotal((prev) => Math.max(prev - 1, 0));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  // Auto-refresh on comment:new WebSocket event
  useEffect(() => {
    if (!hasValidTarget) return;

    const unsubscribe = subscribe('comment:new', (data) => {
      const comment = data as Comment;
      // Only refresh if the event matches our entityType/entityId
      if (comment.entityType === entityType && comment.entityId === entityId) {
        refresh().catch((err) => {
          console.error('[useComments] Failed to refresh on comment:new event:', err);
        });
      }
    });

    return unsubscribe;
  }, [subscribe, entityType, entityId, hasValidTarget, refresh]);

  // Auto-refresh on comment:updated WebSocket event
  useEffect(() => {
    if (!hasValidTarget) return;

    const unsubscribe = subscribe('comment:updated', (data) => {
      const comment = data as Comment;
      // Only refresh if the event matches our entityType/entityId
      if (comment.entityType === entityType && comment.entityId === entityId) {
        refresh().catch((err) => {
          console.error('[useComments] Failed to refresh on comment:updated event:', err);
        });
      }
    });

    return unsubscribe;
  }, [subscribe, entityType, entityId, hasValidTarget, refresh]);

  // Auto-refresh on comment:deleted WebSocket event
  useEffect(() => {
    if (!hasValidTarget) return;

    const unsubscribe = subscribe('comment:deleted', (data) => {
      const { entityType: evtEntityType, entityId: evtEntityId } = data as {
        entityType: string;
        entityId: EntityIdentifier;
      };
      // Only refresh if the event matches our entityType/entityId
      if (evtEntityType === entityType && evtEntityId === entityId) {
        refresh().catch((err) => {
          console.error('[useComments] Failed to refresh on comment:deleted event:', err);
        });
      }
    });

    return unsubscribe;
  }, [subscribe, entityType, entityId, hasValidTarget, refresh]);

  return {
    comments,
    total,
    loading,
    error,
    isCreating,
    updatingIds,
    deletingIds,
    refresh,
    createComment: create,
    updateComment: update,
    deleteComment: remove
  };
}

export default useComments;
