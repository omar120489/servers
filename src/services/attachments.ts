import { api } from '../api/client';
import config from '../config';

export type Attachment = {
  id: number;
  filename: string;
  file_size: number;
  content_type: string;
  entity_type: string;
  entity_id: number;
  created_at?: string;
};

const mockAttachments: Attachment[] = [
  { id: 1, filename: 'contract.pdf', file_size: 245000, content_type: 'application/pdf', entity_type: 'deal', entity_id: 1, created_at: '2024-10-01T10:00:00Z' },
  { id: 2, filename: 'proposal.docx', file_size: 128000, content_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', entity_type: 'deal', entity_id: 2, created_at: '2024-10-02T11:00:00Z' },
];

export const listAttachments = async (entity: string, id: number) => {
  // Demo mode: return mock data
  if (config.isDemoMode) {
    const filtered = mockAttachments.filter(a => a.entity_type === entity && a.entity_id === id);
    return Promise.resolve(filtered);
  }

  // Real API call with fallback
  try {
    const response = await api.get(`/attachments/${entity}/${id}`);
    return response.data;
  } catch (error) {
    return mockAttachments.filter(a => a.entity_type === entity && a.entity_id === id);
  }
};

export const uploadAttachment = async (entity: string, id: number, file: File) => {
  // Demo mode: simulate upload
  if (config.isDemoMode) {
    const newAttachment: Attachment = {
      id: Date.now(),
      filename: file.name,
      file_size: file.size,
      content_type: file.type,
      entity_type: entity,
      entity_id: id,
      created_at: new Date().toISOString(),
    };
    mockAttachments.push(newAttachment);
    return Promise.resolve(newAttachment);
  }

  // Real API call
  const fd = new FormData();
  fd.append('entity_type', entity);
  fd.append('entity_id', String(id));
  fd.append('file', file);
  const response = await api.post('/attachments', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteAttachment = async (attachmentId: number) => {
  // Demo mode: simulate deletion
  if (config.isDemoMode) {
    const index = mockAttachments.findIndex(a => a.id === attachmentId);
    if (index !== -1) mockAttachments.splice(index, 1);
    return Promise.resolve({ success: true });
  }

  // Real API call
  const response = await api.delete(`/attachments/${attachmentId}`);
  return response.data;
};

export const downloadAttachmentUrl = (attachmentId: number) => {
  if (config.isDemoMode) {
    return '#'; // Demo mode: no real download
  }
  return `${config.apiUrl}/attachments/download/${attachmentId}`;
};

