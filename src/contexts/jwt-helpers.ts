import { jwtDecode } from 'jwt-decode';

import axiosServices from 'utils/axios';

type BufferLike = typeof import('buffer').Buffer;

export interface DecodedServiceToken {
  exp?: number;
  [key: string]: unknown;
}

const BASE64_PADDING_CHAR = '=';
const CLOCK_SKEW_BUFFER = 30 * 1000;

function decodeBase64(payload: string): string {
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, BASE64_PADDING_CHAR);

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(padded);
  }

  const globalWithBuffer = globalThis as typeof globalThis & { Buffer?: BufferLike };
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(padded, 'base64').toString('utf-8');
  }

  throw new Error('Base64 decoding is not supported in this environment');
}

export function decodeServiceToken(serviceToken: string): DecodedServiceToken | null {
  if (!serviceToken) {
    return null;
  }

  const looksLikeJwt = serviceToken.includes('.');

  try {
    if (looksLikeJwt) {
      return jwtDecode<DecodedServiceToken>(serviceToken);
    }

    const decoded = decodeBase64(serviceToken);
    return JSON.parse(decoded) as DecodedServiceToken;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
}

export function verifyToken(serviceToken: string): boolean {
  const decoded = decodeServiceToken(serviceToken);

  if (!decoded?.exp) {
    return false;
  }

  const expiresAt =
    decoded.exp > 1_000_000_000_000 ? decoded.exp : decoded.exp * 1000;

  return expiresAt > Date.now() - CLOCK_SKEW_BUFFER;
}

export function setSession(serviceToken: string | null): void {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axiosServices.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axiosServices.defaults.headers.common.Authorization;
  }
}

export { CLOCK_SKEW_BUFFER };
