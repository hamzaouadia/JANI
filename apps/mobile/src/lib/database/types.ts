export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'error';

export type EventType =
  | 'farmer_onboarding'
  | 'plot_registration'
  | 'seed_lot'
  | 'planting'
  | 'input_application'
  | 'harvest'
  | 'transfer'
  | 'custom'
  | import('@/constants/traceabilityEvents').TraceabilityEventType;

export type MediaType = import('@/constants/traceabilityEvents').MediaFile['type'];

export type EventPayload = Record<string, unknown>;

export interface LocalEvent {
  id: string;
  clientId: string;
  type: EventType;
  actorRole: string;
  payload: EventPayload;
  status: SyncStatus;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  occurredAt: string;
  serverId: string | null;
}

export interface EventMedia {
  id: string;
  eventId: string;
  type: MediaType;
  uri: string;
  checksum: string;
  size: number;
  status: SyncStatus;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  serverId: string | null;
}

export interface SyncCursor {
  id: string;
  cursor: number;
  updatedAt: string;
}

export interface PendingUpload {
  id: string;
  eventId: string;
  mediaId: string;
  uploadUrl: string;
  method: string;
  headers: string;
  createdAt: string;
}
