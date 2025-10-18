import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';

/**
 * API base URL resolved from environment variables with a safe default.
 */
const DEFAULT_API_BASE = '/api/v1';
const baseURL =
  process.env.REACT_APP_API_URL ||
  process.env.NEXT_PUBLIC_API_URL || 
  DEFAULT_API_BASE;

/**
 * Auth tokens used by the API client.
 * - accessToken: short-lived Bearer token
 * - refreshToken: optional long-lived token to obtain new access tokens
 */
type Tokens = { accessToken: string; refreshToken?: string };

/**
 * In-memory token store to avoid persisting secrets by default.
 * Cleared on logout or refresh failure.
 */
let tokens: Tokens | null = null;

/**
 * Optional auth failure handler (set by the app). Avoids hard redirects in this module
 * and keeps it SSR/test friendly.
 */
let onAuthFailure: (() => void) | null = null;
export const setOnAuthFailure = (fn: (() => void) | null) => {
  onAuthFailure = fn;
};

/**
 * Set or clear the in-memory auth tokens for the API client.
 * Passing null clears tokens and disables Authorization header injection.
 */
export const setTokens = (t: Tokens | null) => {
  tokens = t;
};

/**
 * Global AbortController to support cancelling in-flight requests on logout/auth failure.
 */
let globalAbort = new AbortController();
export function resetRequestController() {
  try {
    globalAbort.abort();
  } catch {
    // ignore
  }
  globalAbort = new AbortController();
}

/**
 * Preconfigured Axios instance for the Traffic CRM API.
 * Injects Authorization header automatically when an access token is available.
 */
const api = axios.create({ baseURL, withCredentials: false, timeout: 15000 });

/**
 * Request interceptor: attaches the Bearer token to outgoing requests when present
 * and ensures a default AbortSignal is applied for global cancellation.
 */
api.interceptors.request.use((config) => {
  // Attach a default AbortSignal to support global cancellation unless a custom signal is provided
  if (!config.signal) {
    config.signal = globalAbort.signal;
  }

  if (tokens?.accessToken) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    } else {
      config.headers = {
        ...((config.headers as any) || {}),
        Authorization: `Bearer ${tokens.accessToken}`,
      } as any;
    }
  }
  return config;
});

/**
 * Tracks an in-flight refresh request to dedupe concurrent refresh attempts.
 */
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh the access token using the current refresh token.
 * Ensures only one refresh call is in flight and updates the token store upon success.
 * Returns the new access token or throws if refresh is unavailable or invalid.
 */
async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    if (!tokens?.refreshToken) throw new Error('No refresh token');
    const r = await axios.post(`${baseURL}/auth/refresh`, { refresh_token: tokens.refreshToken });
    const { access_token: access, refresh_token: refresh } = r.data || {};
    if (!access) throw new Error('No access token in refresh response');
    setTokens({ accessToken: access, refreshToken: refresh ?? tokens.refreshToken });
    return access;
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

/**
 * Response interceptor: attempts a single token refresh on 401 responses and retries the request.
 * On refresh failure, clears tokens, cancels in-flight requests, and calls the optional auth-failure handler.
 */
type retirableConfig = AxiosRequestConfig & { __isRetry?: boolean };

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const response = error.response;
    const originalRequest = error.config as retirableConfig | undefined;

    if (response?.status === 401 && originalRequest && !originalRequest.__isRetry) {
      try {
        await refreshAccessToken();
        originalRequest.__isRetry = true;
        return api(originalRequest);
      } catch {
        setTokens(null);
        resetRequestController();
        onAuthFailure?.();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/** Export the configured Axios client for use across the app. */
export { api };
