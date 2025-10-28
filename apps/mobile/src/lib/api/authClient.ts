import axios from 'axios';
import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';
import { getAuthToken } from '@/storage/tokenStorage';

export const authClient = axios.create({
  baseURL: ENV.AUTH_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

authClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    logger.error('Auth API request failed', error);
    return Promise.reject(error);
  }
);
