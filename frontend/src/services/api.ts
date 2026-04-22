import axios from 'axios';
import { API_CONFIG } from '../config/api';

export const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`,
  timeout: API_CONFIG.TIMEOUT,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('devconnect-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('devconnect-token');
      window.dispatchEvent(new Event('devconnect-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;