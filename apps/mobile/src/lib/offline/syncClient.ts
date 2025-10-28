import * as FileSystem from 'expo-file-system/legacy';
import type { AxiosInstance } from 'axios';
import type { EventMedia, LocalEvent, PendingUpload } from '@/lib/database/types';

type PushRequest = {
  clientSeq: number;
  deviceId: string;
  events: Array<{
    clientId: string;
    type: LocalEvent['type'];
    occurredAt: string;
    payload: LocalEvent['payload'];
    media: Array<{
      clientId: string;
      checksum: string;
      size: number;
      type: EventMedia['type'];
    }>;
  }>;
};

type PushResponse = {
  serverSeq: number;
  results: Array<{
    clientId: string;
    status: 'success' | 'conflict' | 'rejected';
    serverId?: string;
    error?: string;
  }>;
  mediaPresigned: Array<{
    id: string;
    clientId: string;
    uploadUrl: string;
    method: string;
    headers: Record<string, string>;
  }>;
};

type CommitRequest = {
  events: string[];
  media: string[];
};

type PullResponse = {
  serverSeq: number;
  events: Array<{
    id: string;
    type: LocalEvent['type'];
    payload: LocalEvent['payload'];
    occurredAt: string;
    actorRole: string;
  }>;
};

export type CreateSyncClientParams = {
  apiClient: AxiosInstance;
  deviceId: string;
};

export const createSyncClient = ({ apiClient, deviceId }: CreateSyncClientParams) => {
  let clientSequence = 0;

  const buildPushPayload = (queue: Array<{ event: LocalEvent; media: EventMedia[] }>): PushRequest => ({
    clientSeq: ++clientSequence,
    deviceId,
    events: queue.map((item) => ({
      clientId: item.event.clientId,
      type: item.event.type,
      occurredAt: item.event.occurredAt,
      payload: item.event.payload,
      media: item.media.map((media) => ({
        clientId: media.id,
        checksum: media.checksum,
        size: media.size,
        type: media.type
      }))
    }))
  });

  const push = async (queue: Array<{ event: LocalEvent; media: EventMedia[] }>) => {
    const response = await apiClient.post<PushResponse>('/sync/push', buildPushPayload(queue));
    const pendingUploads: PendingUpload[] = response.data.mediaPresigned.map((entry) => ({
      id: entry.id,
      eventId: queue.find((item) => item.media.some((media) => media.id === entry.clientId))?.event.id ?? '',
      mediaId: entry.clientId,
      uploadUrl: entry.uploadUrl,
      method: entry.method,
      headers: JSON.stringify(entry.headers),
      createdAt: new Date().toISOString()
    }));

    return {
      serverSeq: response.data.serverSeq,
      results: response.data.results,
      pendingUploads
    };
  };

  const commit = async (eventIds: string[], mediaIds: string[]) => {
    const payload: CommitRequest = { events: eventIds, media: mediaIds };
    await apiClient.post('/sync/commit', payload);
  };

  const completeUpload = async (mediaId: string) => {
    await apiClient.post(`/sync/media/${mediaId}/complete`);
  };

  const pull = async (cursor: number | null) => {
    const response = await apiClient.get<PullResponse>('/sync/pull', {
      params: {
        since: cursor ?? undefined
      }
    });

    return {
      serverSeq: response.data.serverSeq,
      events: response.data.events.map((event) => ({
        id: event.id,
        clientId: event.id,
        type: event.type,
        actorRole: event.actorRole,
        payload: event.payload,
        status: 'synced',
        lastError: null,
        createdAt: event.occurredAt,
        updatedAt: event.occurredAt,
        occurredAt: event.occurredAt,
        serverId: event.id
      })) satisfies LocalEvent[]
    };
  };

  const uploadMedia = async (upload: PendingUpload, media: EventMedia) => {
    const headers = JSON.parse(upload.headers) as Record<string, string>;
    await FileSystem.uploadAsync(upload.uploadUrl, media.uri, {
      httpMethod: upload.method as FileSystem.FileSystemAcceptedUploadHttpMethod,
      headers,
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT
    });
    await completeUpload(upload.id);
  };

  const prepareMedia = async (
    files: Array<{ clientId: string; checksum: string; size: number; mimeType: string }>
  ): Promise<PendingUpload[]> => {
    const { data } = await apiClient.post<{ uploads: Array<{ id: string; clientId: string; uploadUrl: string; method: string; headers: Record<string, string> }> }>(
      '/media/prepare',
      { files }
    );

    return data.uploads.map((u) => ({
      id: u.id,
      eventId: '',
      mediaId: u.clientId,
      uploadUrl: u.uploadUrl,
      method: u.method,
      headers: JSON.stringify(u.headers),
      createdAt: new Date().toISOString()
    }));
  };

  return {
    push,
    commit,
    pull,
    uploadMedia,
    completeUpload,
    prepareMedia
  };
};
