import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as traceabilityApi from '../api/traceabilityApi';

// Query keys
export const TRACEABILITY_KEYS = {
  all: ['traceability'] as const,
  health: () => [...TRACEABILITY_KEYS.all, 'health'] as const,
  events: () => [...TRACEABILITY_KEYS.all, 'events'] as const,
  event: (id: string) => [...TRACEABILITY_KEYS.events(), id] as const,
  farmEvents: (farmId: string) => [...TRACEABILITY_KEYS.events(), 'farm', farmId] as const,
};

// Health check hook
export const useTraceabilityHealth = () => {
  return useQuery({
    queryKey: TRACEABILITY_KEYS.health(),
    queryFn: traceabilityApi.checkHealth,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

// Get event by ID
export const useTraceabilityEvent = (id: string) => {
  return useQuery({
    queryKey: TRACEABILITY_KEYS.event(id),
    queryFn: () => traceabilityApi.getEventById(id),
    enabled: !!id,
  });
};

// Get events for a farm
export const useFarmEvents = (farmId: string) => {
  return useQuery({
    queryKey: TRACEABILITY_KEYS.farmEvents(farmId),
    queryFn: () => traceabilityApi.getEventsByFarm(farmId),
    enabled: !!farmId,
  });
};

// Create event mutation
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: traceabilityApi.createEvent,
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: TRACEABILITY_KEYS.events() });
      if (data.event.farmId) {
        queryClient.invalidateQueries({ 
          queryKey: TRACEABILITY_KEYS.farmEvents(data.event.farmId) 
        });
      }
    },
  });
};

// Verify event hash
export const useVerifyEventHash = (id: string) => {
  return useQuery({
    queryKey: [...TRACEABILITY_KEYS.event(id), 'verify'],
    queryFn: () => traceabilityApi.verifyEventHash(id),
    enabled: !!id,
  });
};

// Sync offline events mutation
export const useSyncOfflineEvents = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: traceabilityApi.syncOfflineEvents,
    onSuccess: () => {
      // Invalidate all event queries to refresh data
      queryClient.invalidateQueries({ queryKey: TRACEABILITY_KEYS.events() });
    },
  });
};
