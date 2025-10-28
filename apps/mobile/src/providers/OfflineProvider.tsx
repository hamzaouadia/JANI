import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import type { SyncManager } from '@/lib/offline/syncManager';

import { listPendingEvents } from '@/lib/offline/storage';

type OfflineContextValue = {
  isOnline: boolean;
  pendingCount: number;
  refreshQueue: () => Promise<void>;
  registerSyncManager: (_manager: SyncManager) => void;
  syncManager: SyncManager | null;
};

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined);

export const OfflineProvider = ({ children }: PropsWithChildren) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncManager, setSyncManager] = useState<SyncManager | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable));
    });
    return () => unsubscribe();
  }, []);

  const refreshQueue = async () => {
    if (Platform.OS === 'web') {
      setPendingCount(0);
      return;
    }
    const pending = await listPendingEvents();
    setPendingCount(pending.length);
  };

  useEffect(() => {
    void refreshQueue();
  }, []);

  const value = useMemo<OfflineContextValue>(
    () => ({
      isOnline,
      pendingCount,
      refreshQueue,
      registerSyncManager: setSyncManager,
      syncManager
    }),
    [isOnline, pendingCount, syncManager]
  );

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }

  return context;
};
