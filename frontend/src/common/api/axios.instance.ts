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
    const originalRequest = err.config;

    if (err.response?.status === 401 && originalRequest?.url !== '/auth/refresh') {
      const res = await api.post('/auth/refresh');

      const newToken = (res.data as any).data.accessToken;

      setAxiosAccessToken(newToken);
      onTokenRefreshed?.(newToken);

      if (!originalRequest) {
        return Promise.reject(err);
      }

      return api(originalRequest);
    }

    return Promise.reject(err);
  }
);

export default api;