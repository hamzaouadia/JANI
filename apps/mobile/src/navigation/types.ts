import type { TraceabilityEventType } from '@/constants/traceabilityEvents';
import type { UserRole } from '@/constants/userRoles';
export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: { role?: UserRole } | undefined;
};

export type JourneyStackParamList = {
  JourneyHome: undefined;
  Capture: { stageId: string; eventType: TraceabilityEventType };
  TraceabilityEvent: { eventType: TraceabilityEventType };
  TraceabilityEventsList: undefined;
  FieldOps: undefined;
  HarvestOrders: undefined;
  FarmDashboard: undefined;
  TeamPlanner: undefined;
  FarmOrders: undefined;
  ExportPipeline: undefined;
  Compliance: undefined;
  ExportOrders: undefined;
  BuyerOverview: undefined;
  SupplierNetwork: undefined;
  BuyerOrders: undefined;
  FleetBoard: undefined;
  ColdChain: undefined;
  LogisticsLoads: undefined;
  UIComponents: undefined;
};

export type MainTabsParamList = {
  Journey: undefined;
  Farms: undefined;
  Capture: undefined;
  AI: undefined;
  Records: undefined;
  Incentives: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  AppTabs: undefined;
};
