import axios, { AxiosError } from 'axios';

let accessToken: string | null = null;
let onTokenRefreshed: ((token: string | null) => void) | null = null;

//  function to set token from context
export const setAxiosAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAxiosAccessToken = () => accessToken;

export const registerTokenRefreshHandler = (
  handler: (token: string | null) => void,
) => {
  onTokenRefreshed = handler;

  return () => {
    if (onTokenRefreshed === handler) {
      onTokenRefreshed = null;
    }
  };
};

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

const isAuthEndpoint = (url?: string) => {
  if (!url) return false;

  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh')
  );
};

// attach token from memory
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

//  refresh logic
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as
      | (typeof err.config & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(err);
    }

    // Never try refresh flow for auth endpoints themselves.
    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/auth/refresh');

        const newToken = (res.data as any).data.accessToken;

        setAxiosAccessToken(newToken);
        onTokenRefreshed?.(newToken);

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, force local auth state clear.
        setAxiosAccessToken(null);
        onTokenRefreshed?.(null);

        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default api;