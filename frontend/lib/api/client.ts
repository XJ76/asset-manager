import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout to accommodate Render free tier cold starts (up to 50 seconds)
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors - let the specific API calls handle the error messages
    // This interceptor just ensures we don't redirect on network errors for public pages
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      // Don't redirect on network errors - let the UI handle the error gracefully
      // This is especially important for public endpoints like /organizations
    }
    
    if (error.response?.status === 401) {
      // Only redirect if we're not on a public page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/signup')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

