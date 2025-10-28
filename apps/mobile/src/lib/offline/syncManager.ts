import { AppState } from 'react-native';
import { EventEmitter } from 'events';
import NetInfo from '@react-native-community/netinfo';
import type { NetInfoState } from '@react-native-community/netinfo';
import type { EventMedia, LocalEvent, PendingUpload } from '@/lib/database/types';

import {
  insertEvent,
  insertMedia,
  listMediaForEvent,
  listPendingEvents,
  listPendingUploads,
  readSyncCursor,
  removePendingUpload,
  storePendingUploads,
  updateEventStatus,
  updateMediaStatus,
  updateSyncCursor
} from '@/lib/offline/storage';
import { bytesForQueueItem } from '@/lib/offline/queue';
import type { QueueItem, SyncClient, SyncConfig } from '@/lib/offline/queue';

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
const MIN_SYNC_INTERVAL = 30 * 1000;

type SyncManagerOptions = {
  config: Omit<SyncConfig, 'syncClient'>;
  syncClient: SyncClient;
};

type CaptureEventInput = {
  event: Omit<LocalEvent, 'id' | 'status' | 'lastError' | 'serverId' | 'createdAt' | 'updatedAt'>;
  media?: Array<Omit<EventMedia, 'id' | 'status' | 'lastError' | 'serverId' | 'createdAt' | 'updatedAt'>>;
};

type SyncEvent = 'sync:start' | 'sync:success' | 'sync:error' | 'queue:changed';

export class SyncManager {
  private readonly options: SyncManagerOptions;
  private lastSync = 0;
  private syncing = false;
  private emitter = new EventEmitter();

  private appStateSubscription?: ReturnType<typeof AppState.addEventListener>;
  private netInfoUnsubscribe?: () => void;

  constructor(options: SyncManagerOptions) {
    this.options = options;
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    this.netInfoUnsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
  }

  destroy() {
    this.appStateSubscription?.remove();
    this.netInfoUnsubscribe?.();
  }

  on(event: SyncEvent, listener: (..._args: unknown[]) => void) {
    this.emitter.on(event, listener);
    return () => this.emitter.off(event, listener);
  }

  private handleAppStateChange = (state: string) => {
    if (state === 'active') {
      void this.triggerSync();
    }
  };

  private handleConnectivityChange = (state: NetInfoState) => {
    if (state.isConnected && state.isInternetReachable) {
      void this.triggerSync();
    }
  };

  async captureEvent(input: CaptureEventInput) {
    const storedEvent = await insertEvent({
      clientId: input.event.clientId,
      type: input.event.type,
      actorRole: input.event.actorRole,
      payload: input.event.payload,
      occurredAt: input.event.occurredAt,
      status: 'pending',
      lastError: null,
      serverId: null
    });

    const mediaResults: EventMedia[] = [];
    for (const media of input.media ?? []) {
      const inserted = await insertMedia({
        eventId: storedEvent.id,
        type: media.type,
        uri: media.uri,
        checksum: media.checksum,
        size: media.size,
        status: 'pending',
        lastError: null,
        serverId: null
      });
      mediaResults.push(inserted);
    }

    this.emitter.emit('queue:changed');
    void this.triggerSync();

    return {
      event: storedEvent,
      media: mediaResults
    };
  }

  private async buildQueue(): Promise<QueueItem[]> {
    const pendingEvents = await listPendingEvents();
    const queue: QueueItem[] = [];

    for (const event of pendingEvents) {
      const media = await listMediaForEvent(event.id);
      queue.push({ event, media });
    }

    return queue;
  }

  private async prepareMediaForBatch(batch: QueueItem[]) {
    const files: Array<{ clientId: string; checksum: string; size: number; mimeType: string; eventId: string }> = [];
    for (const item of batch) {
      for (const m of item.media) {
        if (m.status === 'pending') {
          const mimeType = m.type === 'photo' ? 'image/jpeg' : m.type === 'video' ? 'video/mp4' : 'application/octet-stream';
          files.push({ clientId: m.id, checksum: m.checksum, size: m.size, mimeType, eventId: item.event.id });
        }
      }
    }

    if (!files.length) return;

    const uploads = await this.options.syncClient.prepareMedia(files.map(({ eventId: _eventId, ...rest }) => rest));

    // Store with event references
    await storePendingUploads(
      uploads.map((u) => ({ ...u, eventId: files.find((f) => f.clientId === u.mediaId)?.eventId || '' }))
    );
  }

  private async uploadPendingMedia(pendingUploads: PendingUpload[]) {
    const { syncClient } = this.options;
    const mediaIds = new Set(pendingUploads.map((upload) => upload.mediaId));

    for (const upload of pendingUploads) {
      const mediaList = await listMediaForEvent(upload.eventId);
      const media = mediaList.find((item) => item.id === upload.mediaId);
      if (!media) {
        await removePendingUpload(upload.id);
        continue;
      }

      try {
        await syncClient.uploadMedia(upload, media);
        await updateMediaStatus(media.id, 'synced', { serverId: upload.id });
        await removePendingUpload(upload.id);
      } catch (error) {
        await updateMediaStatus(media.id, 'error', {
          error: error instanceof Error ? error.message : 'Media upload failed'
        });
        this.options.config.onSyncError?.(media as unknown as LocalEvent, 'Media upload failed');
      }
    }

    return Array.from(mediaIds);
  }

  private chunkQueue(queue: QueueItem[]) {
    const batches: QueueItem[][] = [];
    const { batchSize = DEFAULT_BATCH_SIZE, maxBandwidthBytes = DEFAULT_MAX_BYTES } = this.options.config;

    let currentBatch: QueueItem[] = [];
    let currentBytes = 0;

    for (const item of queue) {
      const itemBytes = bytesForQueueItem(item);

      if (currentBatch.length >= batchSize || currentBytes + itemBytes > maxBandwidthBytes) {
        batches.push(currentBatch);
        currentBatch = [];
        currentBytes = 0;
      }

      currentBatch.push(item);
      currentBytes += itemBytes;
    }

    if (currentBatch.length) {
      batches.push(currentBatch);
    }

    return batches;
  }

  async triggerSync(force = false) {
    if (this.syncing) {
      return;
    }

    const now = Date.now();
    if (!force && now - this.lastSync < MIN_SYNC_INTERVAL) {
      return;
    }

    this.syncing = true;
    this.lastSync = now;
    this.emitter.emit('sync:start');

    try {
      const queue = await this.buildQueue();
      if (!queue.length) {
        this.emitter.emit('sync:success');
        this.syncing = false;
        return;
      }

      const batches = this.chunkQueue(queue);
      const syncClient = this.options.syncClient;
      const syncedEventIds: string[] = [];
      const syncedMediaIds: string[] = [];
      let latestServerSeq: number | null = null;

      for (const batch of batches) {
        // Prepare presigned uploads for any pending media in this batch
        await this.prepareMediaForBatch(batch);

        const pendingUploads = await listPendingUploads();
        if (pendingUploads.length) {
          const mediaIds = await this.uploadPendingMedia(pendingUploads);
          syncedMediaIds.push(...mediaIds);
        }

        const response = await syncClient.push(batch);
        latestServerSeq = response.serverSeq;

        const batchEventMap = new Map(batch.map((item) => [item.event.clientId, item.event]));
        for (const result of response.results) {
          const event = batchEventMap.get(result.clientId);
          if (!event) {
            continue;
          }

          if (result.status === 'success') {
            await updateEventStatus(event.id, 'synced', {
              serverId: result.serverId ?? null
            });
            syncedEventIds.push(event.id);
            this.options.config.onEventSynced?.(event);
          } else {
            await updateEventStatus(event.id, 'error', {
              error: result.error ?? 'Sync failed'
            });
            this.options.config.onSyncError?.(event, result.error ?? 'Sync failed');
          }
        }

        if (response.pendingUploads.length) {
          await storePendingUploads(response.pendingUploads);
        }
      }

      if (syncedEventIds.length || syncedMediaIds.length) {
        await this.options.syncClient.commit(syncedEventIds, syncedMediaIds);
      }

      if (latestServerSeq !== null) {
        await updateSyncCursor(this.options.config.cursorId, latestServerSeq);
      }

      this.emitter.emit('sync:success');
    } catch (error) {
      this.emitter.emit('sync:error', error);
    } finally {
      this.syncing = false;
      this.emitter.emit('queue:changed');
    }
  }

  async pullUpdates() {
    const cursor = await readSyncCursor(this.options.config.cursorId);
    const response = await this.options.syncClient.pull(cursor);
    if (response.serverSeq) {
      await updateSyncCursor(this.options.config.cursorId, response.serverSeq);
    }

    return response.events;
  }
}
