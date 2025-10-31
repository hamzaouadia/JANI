import { AxiosInstance } from 'axios';
import { getAuthToken } from '@/storage/tokenStorage';
import { enqueueRest } from '@/lib/offline/restQueue';
import { logger } from '@/utils/logger';

// Compute a runtime-friendly base URL for a service. When running in a browser
// (Expo web / Next), Docker service hostnames are not resolvable — prefer
// localhost:<defaultPort> for web runtimes so requests reach the host-mapped
// service port. For native/device and container runtimes, use the provided
// raw value which may point at internal compose hostnames.
export const computeBase = (raw: string, defaultPort = '4003'): string => {
  if (typeof window !== 'undefined') {
    try {
      const url = new URL(raw);
      url.hostname = 'localhost';
      if (!url.port) url.port = defaultPort;
      return url.toString().replace(/\/$/, '');
    } catch {
      return `http://localhost:${defaultPort}`;
    }
  }

  return raw.replace(/\/$/, '');
};

// Attach the standard auth + enqueue interceptors to an axios instance.
// - request interceptor: reads auth token and attaches Authorization header
// - response interceptor: on network-level errors for mutating requests,
//   enqueue the request using `enqueueRest` and return a synthetic 202
//   response so callers can continue optimistically.
export const attachAuthAndEnqueue = (client: AxiosInstance): void => {
  client.interceptors.request.use(async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        config.headers = config.headers ?? {};
        // @ts-ignore - axios header typing can be loose here
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      logger.warn('Failed to read auth token for client', err);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      try {
        logger.error('API request failed', error);

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
        logger.error('Failed to enqueue client request', e);
      }

      return Promise.reject(error);
    }
  );
};
