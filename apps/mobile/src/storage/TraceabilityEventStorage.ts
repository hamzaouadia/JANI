import * as SQLite from 'expo-sqlite';

import type { TraceabilityEventType } from '@/constants/traceabilityEvents';

// Legacy expo-sqlite types for backward compatibility
type SQLArg = string | number | null;

type LegacyResultSet = {
  insertId?: number;
  rowsAffected: number;
  rows: {
    length: number;
    item: (_index: number) => Record<string, unknown>;
    _array: Record<string, unknown>[];
  };
};

type LegacyTransaction = {
  executeSql: (
    _sqlStatement: string,
    _args?: SQLArg[] | null,
    _callback?: (_transaction: LegacyTransaction, _resultSet: LegacyResultSet) => void,
    _errorCallback?: (_transaction: LegacyTransaction, _error: Error) => boolean | void
  ) => void;
};

type LegacyDatabase = {
  transaction: (
    _callback: (_transaction: LegacyTransaction) => void,
    _errorCallback?: (_error: Error) => void,
    _successCallback?: () => void
  ) => void;
};

export interface StoredTraceabilityEvent {
  id?: number; // SQLite auto-increment ID
  eventId: string; // UUID for sync
  type: TraceabilityEventType;
  farmId: string;
  plotId?: string;
  userId: string;
  occurredAt: string; // ISO date string
  recordedAt: string; // ISO date string
  description?: string;
  
  // Event-specific metadata (stored as JSON)
  metadata?: {
    // Seed planting
    seedVariety?: string;
    seedQuantity?: number;
    seedUnit?: string;
    
    // Irrigation
    waterAmount?: number;
    waterSource?: string;
    irrigationMethod?: string;
    
    // Fertilizer
    fertilizerType?: string;
    fertilizerAmount?: number;
    fertilizerUnit?: string;
    applicationMethod?: string;
    
    // Pesticide
    pesticideType?: string;
    pesticideAmount?: number;
    pesticideUnit?: string;
    targetPest?: string;
    
    // Harvest
    harvestedQuantity?: number;
    harvestedUnit?: string;
    qualityGrade?: string;
    
    // Quality inspection
    inspectorName?: string;
    inspectionResult?: string;
    certificationBody?: string;
    
    // General
    temperature?: number;
    humidity?: number;
    weatherConditions?: string;
    equipmentUsed?: string[];
    laborersCount?: number;
    cost?: number;
    notes?: string;
  };
  
  // Location data (stored as JSON)
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  
  // Photos/attachments (stored as JSON array)
  attachments?: Array<{
    type: 'photo' | 'document' | 'receipt';
    localUri: string; // Local file path
    remoteUrl?: string; // Remote URL after upload
    filename: string;
    size?: number;
    uploadedAt?: string;
  }>;
  
  // Sync status
  syncStatus: 'pending' | 'synced' | 'failed';
  syncedAt?: string;
  remoteId?: string; // Server-side MongoDB _id
  
  // Verification
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  
  // Audit
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  farmId?: string;
  plotId?: string;
  type?: TraceabilityEventType;
  startDate?: string;
  endDate?: string;
  syncStatus?: 'pending' | 'synced' | 'failed';
  verified?: boolean;
  limit?: number;
  offset?: number;
}

class TraceabilityEventStorage {
  private db: LegacyDatabase | null = null;
  private initialized = false;

  constructor() {
    // Database will be opened asynchronously in initialize()
  }

  private getDatabase(): LegacyDatabase {
    if (!this.db) {
      throw new Error('TraceabilityEventStorage is not initialized');
    }
    return this.db;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // @ts-expect-error - Using legacy expo-sqlite API
    this.db = SQLite.openDatabaseSync ? SQLite.openDatabaseSync('traceability_events.db') : SQLite.openDatabase('traceability_events.db');

    return new Promise((resolve, reject) => {
      this.db!.transaction(
        (tx: LegacyTransaction) => {
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS traceability_events (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              eventId TEXT UNIQUE NOT NULL,
              type TEXT NOT NULL,
              farmId TEXT NOT NULL,
              plotId TEXT,
              userId TEXT NOT NULL,
              occurredAt TEXT NOT NULL,
              recordedAt TEXT NOT NULL,
              description TEXT,
              metadata TEXT, -- JSON
              location TEXT, -- JSON
              attachments TEXT, -- JSON array
              syncStatus TEXT DEFAULT 'pending',
              syncedAt TEXT,
              remoteId TEXT,
              verified INTEGER DEFAULT 0,
              verifiedBy TEXT,
              verifiedAt TEXT,
              createdBy TEXT NOT NULL,
              updatedBy TEXT,
              createdAt TEXT NOT NULL,
              updatedAt TEXT NOT NULL
            )
          `);

          // Create indexes for better performance
          tx.executeSql(`
            CREATE INDEX IF NOT EXISTS idx_farm_occurred 
            ON traceability_events(farmId, occurredAt)
          `);
          
          tx.executeSql(`
            CREATE INDEX IF NOT EXISTS idx_plot_occurred 
            ON traceability_events(plotId, occurredAt)
          `);
          
          tx.executeSql(`
            CREATE INDEX IF NOT EXISTS idx_sync_status 
            ON traceability_events(syncStatus)
          `);
          
          tx.executeSql(`
            CREATE INDEX IF NOT EXISTS idx_event_id 
            ON traceability_events(eventId)
          `);
        },
        error => {
          console.error('Database initialization failed:', error);
          reject(error);
        },
        () => {
          this.initialized = true;
          console.log('TraceabilityEventStorage initialized');
          resolve();
        }
      );
    });
  }

  async createEvent(event: Omit<StoredTraceabilityEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoredTraceabilityEvent> {
    await this.initialize();
    
    const now = new Date().toISOString();
    const eventWithTimestamps = {
      ...event,
      createdAt: now,
      updatedAt: now
    };

    return new Promise((resolve, reject) => {
      this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            `INSERT INTO traceability_events (
              eventId, type, farmId, plotId, userId, occurredAt, recordedAt,
              description, metadata, location, attachments, syncStatus, syncedAt,
              remoteId, verified, verifiedBy, verifiedAt, createdBy, updatedBy,
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              eventWithTimestamps.eventId,
              eventWithTimestamps.type,
              eventWithTimestamps.farmId,
              eventWithTimestamps.plotId || null,
              eventWithTimestamps.userId,
              eventWithTimestamps.occurredAt,
              eventWithTimestamps.recordedAt,
              eventWithTimestamps.description || null,
              eventWithTimestamps.metadata ? JSON.stringify(eventWithTimestamps.metadata) : null,
              eventWithTimestamps.location ? JSON.stringify(eventWithTimestamps.location) : null,
              eventWithTimestamps.attachments ? JSON.stringify(eventWithTimestamps.attachments) : null,
              eventWithTimestamps.syncStatus,
              eventWithTimestamps.syncedAt || null,
              eventWithTimestamps.remoteId || null,
              eventWithTimestamps.verified ? 1 : 0,
              eventWithTimestamps.verifiedBy || null,
              eventWithTimestamps.verifiedAt || null,
              eventWithTimestamps.createdBy,
              eventWithTimestamps.updatedBy || null,
              eventWithTimestamps.createdAt,
              eventWithTimestamps.updatedAt
            ],
            (_: LegacyTransaction, result: LegacyResultSet) => {
              resolve({
                ...eventWithTimestamps,
                id: result.insertId
              });
            }
          );
        },
        error => {
          console.error('Failed to create event:', error);
          reject(error);
        }
      );
    });
  }

  async getEvents(filters: EventFilters = {}): Promise<StoredTraceabilityEvent[]> {
    await this.initialize();

    let query = 'SELECT * FROM traceability_events WHERE 1=1';
  const params: SQLArg[] = [];

    if (filters.farmId) {
      query += ' AND farmId = ?';
      params.push(filters.farmId);
    }

    if (filters.plotId) {
      query += ' AND plotId = ?';
      params.push(filters.plotId);
    }

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.startDate) {
      query += ' AND occurredAt >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND occurredAt <= ?';
      params.push(filters.endDate);
    }

    if (filters.syncStatus) {
      query += ' AND syncStatus = ?';
      params.push(filters.syncStatus);
    }

    if (filters.verified !== undefined) {
      query += ' AND verified = ?';
      params.push(filters.verified ? 1 : 0);
    }

    query += ' ORDER BY occurredAt DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    return new Promise((resolve, reject) => {
      this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            query,
            params,
            (_: LegacyTransaction, result: LegacyResultSet) => {
              const events: StoredTraceabilityEvent[] = [];
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                events.push(this.parseEventRow(row));
              }
              resolve(events);
            }
          );
        },
        error => {
          console.error('Failed to get events:', error);
          reject(error);
        }
      );
    });
  }

  async getEventById(id: number): Promise<StoredTraceabilityEvent | null> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM traceability_events WHERE id = ?',
            [id],
            (_: LegacyTransaction, result: LegacyResultSet) => {
              if (result.rows.length > 0) {
                resolve(this.parseEventRow(result.rows.item(0)));
              } else {
                resolve(null);
              }
            }
          );
        },
        error => {
          console.error('Failed to get event by ID:', error);
          reject(error);
        }
      );
    });
  }

  async getEventByEventId(eventId: string): Promise<StoredTraceabilityEvent | null> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM traceability_events WHERE eventId = ?',
            [eventId],
            (_: LegacyTransaction, result: LegacyResultSet) => {
              if (result.rows.length > 0) {
                resolve(this.parseEventRow(result.rows.item(0)));
              } else {
                resolve(null);
              }
            }
          );
        },
        error => {
          console.error('Failed to get event by eventId:', error);
          reject(error);
        }
      );
    });
  }

  async updateEvent(id: number, updates: Partial<StoredTraceabilityEvent>): Promise<StoredTraceabilityEvent | null> {
    await this.initialize();

    const updateFields: string[] = [];
    const params: SQLArg[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'id' || value === undefined) {
        return; // Skip ID and unset values
      }

      updateFields.push(`${key} = ?`);

      if (key === 'metadata' || key === 'location' || key === 'attachments') {
        params.push(value === null ? null : JSON.stringify(value));
        return;
      }

      if (key === 'verified' || typeof value === 'boolean') {
        params.push(value ? 1 : 0);
        return;
      }

      if (typeof value === 'number' || typeof value === 'string') {
        params.push(value);
        return;
      }

      params.push(null);
    });

    updateFields.push('updatedAt = ?');
    params.push(new Date().toISOString());
    params.push(id);

    return new Promise((resolve, reject) => {
      this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            `UPDATE traceability_events SET ${updateFields.join(', ')} WHERE id = ?`,
            params,
            (_: LegacyTransaction, result: LegacyResultSet) => {
              if (result.rowsAffected > 0) {
                this.getEventById(id).then(resolve).catch(reject);
              } else {
                resolve(null);
              }
            }
          );
        },
        error => {
          console.error('Failed to update event:', error);
          reject(error);
        }
      );
    });
  }

  async deleteEvent(id: number): Promise<boolean> {
    await this.initialize();

    return new Promise((resolve, reject) => {
  this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            'DELETE FROM traceability_events WHERE id = ?',
            [id],
            (_: LegacyTransaction, result: LegacyResultSet) => {
              resolve(result.rowsAffected > 0);
            }
          );
        },
        error => {
          console.error('Failed to delete event:', error);
          reject(error);
        }
      );
    });
  }

  async getPendingSyncEvents(): Promise<StoredTraceabilityEvent[]> {
    return this.getEvents({ syncStatus: 'pending' });
  }

  async markEventAsSynced(eventId: string, remoteId: string): Promise<void> {
    await this.initialize();

    return new Promise((resolve, reject) => {
  this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            'UPDATE traceability_events SET syncStatus = ?, syncedAt = ?, remoteId = ?, updatedAt = ? WHERE eventId = ?',
            ['synced', new Date().toISOString(), remoteId, new Date().toISOString(), eventId],
            () => resolve()
          );
        },
        error => {
          console.error('Failed to mark event as synced:', error);
          reject(error);
        }
      );
    });
  }

  async markEventAsSyncFailed(eventId: string): Promise<void> {
    await this.initialize();

    return new Promise((resolve, reject) => {
  this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            'UPDATE traceability_events SET syncStatus = ?, updatedAt = ? WHERE eventId = ?',
            ['failed', new Date().toISOString(), eventId],
            () => resolve()
          );
        },
        error => {
          console.error('Failed to mark event as sync failed:', error);
          reject(error);
        }
      );
    });
  }

  async getEventCounts(): Promise<{ total: number; pending: number; synced: number; failed: number }> {
    await this.initialize();

    return new Promise((resolve, reject) => {
  this.getDatabase().transaction(
        tx => {
          tx.executeSql(
            `SELECT 
              COUNT(*) as total,
              SUM(CASE WHEN syncStatus = 'pending' THEN 1 ELSE 0 END) as pending,
              SUM(CASE WHEN syncStatus = 'synced' THEN 1 ELSE 0 END) as synced,
              SUM(CASE WHEN syncStatus = 'failed' THEN 1 ELSE 0 END) as failed
            FROM traceability_events`,
            [],
            (_: LegacyTransaction, result: LegacyResultSet) => {
              const row = result.rows.item(0) as {
                total?: number;
                pending?: number;
                synced?: number;
                failed?: number;
              };
              resolve({
                total: row.total ?? 0,
                pending: row.pending ?? 0,
                synced: row.synced ?? 0,
                failed: row.failed ?? 0
              });
            }
          );
        },
        error => {
          console.error('Failed to get event counts:', error);
          reject(error);
        }
      );
    });
  }

  private parseEventRow(row: any): StoredTraceabilityEvent {
    return {
      id: row.id,
      eventId: row.eventId,
      type: row.type,
      farmId: row.farmId,
      plotId: row.plotId,
      userId: row.userId,
      occurredAt: row.occurredAt,
      recordedAt: row.recordedAt,
      description: row.description,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      location: row.location ? JSON.parse(row.location) : undefined,
      attachments: row.attachments ? JSON.parse(row.attachments) : undefined,
      syncStatus: row.syncStatus,
      syncedAt: row.syncedAt,
      remoteId: row.remoteId,
      verified: row.verified === 1,
      verifiedBy: row.verifiedBy,
      verifiedAt: row.verifiedAt,
      createdBy: row.createdBy,
      updatedBy: row.updatedBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

export const traceabilityEventStorage = new TraceabilityEventStorage();