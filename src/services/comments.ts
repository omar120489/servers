import { apiDelete, apiGet, apiPatch, apiPost } from 'utils/axios';

import type {
  Comment,
  CommentCreateDto,
  CommentListResponse,
  CommentUpdateDto,
  EntityIdentifier
} from 'types/api';

const BASE_URL = '/api/v1/comments';

interface CommentDto {
  id: number | string;
  entity_type: string;
  entity_id: EntityIdentifier;
  content: string;
  mentions?: EntityIdentifier[];
  author_id?: EntityIdentifier;
  created_at: string;
  updated_at: string;
}

interface CommentListDto {
  items: CommentDto[];
  total: number;
}

interface CommentCreateRequest {
  entity_type: string;
  entity_id: string;
  content: string;
  mentions?: EntityIdentifier[];
}

interface CommentUpdateRequest {
  content?: string;
  mentions?: EntityIdentifier[];
}

export interface ListCommentsParams {
  entityType?: string;
  entityId?: EntityIdentifier;
}

function mapComment(dto: CommentDto): Comment {
  return {
    id: dto.id,
    entityType: dto.entity_type,
    entityId: dto.entity_id,
    content: dto.content,
    mentions: dto.mentions,
    authorId: dto.author_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at
  };
}

function toCreateRequest(payload: CommentCreateDto): CommentCreateRequest {
  return {
    entity_type: payload.entityType,
    entity_id: String(payload.entityId),
    content: payload.content,
    mentions: payload.mentions
  };
}

function toUpdateRequest(payload: CommentUpdateDto): CommentUpdateRequest {
  return {
    content: payload.content,
    mentions: payload.mentions
  };
}

export async function listComments(params: ListCommentsParams): Promise<CommentListResponse> {
  const response = await apiGet<CommentListDto>(BASE_URL, {
    params: {
      entity_type: params.entityType,
      entity_id: params.entityId
    }
  });

  return {
    items: response.items.map(mapComment),
    total: response.total
  };
}

export async function createComment(payload: CommentCreateDto): Promise<Comment> {
  const response = await apiPost<CommentCreateRequest, CommentDto>(BASE_URL, toCreateRequest(payload));

  return mapComment(response);
}

export async function updateComment(
  id: EntityIdentifier,
  payload: CommentUpdateDto
): Promise<Comment> {
  const response = await apiPatch<CommentUpdateRequest, CommentDto>(
    `${BASE_URL}/${id}`,
    toUpdateRequest(payload)
  );

  return mapComment(response);
}

export async function deleteComment(id: EntityIdentifier): Promise<void> {
  await apiDelete(`${BASE_URL}/${id}`);
}

export const commentsService = {
  listComments,
  createComment,
  updateComment,
  deleteComment
} as const;

export default commentsService;
