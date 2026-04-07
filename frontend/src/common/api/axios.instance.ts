import axios, { AxiosError } from 'axios';

let accessToken: string | null = null;

//  function to set token from context
export const setAxiosAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAxiosAccessToken = () => accessToken;

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
    if (err.response?.status === 401) {
      const res = await api.post('/auth/refresh');

      const newToken = (res.data as any).data.accessToken;

      setAxiosAccessToken(newToken);

      return api(err.config!);
    }

    return Promise.reject(err);
  }
);

export default api;