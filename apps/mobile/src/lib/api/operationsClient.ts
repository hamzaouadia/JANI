import axios from 'axios';

import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';

export const operationsClient = axios.create({
  baseURL: ENV.OPERATIONS_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

operationsClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    logger.error('Operations API request failed', error);
    return Promise.reject(error);
  }
);
