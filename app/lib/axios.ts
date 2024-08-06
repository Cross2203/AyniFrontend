import axios from 'axios';
import { getCSRFToken } from '../utils/getCSRFToken';

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);