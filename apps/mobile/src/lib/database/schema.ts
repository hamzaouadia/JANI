export const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY NOT NULL,
      client_id TEXT NOT NULL,
      type TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      server_id TEXT
    );`,
  `CREATE INDEX IF NOT EXISTS idx_events_status ON events (status);`,
  `CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY NOT NULL,
      event_id TEXT NOT NULL,
      type TEXT NOT NULL,
      uri TEXT NOT NULL,
      checksum TEXT NOT NULL,
      size INTEGER NOT NULL,
      status TEXT NOT NULL,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      server_id TEXT,
      FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
    );`,
  `CREATE INDEX IF NOT EXISTS idx_media_status ON media (status);`,
  `CREATE INDEX IF NOT EXISTS idx_media_event_id ON media (event_id);`,
  `CREATE TABLE IF NOT EXISTS sync_cursors (
      id TEXT PRIMARY KEY NOT NULL,
      cursor INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS pending_uploads (
      id TEXT PRIMARY KEY NOT NULL,
      event_id TEXT NOT NULL,
      media_id TEXT NOT NULL,
      upload_url TEXT NOT NULL,
      method TEXT NOT NULL,
      headers TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
      FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE
    );`
];

export const DB_NAME = 'jani_offline.db';

export const CURRENT_SCHEMA_VERSION = MIGRATIONS.length;
