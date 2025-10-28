import type { EventMedia, LocalEvent, PendingUpload } from '@/lib/database/types';
export type QueueItem = {
  event: LocalEvent;
  media: EventMedia[];
};

export type PushResult = {
  clientId: string;
  status: 'success' | 'conflict' | 'rejected';
  serverId?: string;
  error?: string;
};

export type PushResponse = {
  results: PushResult[];
  pendingUploads: PendingUpload[];
  serverSeq: number;
};

export type PullResponse = {
  serverSeq: number;
  events: LocalEvent[];
};

export interface SyncClient {
  push: (_items: QueueItem[]) => Promise<PushResponse>;
  commit: (_eventIds: string[], _mediaIds: string[]) => Promise<void>;
  completeUpload: (_mediaId: string) => Promise<void>;
  uploadMedia: (_upload: PendingUpload, _media: EventMedia) => Promise<void>;
  prepareMedia: (_files: Array<{ clientId: string; checksum: string; size: number; mimeType: string }>) => Promise<PendingUpload[]>;
  pull: (_cursor: number | null) => Promise<PullResponse>;
}

export interface SyncConfig {
  batchSize: number;
  maxBandwidthBytes: number;
  cursorId: string;
  syncClient: SyncClient;
  onEventSynced?: (_event: LocalEvent) => void;
  onSyncError?: (_event: LocalEvent, _error: string) => void;
}

export const bytesForQueueItem = (item: QueueItem) => {
  const payloadBytes = JSON.stringify(item.event.payload ?? {}).length;
  const mediaBytes = item.media.reduce((sum, media) => sum + media.size, 0);
  return payloadBytes + mediaBytes;
};
