import axios from 'axios';

import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export const setUnauthorizedHandler = (handler: (() => void | Promise<void>) | null) => {
  unauthorizedHandler = handler;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        await unauthorizedHandler?.();
      } catch (handlerError) {
        logger.error('Unauthorized handler failed', handlerError);
      }
    }

    logger.error('API request failed', error);
    return Promise.reject(error);
  }
);
