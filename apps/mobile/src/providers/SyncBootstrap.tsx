import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSyncClient } from '@/lib/offline/syncClient';
import { SyncManager } from '@/lib/offline/syncManager';
import { apiClient } from '@/lib/api/client';
import { useOffline } from '@/providers/OfflineProvider';

const DEVICE_ID_KEY = 'jani-device-id';

async function ensureDeviceId() {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = `dev-${Math.random().toString(36).slice(2, 12)}`;
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

export const SyncBootstrap = () => {
  const { registerSyncManager } = useOffline();

  useEffect(() => {
    let destroyed = false;

    (async () => {
      const deviceId = await ensureDeviceId();
      const client = createSyncClient({ apiClient, deviceId });
      const manager = new SyncManager({
        config: {
          batchSize: 50,
          maxBandwidthBytes: 2 * 1024 * 1024,
          cursorId: 'default'
        },
        syncClient: client
      });

      if (!destroyed) {
        registerSyncManager(manager);
        // Trigger initial sync on bootstrap
        void manager.triggerSync(true);
      }
    })();

    return () => {
      destroyed = true;
    };
  }, [registerSyncManager]);

  return null;
};
