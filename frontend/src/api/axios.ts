import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, //  important for cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await api.post('/auth/refresh');
      return api(error.config!);
    }
    return Promise.reject(error);
  }
);

export default api;