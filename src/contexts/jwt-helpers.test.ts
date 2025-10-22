import { beforeEach, describe, expect, it, vi } from 'vitest';

import axiosServices from 'utils/axios';

import { decodeServiceToken, setSession, verifyToken } from './jwt-helpers';

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

const toBase64 = (value: unknown): string =>
  Buffer.from(JSON.stringify(value), 'utf-8').toString('base64');

const toBase64Url = (value: unknown): string =>
  Buffer.from(JSON.stringify(value), 'utf-8').toString('base64url');

beforeEach(() => {
  const storage = createLocalStorageMock();
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true
  });
  if (globalThis.window !== undefined) {
    Object.defineProperty(globalThis.window, 'localStorage', {
      value: storage,
      configurable: true
    });
  }
  axiosServices.defaults.headers.common = {};
  vi.useRealTimers();
});

describe('decodeServiceToken', () => {
  it('decodes JWT tokens with base64url payloads', () => {
    const header = toBase64Url({ alg: 'HS256', typ: 'JWT' });
    const payload = { exp: 1_700_000_000, userId: 'user-1' };
    const token = `${header}.${toBase64Url(payload)}.signature`;

    const result = decodeServiceToken(token);

    expect(result).toMatchObject(payload);
  });

  it('decodes base64-encoded payload tokens', () => {
    const payload = { exp: Date.now() + 60_000, userId: 'user-2' };
    const token = toBase64(payload);

    const result = decodeServiceToken(token);

    expect(result).toMatchObject(payload);
  });

  it('returns null and logs on invalid tokens', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = decodeServiceToken('not-a-token');

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe('verifyToken', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  it('accepts tokens with millisecond expiration timestamps', () => {
    const payload = { exp: Date.now() + 60_000 };
    const token = toBase64(payload);

    expect(verifyToken(token)).toBe(true);
  });

  it('accepts tokens with second-based expiration timestamps', () => {
    const payload = { exp: Math.floor(Date.now() / 1000) + 60 };
    const token = toBase64(payload);

    expect(verifyToken(token)).toBe(true);
  });

  it('rejects expired tokens', () => {
    // Token expired 60 seconds ago (beyond the 30-second clock skew buffer)
    const payload = { exp: Math.floor(Date.now() / 1000) - 60 };
    const token = toBase64(payload);

    expect(verifyToken(token)).toBe(false);
  });

  it('rejects tokens without expiration', () => {
    const token = toBase64({ userId: 'missing-exp' });

    expect(verifyToken(token)).toBe(false);
  });
});

describe('setSession', () => {
  it('stores tokens and updates axios headers', () => {
    setSession('token-123');

    expect(globalThis.localStorage.getItem('serviceToken')).toBe('token-123');
    expect(axiosServices.defaults.headers.common.Authorization).toBe('Bearer token-123');
  });

  it('clears tokens and removes axios headers', () => {
    globalThis.localStorage.setItem('serviceToken', 'token-abc');
    axiosServices.defaults.headers.common.Authorization = 'Bearer token-abc';

    setSession(null);

    expect(globalThis.localStorage.getItem('serviceToken')).toBeNull();
    expect(axiosServices.defaults.headers.common.Authorization).toBeUndefined();
  });
});
