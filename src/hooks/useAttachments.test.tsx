/** @vitest-environment jsdom */

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAttachments } from './useAttachments';
import type { Attachment } from 'types/api';

const attachmentsMocks = vi.hoisted(() => ({
  list: vi.fn<(entityType: string, entityId: string | number) => Promise<Attachment[]>>(),
  upload: vi.fn<
    (options: {
      entityType: string;
      entityId: string | number;
      file: File;
      onUploadProgress?: (progress: number) => void;
    }) => Promise<Attachment>
  >(),
  remove: vi.fn()
}));

vi.mock('services/attachments', () => ({
  attachmentsService: {
    listAttachments: attachmentsMocks.list,
    uploadAttachment: attachmentsMocks.upload,
    deleteAttachment: attachmentsMocks.remove,
    buildAttachmentDownloadUrl: vi.fn()
  }
}));

describe('useAttachments', () => {
  beforeEach(() => {
    attachmentsMocks.list.mockReset();
    attachmentsMocks.upload.mockReset();
    attachmentsMocks.remove.mockReset();
  });

  it('loads attachments and uploads a new file', async () => {
    const existingAttachment: Attachment = {
      id: 1,
      filename: 'contract.pdf',
      fileSize: 1024,
      contentType: 'application/pdf',
      entityType: 'deal',
      entityId: '123',
      path: 'deals/123/contract.pdf',
      createdAt: '2024-01-01T00:00:00Z'
    };

    const uploadedAttachment: Attachment = {
      id: 2,
      filename: 'pricing.xlsx',
      fileSize: 2048,
      contentType: 'application/vnd.ms-excel',
      entityType: 'deal',
      entityId: '123',
      path: 'deals/123/pricing.xlsx',
      createdAt: '2024-01-02T00:00:00Z'
    };

    attachmentsMocks.list.mockResolvedValue([existingAttachment]);
    attachmentsMocks.upload.mockImplementation(async (options) => {
      options.onUploadProgress?.(45);
      return uploadedAttachment;
    });

    let hookValue:
      | ReturnType<typeof useAttachments>
      | null = null;

    function TestComponent() {
      hookValue = useAttachments({
        entityType: 'deal',
        entityId: '123'
      });
      return null;
    }

    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () => {
      root.render(<TestComponent />);
    });

    expect(attachmentsMocks.list).toHaveBeenCalledWith('deal', '123');

    await act(async () => {});

    expect(hookValue).not.toBeNull();
    expect(hookValue?.attachments).toHaveLength(1);
    expect(hookValue?.attachments?.[0].filename).toBe('contract.pdf');

    const file = new File(['pricing'], 'pricing.xlsx', { type: 'application/vnd.ms-excel' });

    await act(async () => {
      await hookValue!.uploadAttachment(file);
    });

    expect(attachmentsMocks.upload).toHaveBeenCalled();
    const uploadArgs = attachmentsMocks.upload.mock.calls[0][0];
    expect(uploadArgs.entityType).toBe('deal');
    expect(uploadArgs.entityId).toBe('123');
    expect(uploadArgs.file).toBe(file);
    expect(typeof uploadArgs.onUploadProgress).toBe('function');

    expect(hookValue?.attachments).toHaveLength(2);
    expect(hookValue?.attachments?.[0]).toEqual(uploadedAttachment);
    expect(hookValue?.uploading).toBe(false);
    expect(hookValue?.uploadProgress).toBeNull();

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
