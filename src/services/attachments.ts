import { api } from '../api/client';

export type Attachment = {
  id: number;
  filename: string;
  file_size: number;
  content_type: string;
  entity_type: string;
  entity_id: number;
  created_at?: string;
};

export const listAttachments = (entity: string, id: number) =>
  api.get(`/attachments/${entity}/${id}`).then(r => r.data);

export const uploadAttachment = (entity: string, id: number, file: File) => {
  const fd = new FormData();
  fd.append('entity_type', entity);
  fd.append('entity_id', String(id));
  fd.append('file', file);
  return api.post('/attachments', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);
};

export const deleteAttachment = (attachmentId: number) =>
  api.delete(`/attachments/${attachmentId}`).then(r => r.data);

export const downloadAttachmentUrl = (attachmentId: number) =>
  `${process.env.REACT_APP_API_URL}/attachments/download/${attachmentId}`;

