/** @vitest-environment jsdom */

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Deal } from 'types/api';

const dealApiMocks = vi.hoisted(() => ({
  get: vi.fn<(id: string) => Promise<Deal>>()
}));

vi.mock('services/deals', () => ({
  dealsApi: {
    getDeal: dealApiMocks.get
  }
}));

vi.mock('ui-component/Comments/CommentsPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="comments-panel" />
}));

vi.mock('ui-component/Attachments/AttachmentUploader', () => ({
  __esModule: true,
  default: () => <div data-testid="attachments-panel" />
}));

import DealDetail from './DealDetail';

describe('DealDetail page', () => {
  beforeEach(() => {
    dealApiMocks.get.mockReset();
  });

  it('renders summary tab with fetched deal data', async () => {
    const mockDeal: Deal = {
      id: '123',
      name: 'Demo Deal',
      amount: 50000,
      stage: 'Prospecting',
      status: 'Open',
      ownerId: 'owner-1',
      companyId: 'company-1',
      contactId: 'contact-1',
      closeDate: '2024-01-31T00:00:00Z',
      probability: 0.5,
      description: 'Important opportunity',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    };

    dealApiMocks.get.mockResolvedValue(mockDeal);

    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/deals/123']}>
          <Routes>
            <Route path="/deals/:id" element={<DealDetail />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(dealApiMocks.get).toHaveBeenCalledWith('123');

    await act(async () => {});

    expect(container.textContent).toContain('Demo Deal');
    expect(container.textContent).toContain('Deal ID: 123');
    expect(container.textContent).toContain('Prospecting');
    expect(container.textContent).toContain('Open');

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
