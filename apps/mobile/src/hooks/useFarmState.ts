import { useMemo } from 'react';
import {
  getStateFromEvents,
  calculateStateProgress,
  getNextSuggestedAction,
  getDaysInState,
} from '@/constants/farmStates';
import type { FarmState, FarmStateProgress, PlotProgress } from '@/constants/farmStates';
import type { TraceabilityEventType } from '@/constants/traceabilityEvents';

// Mock event data - In a real app, this would come from your offline storage or API
const useMockEvents = (): Array<{ type: TraceabilityEventType; occurredAt: string; plotId?: string }> => {
  return [
    { type: 'plot_registration', occurredAt: '2024-08-15T09:00:00Z', plotId: 'plot-1' },
    { type: 'land_preparation', occurredAt: '2024-08-16T10:30:00Z', plotId: 'plot-1' },
    { type: 'soil_test', occurredAt: '2024-08-18T14:00:00Z', plotId: 'plot-1' },
    { type: 'seed_planting', occurredAt: '2024-08-20T08:00:00Z', plotId: 'plot-1' },
    { type: 'irrigation', occurredAt: '2024-08-22T07:00:00Z', plotId: 'plot-1' },
    { type: 'irrigation', occurredAt: '2024-08-25T07:00:00Z', plotId: 'plot-1' },
    { type: 'fertilizer_application', occurredAt: '2024-08-30T09:00:00Z', plotId: 'plot-1' },
    { type: 'irrigation', occurredAt: '2024-09-02T07:00:00Z', plotId: 'plot-1' },
    { type: 'weeding', occurredAt: '2024-09-05T10:00:00Z', plotId: 'plot-1' },
    { type: 'irrigation', occurredAt: '2024-09-08T07:00:00Z', plotId: 'plot-1' },
    // Add some events for a second plot in different state
    { type: 'plot_registration', occurredAt: '2024-09-01T09:00:00Z', plotId: 'plot-2' },
    { type: 'land_preparation', occurredAt: '2024-09-02T10:30:00Z', plotId: 'plot-2' },
    { type: 'seed_planting', occurredAt: '2024-09-05T08:00:00Z', plotId: 'plot-2' },
    { type: 'irrigation', occurredAt: '2024-09-07T07:00:00Z', plotId: 'plot-2' },
  ];
};

export const useFarmState = (plotId?: string): FarmStateProgress => {
  const mockEvents = useMockEvents();

  return useMemo(() => {
    // Filter events for specific plot if provided, otherwise use all events
    const relevantEvents = plotId 
      ? mockEvents.filter(event => event.plotId === plotId)
      : mockEvents;

    if (relevantEvents.length === 0) {
      return {
        state: 'planning',
        progress: 0,
        nextAction: 'Begin with plot registration',
        daysInState: 0,
      };
    }

    const currentState = getStateFromEvents(relevantEvents);
    const progress = calculateStateProgress(currentState, relevantEvents);
    const nextAction = getNextSuggestedAction(currentState, relevantEvents);
    const daysInState = getDaysInState(currentState, relevantEvents);

    return {
      state: currentState,
      progress,
      nextAction,
      daysInState,
    };
  }, [mockEvents, plotId]);
};

export const usePlotProgress = (): PlotProgress[] => {
  const mockEvents = useMockEvents();
  
  return useMemo(() => {
    // Group events by plotId
    const plotEventMap = mockEvents.reduce((acc, event) => {
      const plotId = event.plotId || 'unknown';
      if (!acc[plotId]) {
        acc[plotId] = [];
      }
      acc[plotId].push(event);
      return acc;
    }, {} as Record<string, typeof mockEvents>);

    // Calculate progress for each plot
    return Object.entries(plotEventMap).map(([plotId, events]) => {
  const sortedEvents = events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
      const currentState = getStateFromEvents(events);
      const progress = calculateStateProgress(currentState, events);
      
      // Extract plot info from events
      const plantingEvent = events.find(e => e.type === 'seed_planting' || e.type === 'transplanting');
      const lastEvent = sortedEvents[0];

      return {
        plotId,
        plotName: plotId === 'plot-1' ? 'North Field' : plotId === 'plot-2' ? 'South Field' : `Plot ${plotId}`,
        cropType: plotId === 'plot-1' ? 'Tomatoes' : 'Peppers',
        currentState,
        progress,
        plantingDate: plantingEvent?.occurredAt,
  lastActivity: lastEvent?.type.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase()),
        lastActivityDate: lastEvent?.occurredAt,
      };
    });
  }, [mockEvents]);
};

export const useFarmOverallProgress = (): FarmStateProgress => {
  const plots = usePlotProgress();
  
  return useMemo(() => {
    if (plots.length === 0) {
      return {
        state: 'planning',
        progress: 0,
        nextAction: 'Register your first plot',
        daysInState: 0,
      };
    }

    // Calculate overall farm state based on all plots
    const stateWeights: Record<FarmState, number> = {
      planning: 1,
      planting: 2, 
      growing: 3,
      harvesting: 4,
      completed: 5,
    };

    // Average state and progress across all plots
    const totalWeight = plots.reduce((sum, plot) => sum + stateWeights[plot.currentState], 0);
    const averageWeight = totalWeight / plots.length;
    
    // Determine overall state based on average
    let overallState: FarmState = 'planning';
    if (averageWeight >= 4.5) overallState = 'completed';
    else if (averageWeight >= 3.5) overallState = 'harvesting';
    else if (averageWeight >= 2.5) overallState = 'growing';
    else if (averageWeight >= 1.5) overallState = 'planting';

    const averageProgress = plots.reduce((sum, plot) => sum + plot.progress, 0) / plots.length;

    // Determine next action based on plots that need attention
    const plotsNeedingAttention = plots.filter(plot => plot.progress < 80);
    const nextAction = plotsNeedingAttention.length > 0 
      ? `Focus on ${plotsNeedingAttention[0].plotName}`
      : 'All plots progressing well';

    return {
      state: overallState,
      progress: Math.round(averageProgress),
      nextAction,
      daysInState: 0, // Could calculate this more precisely
    };
  }, [plots]);
};