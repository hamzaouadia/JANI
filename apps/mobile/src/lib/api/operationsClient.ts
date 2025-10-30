import axios from 'axios';

import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';
import { enqueueRest } from '@/lib/offline/restQueue';
import { getAuthToken } from '@/storage/tokenStorage';

// Compute a runtime-friendly baseURL. When the JS runs in a browser (Expo web or
// Next.js), Docker service hostnames like `operations` are not resolvable from
// the browser. Prefer localhost:4003 for web runtimes so requests reach the
// host-mapped operations port. For native (device/emulator) and container
// runtimes, use the ENV value which may point at internal compose hostnames.
const computeOperationsBase = (): string => {
  const raw = ENV.OPERATIONS_BASE_URL;

  // If running in a browser, prefer localhost mapping.
  if (typeof window !== 'undefined') {
    try {
      // Replace host portion with localhost:4003 but preserve protocol and path
      const url = new URL(raw);
      url.hostname = 'localhost';
      // If the env provided no explicit port, ensure we point at 4003
      if (!url.port) url.port = '4003';
      return url.toString().replace(/\/$/, '');
    } catch {
      // Fallback to explicit localhost base
      return 'http://localhost:4003/api';
    }
  }

  // Non-browser runtimes (node in container, native device/emulator): use ENV
  return raw.replace(/\/$/, '');
};

export const operationsClient = axios.create({
  baseURL: computeOperationsBase(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach auth token if available (per-request)
operationsClient.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
  // @ts-ignore - axios types for headers can be a bit loose here
  config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore token errors and proceed without token
    logger.warn('Failed to read auth token for operationsClient', err);
  }

  return config;
});

// On network failures for mutating requests, enqueue them for background processing
operationsClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      logger.error('Operations API request failed', error);

      const config = (error as { config?: any }).config;
      const method: string | undefined = config?.method?.toUpperCase?.();

      if (!config || !method) return Promise.reject(error);

      // Only enqueue mutating requests
      const mutating = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

      // Network-level error (no response) -> enqueue
      const hasResponse = (error as { response?: unknown })?.response;
      if (!hasResponse && mutating) {
        await enqueueRest({ method: method as any, url: config.url, body: config.data, headers: config.headers });
        // Resolve with a synthetic response indicating queued status
        return Promise.resolve({ data: { queued: true }, status: 202, statusText: 'Accepted' });
      }
    } catch (e) {
      logger.error('Failed to enqueue operations request', e);
    }

    return Promise.reject(error);
  }
);
