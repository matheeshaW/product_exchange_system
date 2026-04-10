import axios from 'axios';

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong',
) => {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return fallback;
  }

  const data = error.response?.data as ApiErrorBody | undefined;

  if (Array.isArray(data?.message)) {
    return data.message.join(', ');
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.error === 'string' && data.error.trim()) {
    return data.error;
  }

  return fallback;
};