/**
 * HTTP Client configuration
 * Centralized axios instance with interceptors for auth and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    timeout: 10000,
  });

  // Request interceptor to add authorization token
  client.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle errors
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Token expired or invalid - handle logout
        console.error('Unauthorized - redirecting to login');
      } else if (error.response?.status === 403) {
        console.error('Forbidden - insufficient permissions');
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
});
