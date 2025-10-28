import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useTraceabilityHealth,
  useTraceabilityEvent,
  useFarmEvents,
  useCreateEvent,
} from '../useTraceability';
import * as traceabilityApi from '../../api/traceabilityApi';

// Mock the API
jest.mock('../../api/traceabilityApi');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Traceability Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useTraceabilityHealth', () => {
    it('should fetch health status successfully', async () => {
      const mockHealth = {
        service: 'JANI Traceability Service',
        status: 'healthy',
        timestamp: '2025-10-22T00:00:00Z',
        version: '1.0.0',
        uptime: 100,
        mongodb: {
          status: 'connected',
          readyState: 1,
        },
      };

      (traceabilityApi.checkHealth as jest.Mock).mockResolvedValue(mockHealth);

      const { result } = renderHook(() => useTraceabilityHealth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockHealth);
    });

    it('should handle health check errors', async () => {
      (traceabilityApi.checkHealth as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useTraceabilityHealth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe('useTraceabilityEvent', () => {
    it('should fetch event by ID', async () => {
      const mockEvent = {
        success: true,
        event: {
          id: 'event-1',
          type: 'PLANTING',
          farmId: 'farm-1',
          hash: 'abc123',
          createdAt: '2025-10-22T00:00:00Z',
          updatedAt: '2025-10-22T00:00:00Z',
        },
      };

      (traceabilityApi.getEventById as jest.Mock).mockResolvedValue(mockEvent);

      const { result } = renderHook(() => useTraceabilityEvent('event-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockEvent);
    });
  });

  describe('useFarmEvents', () => {
    it('should fetch events for a farm', async () => {
      const mockEvents = {
        success: true,
        events: [
          { id: 'event-1', type: 'PLANTING', farmId: 'farm-1' },
          { id: 'event-2', type: 'HARVESTING', farmId: 'farm-1' },
        ],
      };

      (traceabilityApi.getEventsByFarm as jest.Mock).mockResolvedValue(mockEvents);

      const { result } = renderHook(() => useFarmEvents('farm-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockEvents);
      expect(result.current.data?.events).toHaveLength(2);
    });
  });

  describe('useCreateEvent', () => {
    it('should create a new event', async () => {
      const mockResponse = {
        success: true,
        event: {
          id: 'new-event',
          type: 'PLANTING',
          farmId: 'farm-1',
          hash: 'xyz789',
          createdAt: '2025-10-22T00:00:00Z',
          updatedAt: '2025-10-22T00:00:00Z',
        },
      };

      (traceabilityApi.createEvent as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateEvent(), {
        wrapper: createWrapper(),
      });

      const newEvent = {
        type: 'PLANTING' as const,
        farmId: 'farm-1',
        cropType: 'Wheat',
        quantity: 100,
        unit: 'kg',
      };

      result.current.mutate(newEvent);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResponse);
    });
  });
});
