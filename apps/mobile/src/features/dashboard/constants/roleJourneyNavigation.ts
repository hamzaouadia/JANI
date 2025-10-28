import type { JourneyStackParamList } from '@/navigation/types';
import type { UserRole } from '@/constants/userRoles';
export type JourneyAction<T extends keyof JourneyStackParamList = keyof JourneyStackParamList> = {
  label: string;
  target: T;
  params?: JourneyStackParamList[T];
};

type JourneyStageNavigation = Record<string, JourneyAction[]>;

export const ROLE_JOURNEY_NAVIGATION: Record<UserRole, JourneyStageNavigation> = {
  admin: {},
  farm: {
    'strategic-planning': [{ label: 'Adjust farm strategy', target: 'FarmDashboard' }],
    'resource-allocation': [{ label: 'Assign crews & inputs', target: 'TeamPlanner' }],
    establishment: [{ label: 'Monitor field establishment', target: 'TeamPlanner' }],
    'crop-performance': [{ label: 'Review crop performance', target: 'FarmDashboard' }],
    'harvest-operations': [{ label: 'Oversee harvest execution', target: 'FarmOrders' }],
    'postharvest-logistics': [{ label: 'Prepare outbound loads', target: 'FarmOrders' }],
    'performance-review': [{ label: 'Finalize compliance review', target: 'FarmDashboard' }]
  },
  exporter: {
    intake: [{ label: 'Validate inbound lots', target: 'ExportPipeline' }],
    grading: [{ label: 'Track grading batches', target: 'ExportPipeline' }],
    documentation: [{ label: 'Complete documentation', target: 'Compliance' }],
    'cold-chain': [{ label: 'Check cold room status', target: 'Compliance' }],
    logistics: [{ label: 'Schedule freight', target: 'ExportOrders' }],
    customs: [{ label: 'Monitor customs clearance', target: 'ExportOrders' }],
    'customer-feedback': [{ label: 'Review customer feedback', target: 'ExportPipeline' }]
  },
  buyer: {
    sourcing: [{ label: 'Review sourcing mix', target: 'BuyerOverview' }],
    vetting: [{ label: 'Manage supplier onboarding', target: 'SupplierNetwork' }],
    contracting: [{ label: 'Update contracts', target: 'SupplierNetwork' }],
    ordering: [{ label: 'Issue purchase orders', target: 'BuyerOrders' }],
    receiving: [{ label: 'Track inbound QA', target: 'BuyerOrders' }],
    merchandising: [{ label: 'Plan merchandising', target: 'BuyerOverview' }],
    analysis: [{ label: 'Review analytics', target: 'BuyerOverview' }]
  },
  logistics: {
    planning: [{ label: 'Optimize load plan', target: 'FleetBoard' }],
    'vehicle-prep': [{ label: 'Complete vehicle checks', target: 'FleetBoard' }],
    pickup: [{ label: 'Manage pickups', target: 'LogisticsLoads' }],
    'in-transit': [{ label: 'Monitor live routes', target: 'LogisticsLoads' }],
    handover: [{ label: 'Confirm delivery handoff', target: 'LogisticsLoads' }],
    'post-trip': [{ label: 'Close out trip admin', target: 'FleetBoard' }],
    'continuous-improvement': [{ label: 'Review fleet KPIs', target: 'FleetBoard' }]
  }
};
