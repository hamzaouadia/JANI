import axios from 'axios';

import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';
import { enqueueRest } from '@/lib/offline/restQueue';
import { getAuthToken } from '@/storage/tokenStorage';

export const traceabilityClient = axios.create({
  baseURL: ENV.TRACEABILITY_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

traceabilityClient.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
  config.headers = config.headers ?? {};
  // @ts-ignore
  config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    logger.warn('Failed to read auth token for traceabilityClient', err);
  }

  return config;
});

traceabilityClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      logger.error('Traceability API request failed', error);

      const config = (error as { config?: any }).config;
      const method: string | undefined = config?.method?.toUpperCase?.();

      if (!config || !method) return Promise.reject(error);

      const mutating = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
      const hasResponse = (error as { response?: unknown })?.response;
      if (!hasResponse && mutating) {
        await enqueueRest({ method: method as any, url: config.url, body: config.data, headers: config.headers });
        return Promise.resolve({ data: { queued: true }, status: 202, statusText: 'Accepted' });
      }
    } catch (e) {
      logger.error('Failed to enqueue traceability request', e);
    }

    return Promise.reject(error);
  }
);
