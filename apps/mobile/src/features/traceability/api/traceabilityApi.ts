import axios from 'axios';
import { ENV } from '@/config/env';
import { enqueueRest } from '@/lib/offline/restQueue';
import { getAuthToken } from '@/storage/tokenStorage';
import { logger } from '@/utils/logger';

// Compute a runtime-friendly baseURL for traceability service. When running in
// a browser (Expo web / Next), Docker service hostnames like `traceability`
// are not resolvable — prefer localhost:4002 for web runtimes so requests reach
// the host-mapped traceability port. For native/device and container runtimes,
// use the ENV value which may point at internal compose hostnames.
const computeTraceabilityBase = (): string => {
  const raw = ENV.TRACEABILITY_BASE_URL;

  if (typeof window !== 'undefined') {
    try {
      const url = new URL(raw);
      url.hostname = 'localhost';
      if (!url.port) url.port = '4002';
      return url.toString().replace(/\/$/, '');
    } catch {
      return 'http://localhost:4002';
    }
  }

  return raw.replace(/\/$/, '');
};

const traceabilityClient = axios.create({
  baseURL: computeTraceabilityBase(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token if available (per-request)
traceabilityClient.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
      // @ts-ignore - axios header typing can be loose here
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // don't block requests if token read fails
    logger.warn('Failed to read auth token for traceabilityClient', err);
  }

  return config;
});

// On network failures for mutating requests, enqueue them for background processing
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

export interface TraceabilityEvent {
  id?: string;
  type: 'PLANTING' | 'GROWING' | 'HARVESTING' | 'PROCESSING' | 'PACKAGING' | 'SHIPPING' | 'RECEIVING';
  farmId: string;
  plotId?: string;
  cropType?: string;
  quantity?: number;
  unit?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  metadata?: Record<string, any>;
  photos?: string[];
  timestamp?: string;
  createdBy?: string;
}

export interface FarmEvent extends TraceabilityEvent {
  id: string;
  hash?: string;
  merkleRoot?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FarmEventsResponse {
  success: boolean;
  events: FarmEvent[];
}

export interface EventResponse {
  success: boolean;
  event: FarmEvent & { hash: string };
}

export interface HealthResponse {
  service: string;
  status: string;
  timestamp: string;
  version: string;
  uptime: number;
  mongodb: {
    status: string;
    readyState: number;
  };
}

// Health check
export const checkHealth = async (): Promise<HealthResponse> => {
  const { data } = await traceabilityClient.get('/health');
  return data;
};

// Create a new traceability event
export const createEvent = async (event: TraceabilityEvent): Promise<EventResponse> => {
  const { data } = await traceabilityClient.post('/api/events', event);
  return data;
};

// Get event by ID
export const getEventById = async (id: string): Promise<EventResponse> => {
  const { data } = await traceabilityClient.get(`/api/events/${id}`);
  return data;
};

// Get events for a farm
export const getEventsByFarm = async (farmId: string): Promise<FarmEventsResponse> => {
  const { data } = await traceabilityClient.get(`/api/events/farm/${farmId}`);
  return data;
};

// Verify event hash
export const verifyEventHash = async (id: string): Promise<{ valid: boolean; hash: string }> => {
  const { data } = await traceabilityClient.get(`/api/events/${id}/verify`);
  return data;
};

// Sync offline events (batch upload)
export const syncOfflineEvents = async (events: TraceabilityEvent[]): Promise<{
  success: boolean;
  synced: number;
  failed: number;
  results: EventResponse[];
}> => {
  const { data } = await traceabilityClient.post('/api/events/batch', { events });
  return data;
};

export default {
  checkHealth,
  createEvent,
  getEventById,
  getEventsByFarm,
  verifyEventHash,
  syncOfflineEvents,
};
