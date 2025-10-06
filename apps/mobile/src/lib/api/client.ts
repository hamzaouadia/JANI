import axios from 'axios';

import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('API request failed', error);
    return Promise.reject(error);
  }
);
