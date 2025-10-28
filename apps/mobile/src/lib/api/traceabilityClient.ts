import axios from 'axios';
import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';

export const traceabilityClient = axios.create({
  baseURL: ENV.TRACEABILITY_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

traceabilityClient.interceptors.request.use((config) => {
  // Add auth token if available
  // const token = await SecureStore.getItemAsync('authToken');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

traceabilityClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    logger.error('Traceability API request failed', error);
    return Promise.reject(error);
  }
);
