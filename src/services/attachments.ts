import { apiDelete, apiGet, axios } from 'utils/axios';

import type { Attachment, AttachmentListResponse, EntityIdentifier } from 'types/api';

const BASE_URL = '/api/v1/attachments';

interface AttachmentDto {
  id: number | string;
  filename: string;
  file_size?: number;
  content_type?: string;
  entity_type?: string;
  entity_id?: EntityIdentifier;
  path: string;
  created_at: string;
}

function mapAttachment(dto: AttachmentDto): Attachment {
  return {
    id: dto.id,
    filename: dto.filename,
    fileSize: dto.file_size,
    contentType: dto.content_type,
    entityType: dto.entity_type,
    entityId: dto.entity_id,
    path: dto.path,
    createdAt: dto.created_at
  };
}

function resolveApiBaseUrl(): string {
  const base = import.meta.env.VITE_APP_API_URL as string | undefined;
  if (!base) {
    return '';
  }
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export function buildAttachmentDownloadUrl(path: string): string {
  const base = resolveApiBaseUrl();
  const normalizedPath = path.replace(/^\/+/, '');
  return `${base}/api/v1/attachments/download/${normalizedPath}`;
}

export async function listAttachments(
  entityType: string,
  entityId: EntityIdentifier
): Promise<AttachmentListResponse> {
  const response = await apiGet<AttachmentDto[]>(`${BASE_URL}/${entityType}/${entityId}`);
  return response.map(mapAttachment);
}

export interface UploadAttachmentOptions {
  entityType: string;
  entityId: EntityIdentifier;
  file: File;
  onUploadProgress?: (progress: number) => void;
}

export async function uploadAttachment(options: UploadAttachmentOptions): Promise<Attachment> {
  const formData = new FormData();
  formData.append('file', options.file);
  formData.append('entity_type', options.entityType);
  formData.append('entity_id', String(options.entityId));

  const { data } = await axios.post<AttachmentDto>(BASE_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (event) => {
      if (!options.onUploadProgress || !event.total) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      options.onUploadProgress(progress);
    }
  });

  return mapAttachment(data);
}

export async function deleteAttachment(id: EntityIdentifier): Promise<void> {
  await apiDelete(`${BASE_URL}/${id}`);
}

export const attachmentsService = {
  listAttachments,
  uploadAttachment,
  deleteAttachment,
  buildAttachmentDownloadUrl
} as const;

export default attachmentsService;
