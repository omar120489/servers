/** @vitest-environment jsdom */

import { act } from 'react-dom/test-utils';
import { Provider as ReduxProvider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { createRoot } from 'react-dom/client';
import { useContext } from 'react';
import React from 'react';

import accountReducer from 'store/slices/account';
import snackbarReducer from 'store/slices/snackbar';

import axiosServices, { authApi } from 'utils/axios';

import JWTContext, { JWTProvider } from './JWTContext';

import type { AuthContextType } from 'types/auth';

function createTestStore(preloaded?: Partial<ReturnType<typeof accountReducer>>) {
  return configureStore({
    reducer: {
      account: accountReducer,
      snackbar: snackbarReducer
    },
    preloadedState: {
      account: {
        isLoggedIn: false,
        isInitialized: true,
        user: null,
        ...(preloaded ?? {})
      },
      snackbar: snackbarReducer(undefined, { type: '@@INIT' })
    }
  });
}

function createLocalStorageMock(): Storage {
  let store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store = new Map();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    }
  };
}

beforeEach(() => {
  const storage = createLocalStorageMock();
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true
  });
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
      value: storage,
      configurable: true
    });
  }
  axiosServices.defaults.headers.common = {};
  vi.restoreAllMocks();
});

describe('JWTProvider', () => {
  it('logs in and stores session details', async () => {
    const store = createTestStore();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const mockUser = {
      id: 'user-1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user'
    };

    const loginSpy = vi.spyOn(authApi, 'login').mockResolvedValue({
      serviceToken: 'service-token-123',
      user: mockUser
    });

    let contextValue: AuthContextType | null = null;

    function TestConsumer() {
      contextValue = useContext(JWTContext);
      return null;
    }

    await act(async () => {
      root.render(
        <ReduxProvider store={store}>
          <JWTProvider>
            <TestConsumer />
          </JWTProvider>
        </ReduxProvider>
      );
    });

    expect(contextValue).not.toBeNull();

    await act(async () => {
      await contextValue!.login('demo@example.com', '123456');
    });

    expect(loginSpy).toHaveBeenCalledWith('demo@example.com', '123456');
    expect(globalThis.localStorage.getItem('serviceToken')).toBe('service-token-123');
    expect(axiosServices.defaults.headers.common.Authorization).toBe('Bearer service-token-123');

    const state = store.getState().account;
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual(mockUser);

    await act(async () => {
      contextValue!.logout();
    });

    const resetState = store.getState().account;
    expect(resetState.isLoggedIn).toBe(false);
    expect(resetState.user).toBeNull();
    expect(globalThis.localStorage.getItem('serviceToken')).toBeNull();
    expect(axiosServices.defaults.headers.common.Authorization).toBeUndefined();

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
