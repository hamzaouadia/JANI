import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

import { CURRENT_SCHEMA_VERSION, DB_NAME, MIGRATIONS } from './schema';

let database: SQLiteDatabase | null = null;

const getDatabase = (): SQLiteDatabase => {
  if (database) {
    return database;
  }

  database = openDatabaseSync(DB_NAME);
  return database;
};

const ensureMigrations = () => {
  const db = getDatabase();
  db.execSync('CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);');

  const rows = db.getAllSync<{ value: string }>('SELECT value FROM meta WHERE key = ? LIMIT 1', ['schema_version']);
  const currentVersion = Number(rows[0]?.value ?? 0);

  if (currentVersion >= CURRENT_SCHEMA_VERSION) {
    return;
  }

  db.execSync('BEGIN');
  try {
    for (let index = currentVersion; index < MIGRATIONS.length; index += 1) {
      db.execSync(MIGRATIONS[index]);
    }

    db.runSync('REPLACE INTO meta (key, value) VALUES (?, ?)', ['schema_version', String(CURRENT_SCHEMA_VERSION)]);
    db.execSync('COMMIT');
  } catch (error) {
    db.execSync('ROLLBACK');
    throw error;
  }
};

export const withDatabase = <T>(callback: (_db: SQLiteDatabase) => T): T => {
  ensureMigrations();
  const db = getDatabase();
  return callback(db);
};

export const useDatabase = getDatabase;
