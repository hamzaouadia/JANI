import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useRef } from 'react';

import { generateClientId } from '@/lib/offline/utils';
import { useOffline } from '@/providers/OfflineProvider';
import type { CaptureEventPayload, CaptureMediaPayload } from '@/features/capture/types';
import type { SyncManager } from '@/lib/offline/syncManager';

const ensureClientMetadata = (event: CaptureEventPayload) => ({
  ...event,
  clientId: event.clientId ?? generateClientId('event'),
  actorRole: event.actorRole ?? 'farm'
});

type CaptureContextValue = {
  captureEvent: (_event: CaptureEventPayload, _media?: CaptureMediaPayload[]) => Promise<void>;
  registerSyncManager: (_manager: SyncManager) => void;
};

const CaptureContext = createContext<CaptureContextValue | undefined>(undefined);

export const CaptureProvider = ({ children }: PropsWithChildren) => {
  const { registerSyncManager } = useOffline();
  const managerRef = useRef<SyncManager | null>(null);

  const value = useMemo(() => ({
    captureEvent: async (event: CaptureEventPayload, media: CaptureMediaPayload[] = []) => {
      if (!managerRef.current) {
        throw new Error('Sync manager not registered');
      }

      const normalized = ensureClientMetadata(event);

      await managerRef.current.captureEvent({
        event: {
          clientId: normalized.clientId!,
          type: normalized.type,
          actorRole: normalized.actorRole!,
          payload: normalized.payload,
          occurredAt: normalized.occurredAt
        },
        media: media.map((item) => ({
          eventId: '',
          type: item.type,
          uri: item.uri,
          checksum: item.checksum,
          size: item.size
        }))
      });
    },
    registerSyncManager: (manager: SyncManager) => {
      managerRef.current = manager;
      registerSyncManager(manager);
    }
  }), [registerSyncManager]);

  return <CaptureContext.Provider value={value}>{children}</CaptureContext.Provider>;
};

export const useCapture = () => {
  const context = useContext(CaptureContext);
  if (!context) {
    throw new Error('useCapture must be used within CaptureProvider');
  }
  return context;
};
