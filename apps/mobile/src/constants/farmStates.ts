import type { TraceabilityEventType } from '@/constants/traceabilityEvents';
export type FarmState = 
  | 'planning'     // Before any planting
  | 'planting'     // During seed planting/transplanting
  | 'growing'      // Care activities (irrigation, fertilizer, etc.)
  | 'harvesting'   // During harvest collection
  | 'completed';   // After harvest end

export type FarmStateProgress = {
  state: FarmState;
  progress: number; // 0-100
  nextAction?: string;
  daysInState?: number;
};

export type PlotProgress = {
  plotId: string;
  plotName: string;
  cropType?: string;
  currentState: FarmState;
  progress: number;
  plantingDate?: string;
  expectedHarvestDate?: string;
  lastActivity?: string;
  lastActivityDate?: string;
};

// Map events to farm states
export const EVENT_STATE_MAP: Record<TraceabilityEventType, FarmState> = {
  // Planning phase
  'plot_registration': 'planning',
  'land_preparation': 'planning',
  'soil_test': 'planning',
  
  // Planting phase
  'seed_planting': 'planting',
  'transplanting': 'planting',
  
  // Growing phase
  'irrigation': 'growing',
  'fertilizer_application': 'growing',
  'pesticide_application': 'growing',
  'pruning': 'growing',
  'weeding': 'growing',
  
  // Harvesting phase
  'harvest_start': 'harvesting',
  'harvest_collection': 'harvesting',
  'harvest_end': 'completed',
  
  // Post-harvest (completed)
  'sorting_grading': 'completed',
  'washing': 'completed',
  'packaging': 'completed',
  'storage': 'completed',
  'transfer_to_exporter': 'completed',
  
  // Quality & compliance (can happen in any phase)
  'quality_inspection': 'growing', // Default to growing
  'cold_storage': 'completed',
  'shipment_dispatch': 'completed',
  'delivery_confirmation': 'completed',
  'residue_test': 'growing',
  'certification_audit': 'growing',
  'quality_check': 'growing',
};

// State configuration for UI
export const FARM_STATE_CONFIG: Record<FarmState, {
  title: string;
  icon: string;
  color: string;
  description: string;
  primaryActions: string[];
}> = {
  planning: {
    title: 'Planning',
    icon: 'map-outline',
    color: '#8B5CF6', // Purple
    description: 'Prepare your plot for the growing season',
    primaryActions: ['Register Plot', 'Prepare Land', 'Test Soil']
  },
  planting: {
    title: 'Planting',
    icon: 'leaf-outline',
    color: '#10B981', // Green
    description: 'Plant seeds and establish your crops',
    primaryActions: ['Plant Seeds', 'Transplant', 'Initial Watering']
  },
  growing: {
    title: 'Growing',
    icon: 'flower-outline',
    color: '#059669', // Darker green
    description: 'Care for your crops as they develop',
    primaryActions: ['Water Plants', 'Apply Fertilizer', 'Weed Control']
  },
  harvesting: {
    title: 'Harvesting',
    icon: 'basket-outline',
    color: '#D97706', // Orange
    description: 'Collect your mature crops',
    primaryActions: ['Start Harvest', 'Collect Harvest', 'End Harvest']
  },
  completed: {
    title: 'Completed',
    icon: 'checkmark-circle',
    color: '#7C3AED', // Purple
    description: 'Season complete - prepare for next cycle',
    primaryActions: ['Sort & Grade', 'Package', 'Ship to Market']
  }
};

// Helper functions
export const getStateFromEvents = (events: { type: TraceabilityEventType; occurredAt: string }[]): FarmState => {
  if (events.length === 0) return 'planning';
  
  // Sort events by date and get the latest state
  const sortedEvents = events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  const latestEvent = sortedEvents[0];
  
  return EVENT_STATE_MAP[latestEvent.type] || 'planning';
};

export const calculateStateProgress = (
  currentState: FarmState, 
  events: { type: TraceabilityEventType; occurredAt: string }[]
): number => {
  switch (currentState) {
    case 'planning': {
      // Progress based on planning activities completed
      const planningTypes = ['plot_registration', 'land_preparation', 'soil_test'];
      const completedPlanning = planningTypes.filter(type => 
        events.some(e => e.type === type as TraceabilityEventType)
      ).length;
      return Math.min(100, (completedPlanning / planningTypes.length) * 100);
    }
      
    case 'planting': {
      // Progress based on planting activities
      const plantingTypes = ['seed_planting', 'transplanting'];
      const hasPlanting = events.some(e => plantingTypes.includes(e.type));
      return hasPlanting ? 100 : 50;
    }
      
    case 'growing': {
      // Progress based on care activities and time
      const growingTypes = ['irrigation', 'fertilizer_application', 'pesticide_application', 'pruning', 'weeding'];
      const growingActivities = events.filter(e => growingTypes.includes(e.type));
      
      // Base progress on number of care activities
      const baseProgress = Math.min(70, growingActivities.length * 15);
      
      // Add time-based progress (assuming 90-day growing cycle)
      const plantingDate = events.find(e => e.type === 'seed_planting' || e.type === 'transplanting')?.occurredAt;
      if (plantingDate) {
        const daysSincePlanting = Math.floor((Date.now() - new Date(plantingDate).getTime()) / (1000 * 60 * 60 * 24));
        const timeProgress = Math.min(30, (daysSincePlanting / 90) * 30);
        return Math.min(100, baseProgress + timeProgress);
      }
      return baseProgress;
    }
      
    case 'harvesting': {
      // Progress based on harvest activities
      const hasHarvestStart = events.some(e => e.type === 'harvest_start');
      const hasHarvestCollection = events.some(e => e.type === 'harvest_collection');
      const hasHarvestEnd = events.some(e => e.type === 'harvest_end');
      
      if (hasHarvestEnd) return 100;
      if (hasHarvestCollection) return 70;
      if (hasHarvestStart) return 30;
      return 0;
    }
      
    case 'completed':
      return 100;
      
    default:
      return 0;
  }
};

export const getNextSuggestedAction = (state: FarmState, events: { type: TraceabilityEventType }[]): string => {
  const eventTypes = events.map(e => e.type);
  
  switch (state) {
    case 'planning':
      if (!eventTypes.includes('plot_registration')) return 'Register your plot';
      if (!eventTypes.includes('land_preparation')) return 'Prepare the land';
      if (!eventTypes.includes('soil_test')) return 'Test soil quality';
      return 'Ready to start planting!';
      
    case 'planting':
      if (!eventTypes.includes('seed_planting') && !eventTypes.includes('transplanting')) {
        return 'Plant your seeds';
      }
      return 'Begin caring for your crops';
      
    case 'growing': {
      const recentIrrigation = events.some(e => e.type === 'irrigation');
      if (!recentIrrigation) return 'Water your plants';
      
      const recentFertilizer = events.some(e => e.type === 'fertilizer_application');
      if (!recentFertilizer) return 'Apply fertilizer';
      
      return 'Continue crop care activities';
    }
      
    case 'harvesting':
      if (!eventTypes.includes('harvest_start')) return 'Start harvesting';
      if (!eventTypes.includes('harvest_collection')) return 'Collect your harvest';
      return 'Finish harvest season';
      
    case 'completed':
      return 'Prepare for next season';
      
    default:
      return 'Begin with plot registration';
  }
};

export const getDaysInState = (
  state: FarmState, 
  events: { type: TraceabilityEventType; occurredAt: string }[]
): number => {
  const stateChangeEvents = events.filter(e => {
    const eventState = EVENT_STATE_MAP[e.type];
    return eventState === state;
  }).sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  
  if (stateChangeEvents.length === 0) return 0;
  
  const firstEventInState = stateChangeEvents[0];
  const daysSince = Math.floor((Date.now() - new Date(firstEventInState.occurredAt).getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysSince);
};