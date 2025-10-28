import type { TraceabilityEventPayload, TraceabilityEventType, MediaFile } from '@/constants/traceabilityEvents';

export type CaptureContext = {
  actorRole: string;
};

export type CaptureEventPayload = {
  type: TraceabilityEventType;
  occurredAt: string;
  payload: TraceabilityEventPayload;
  clientId?: string;
  actorRole?: string;
};

export type CaptureMediaPayload = {
  type: MediaFile['type'];
  uri: string;
  checksum: string;
  size: number;
};
