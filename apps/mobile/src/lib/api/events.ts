import { traceabilityClient } from './traceabilityClient';

export interface TraceabilityEvent {
  _id: string;
  farmId: string;
  plotId?: string;
  eventType: 'planting' | 'irrigation' | 'fertilization' | 'pestApplication' | 'harvest' | 'packaging' | 'shipping' | 'qualityCheck' | 'storage' | 'processing' | 'custom';
  timestamp: string;
  recordedBy: string;
  description: string;
  metadata?: Record<string, any>;
  location?: {
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    caption?: string;
  }>;
  syncStatus: 'synced' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  farmId: string;
  plotId?: string;
  eventType: string;
  description: string;
  metadata?: Record<string, any>;
  location?: {
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    caption?: string;
  }>;
}

export interface UpdateEventRequest {
  eventType?: string;
  description?: string;
  metadata?: Record<string, any>;
  location?: {
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  media?: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    caption?: string;
  }>;
}

/**
 * Fetch all traceability events
 */
export const getEvents = async (): Promise<TraceabilityEvent[]> => {
  const response = await traceabilityClient.get('/events');
  return response.data;
};

/**
 * Fetch a single event by ID
 */
export const getEventById = async (eventId: string): Promise<TraceabilityEvent> => {
  const response = await traceabilityClient.get(`/events/${eventId}`);
  return response.data;
};

/**
 * Create a new traceability event
 */
export const createEvent = async (eventData: CreateEventRequest): Promise<TraceabilityEvent> => {
  const response = await traceabilityClient.post('/events', eventData);
  return response.data;
};

/**
 * Update an existing event
 */
export const updateEvent = async (eventId: string, eventData: UpdateEventRequest): Promise<TraceabilityEvent> => {
  const response = await traceabilityClient.put(`/events/${eventId}`, eventData);
  return response.data;
};

/**
 * Delete an event
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  await traceabilityClient.delete(`/events/${eventId}`);
};

/**
 * Get events by farm ID
 */
export const getEventsByFarm = async (farmId: string): Promise<TraceabilityEvent[]> => {
  const response = await traceabilityClient.get(`/events?farmId=${farmId}`);
  return response.data;
};

/**
 * Get events by sync status
 */
export const getEventsByStatus = async (status: 'synced' | 'pending' | 'failed'): Promise<TraceabilityEvent[]> => {
  const response = await traceabilityClient.get(`/events?syncStatus=${status}`);
  return response.data;
};

/**
 * Get events by event type
 */
export const getEventsByType = async (eventType: string): Promise<TraceabilityEvent[]> => {
  const response = await traceabilityClient.get(`/events?eventType=${eventType}`);
  return response.data;
};

/**
 * Get events by date range
 */
export const getEventsByDateRange = async (startDate: string, endDate: string): Promise<TraceabilityEvent[]> => {
  const response = await traceabilityClient.get(`/events?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};
