/// <reference types="jest" />
import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import useServerDataGrid from './useServerDataGrid';

// A simple harness component to expose the hook API to tests without extra libs
function HookHarness({ initial, hookRef }: { initial?: { page: number; pageSize: number }; hookRef: React.MutableRefObject<any> }) {
  const api = useServerDataGrid(initial);
  // Assign on every render so tests always see the latest values after state updates
  hookRef.current = api;
  return null;
}

function setup(initial?: { page: number; pageSize: number }) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  const hookRef = { current: null as any };

  act(() => {
    root.render(<HookHarness initial={initial} hookRef={hookRef} />);
  });

  const cleanup = () => {
    act(() => {
      root.unmount();
    });
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  return { hookRef, cleanup };
}

describe('useServerDataGrid', () => {
  test('should default pagination and produce base query (page + 1, size)', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;
      expect(api.page).toBe(0);
      expect(api.pageSize).toBe(25);
      expect(api.toQuery()).toEqual({ page: 1, size: 25 });
    } finally {
      cleanup();
    }
  });

  test('should update pagination via gridProps.onPaginationModelChange', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.gridProps.onPaginationModelChange({ page: 2, pageSize: 50 } as any);
      });

      const latest = hookRef.current;
      expect(latest.page).toBe(2);
      expect(latest.pageSize).toBe(50);
      expect(latest.toQuery()).toEqual({ page: 3, size: 50 });
    } finally {
      cleanup();
    }
  });

  test('should include sort parameter when a sort model is set', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.gridProps.onSortModelChange([{ field: 'name', sort: 'asc' }] as any);
      });

      const q = hookRef.current.toQuery();
      expect(q).toEqual({ page: 1, size: 25, sort: 'name:asc' });
    } finally {
      cleanup();
    }
  });

  test('should include only the first sort in the model if multiple provided', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.gridProps.onSortModelChange([
          { field: 'name', sort: 'desc' },
          { field: 'createdAt', sort: 'asc' },
        ] as any);
      });

      const q = hookRef.current.toQuery();
      expect(q.sort).toBe('name:desc');
    } finally {
      cleanup();
    }
  });

  test('should include search parameter when filter items are present', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.gridProps.onFilterModelChange({ items: [
          { field: 'name', operator: 'contains', value: 'acme' },
          { field: 'owner', operator: 'contains', value: 'alice' },
        ] } as any);
      });

      const q = hookRef.current.toQuery();
      expect(q).toEqual({ page: 1, size: 25, search: 'name:acme,owner:alice' });
    } finally {
      cleanup();
    }
  });

  test('should treat undefined filter values as empty strings', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.gridProps.onFilterModelChange({ items: [
          { field: 'status', operator: 'contains', value: undefined },
        ] } as any);
      });

      const q = hookRef.current.toQuery();
      expect(q).toEqual({ page: 1, size: 25, search: 'status:' });
    } finally {
      cleanup();
    }
  });

  test('should remove sort and search when models are cleared', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.gridProps.onSortModelChange([{ field: 'name', sort: 'asc' }] as any);
        api.gridProps.onFilterModelChange({ items: [
          { field: 'name', operator: 'contains', value: 'acme' },
        ] } as any);
      });

      expect(hookRef.current.toQuery()).toEqual({ page: 1, size: 25, sort: 'name:asc', search: 'name:acme' });

      act(() => {
        hookRef.current.gridProps.onSortModelChange([]);
        hookRef.current.gridProps.onFilterModelChange({ items: [] } as any);
      });

      expect(hookRef.current.toQuery()).toEqual({ page: 1, size: 25 });
    } finally {
      cleanup();
    }
  });

  test('should initialize from custom initial pagination', () => {
    const { hookRef, cleanup } = setup({ page: 3, pageSize: 10 });

    try {
      const api = hookRef.current;
      expect(api.page).toBe(3);
      expect(api.pageSize).toBe(10);
      expect(api.toQuery()).toEqual({ page: 4, size: 10 });
    } finally {
      cleanup();
    }
  });

  test('should update pagination via explicit setters', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.setPage(5);
        api.setPageSize(100);
      });

      const latest = hookRef.current;
      expect(latest.page).toBe(5);
      expect(latest.pageSize).toBe(100);
      expect(latest.toQuery()).toEqual({ page: 6, size: 100 });
    } finally {
      cleanup();
    }
  });

  test('should expose server-side modes in gridProps', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;
      expect(api.gridProps.paginationMode).toBe('server');
      expect(api.gridProps.sortingMode).toBe('server');
      expect(api.gridProps.filterMode).toBe('server');
    } finally {
      cleanup();
    }
  });

  test('should treat empty string filter values as empty strings in search', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.gridProps.onFilterModelChange({ items: [
          { field: 'name', operator: 'contains', value: '' },
        ] } as any);
      });

      const q = hookRef.current.toQuery();
      expect(q).toEqual({ page: 1, size: 25, search: 'name:' });
    } finally {
      cleanup();
    }
  });

  test('should remove search when filter model has undefined items', () => {
    const { hookRef, cleanup } = setup();

    try {
      const api = hookRef.current;

      act(() => {
        api.gridProps.onFilterModelChange({ items: [
          { field: 'name', operator: 'contains', value: 'acme' },
        ] } as any);
      });
      expect(hookRef.current.toQuery()).toEqual({ page: 1, size: 25, search: 'name:acme' });

      act(() => {
        api.gridProps.onFilterModelChange({ items: undefined } as any);
      });

      const q2 = hookRef.current.toQuery();
      expect(q2).toEqual({ page: 1, size: 25 });
    } finally {
      cleanup();
    }
  });
});
