import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

const getCSRFToken = (): string | null => {
  if (typeof document !== 'undefined') {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || null;
  }
  return null;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const csrfToken = getCSRFToken();
    if (csrfToken && config.headers) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    console.log('Request:', config.method?.toUpperCase(), config.url);
    console.log('Headers:', config.headers);
    console.log('CSRF Token:', csrfToken);
    return config;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error('Response error:', error.response?.status, error.response?.data, error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;