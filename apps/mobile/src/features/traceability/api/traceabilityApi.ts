import axios from 'axios';
import { ENV } from '@/config/env';
import { computeBase, attachAuthAndEnqueue } from '@/lib/api/common';

const traceabilityClient = axios.create({
  baseURL: computeBase(ENV.TRACEABILITY_BASE_URL, '4002'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach standard auth + enqueue interceptors
attachAuthAndEnqueue(traceabilityClient);

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
