import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';
import type { LoginResponse, UserProfileResponse } from 'types/api';

// ==============================|| AXIOS CONFIGURATION ||============================== //

const baseURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8787/';

const axiosServices: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.href.includes('/login')) {
      localStorage.removeItem('serviceToken');
      delete axiosServices.defaults.headers.common.Authorization;
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

// ==============================|| TYPED FETCHER ||============================== //

export async function fetcher<T = any>(
  args: string | [string, InternalAxiosRequestConfig?]
): Promise<T> {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get<T>(url, { ...config });

  return res.data;
}

// ==============================|| TYPED API METHODS ||============================== //

// Generic GET method with typing
export async function apiGet<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await axiosServices.get<T>(url, config);
  return response.data;
}

// Generic POST method with typing
export async function apiPost<TRequest = any, TResponse = any>(
  url: string,
  data?: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axiosServices.post<TResponse>(url, data, config);
  return response.data;
}

// Generic PUT method with typing
export async function apiPut<TRequest = any, TResponse = any>(
  url: string,
  data?: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axiosServices.put<TResponse>(url, data, config);
  return response.data;
}

// Generic PATCH method with typing
export async function apiPatch<TRequest = any, TResponse = any>(
  url: string,
  data?: TRequest,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axiosServices.patch<TResponse>(url, data, config);
  return response.data;
}

// Generic DELETE method with typing
export async function apiDelete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await axiosServices.delete<T>(url, config);
  return response.data;
}

// ==============================|| SPECIALIZED API METHODS ||============================== //

// Auth API methods
export const authApi = {
  login: (email: string, password: string) =>
    apiPost<{ email: string; password: string }, LoginResponse>('/api/account/login', {
      email,
      password
    }),

  getProfile: () => apiGet<UserProfileResponse>('/api/account/me'),

  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    apiPost('/api/account/register', data),

  resetPassword: (email: string) => apiPost('/api/account/reset-password', { email })
};

// Export the configured instance for backward compatibility
export { axiosServices as axios };
export type { ApiResponse, PaginatedResponse, LoginResponse, UserProfileResponse } from 'types/api';
