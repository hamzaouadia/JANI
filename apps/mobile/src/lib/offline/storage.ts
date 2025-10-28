import { nanoid } from 'nanoid/non-secure';

import { withDatabase } from '@/lib/database';
import type { EventMedia, LocalEvent, PendingUpload, SyncStatus } from '@/lib/database/types';

const serialize = (value: unknown) => JSON.stringify(value);
const deserialize = <T>(value: string): T => JSON.parse(value) as T;

const toIsoString = () => new Date().toISOString();

type EventRow = {
  id: string;
  client_id: string;
  type: LocalEvent['type'];
  actor_role: string;
  payload: string;
  status: SyncStatus;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  occurred_at: string;
  server_id: string | null;
};

type MediaRow = {
  id: string;
  event_id: string;
  type: EventMedia['type'];
  uri: string;
  checksum: string;
  size: number;
  status: SyncStatus;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  server_id: string | null;
};

type PendingUploadRow = {
  id: string;
  event_id: string;
  media_id: string;
  upload_url: string;
  method: string;
  headers: string;
  created_at: string;
};

const mapEventRow = (row: EventRow): LocalEvent => ({
  id: row.id,
  clientId: row.client_id,
  type: row.type,
  actorRole: row.actor_role,
  payload: deserialize(row.payload),
  status: row.status,
  lastError: row.last_error,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  occurredAt: row.occurred_at,
  serverId: row.server_id
});

const mapMediaRow = (row: MediaRow): EventMedia => ({
  id: row.id,
  eventId: row.event_id,
  type: row.type,
  uri: row.uri,
  checksum: row.checksum,
  size: row.size,
  status: row.status,
  lastError: row.last_error,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  serverId: row.server_id
});

const mapPendingUpload = (row: PendingUploadRow): PendingUpload => ({
  id: row.id,
  eventId: row.event_id,
  mediaId: row.media_id,
  uploadUrl: row.upload_url,
  method: row.method,
  headers: row.headers,
  createdAt: row.created_at
});

export const insertEvent = async (event: Omit<LocalEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
  const id = nanoid();
  const timestamp = toIsoString();

  await withDatabase((db) => {
    db.runSync(
      `INSERT INTO events (id, client_id, type, actor_role, payload, status, last_error, created_at, updated_at, occurred_at, server_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ,
      [
        id,
        event.clientId,
        event.type,
        event.actorRole,
        serialize(event.payload),
        event.status,
        event.lastError,
        timestamp,
        timestamp,
        event.occurredAt,
        event.serverId
      ]
    );
  });

  return { ...event, id, createdAt: timestamp, updatedAt: timestamp } as LocalEvent;
};

export const insertMedia = async (media: Omit<EventMedia, 'id' | 'createdAt' | 'updatedAt'>) => {
  const id = nanoid();
  const timestamp = toIsoString();

  await withDatabase((db) => {
    db.runSync(
      `INSERT INTO media (id, event_id, type, uri, checksum, size, status, last_error, created_at, updated_at, server_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ,
      [
        id,
        media.eventId,
        media.type,
        media.uri,
        media.checksum,
        media.size,
        media.status,
        media.lastError,
        timestamp,
        timestamp,
        media.serverId
      ]
    );
  });

  return { ...media, id, createdAt: timestamp, updatedAt: timestamp } as EventMedia;
};

export const listPendingEvents = async (): Promise<LocalEvent[]> => {
  return withDatabase((db) => {
    const rows = db.getAllSync<EventRow>(
      `SELECT * FROM events WHERE status IN ('pending', 'error') ORDER BY created_at ASC`,
      []
    );
    return rows.map(mapEventRow);
  });
};

export const listMediaForEvent = async (eventId: string): Promise<EventMedia[]> => {
  return withDatabase((db) => {
    const rows = db.getAllSync<MediaRow>(
      `SELECT * FROM media WHERE event_id = ? ORDER BY created_at ASC`,
      [eventId]
    );
    return rows.map(mapMediaRow);
  });
};

export const updateEventStatus = async (
  eventId: string,
  status: SyncStatus,
  options: { serverId?: string | null; error?: string | null } = {}
) => {
  const timestamp = toIsoString();
  await withDatabase((db) => {
    db.runSync(
      `UPDATE events SET status = ?, last_error = ?, updated_at = ?, server_id = COALESCE(?, server_id)
       WHERE id = ?`,
      [status, options.error ?? null, timestamp, options.serverId ?? null, eventId]
    );
  });
};

export const updateMediaStatus = async (
  mediaId: string,
  status: SyncStatus,
  options: { serverId?: string | null; error?: string | null } = {}
) => {
  const timestamp = toIsoString();
  await withDatabase((db) => {
    db.runSync(
      `UPDATE media SET status = ?, last_error = ?, updated_at = ?, server_id = COALESCE(?, server_id)
       WHERE id = ?`,
      [status, options.error ?? null, timestamp, options.serverId ?? null, mediaId]
    );
  });
};

export const removeEvent = async (eventId: string) => {
  await withDatabase((db) => {
    db.runSync(`DELETE FROM events WHERE id = ?`, [eventId]);
  });
};

export const storePendingUploads = async (entries: PendingUpload[]) => {
  if (!entries.length) {
    return;
  }

  await withDatabase((db) => {
    db.withTransactionSync(() => {
      for (const entry of entries) {
        db.runSync(
          `REPLACE INTO pending_uploads (id, event_id, media_id, upload_url, method, headers, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
          ,
          [entry.id, entry.eventId, entry.mediaId, entry.uploadUrl, entry.method, entry.headers, entry.createdAt]
        );
      }
    });
  });
};

export const listPendingUploads = async (): Promise<PendingUpload[]> => {
  return withDatabase((db) => {
    const rows = db.getAllSync<PendingUploadRow>(
      `SELECT * FROM pending_uploads ORDER BY created_at ASC`,
      []
    );
    return rows.map(mapPendingUpload);
  });
};

export const removePendingUpload = async (id: string) => {
  await withDatabase((db) => {
    db.runSync(`DELETE FROM pending_uploads WHERE id = ?`, [id]);
  });
};

export const updateSyncCursor = async (cursorId: string, cursor: number) => {
  const timestamp = toIsoString();
  await withDatabase((db) => {
    db.runSync(
      `REPLACE INTO sync_cursors (id, cursor, updated_at) VALUES (?, ?, ?)`
      ,
      [cursorId, cursor, timestamp]
    );
  });
};

export const readSyncCursor = async (cursorId: string) => {
  return withDatabase((db) => {
    const row = db.getFirstSync<{ cursor: number }>(
      `SELECT cursor FROM sync_cursors WHERE id = ?`,
      [cursorId]
    );

    if (!row) {
      return null;
    }

    return Number(row.cursor);
  });
};
