import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useSyncOfflineEvents } from '@/features/traceability/hooks/useTraceability';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SyncStatusProps {
  onSyncComplete?: () => void;
}

export const SyncStatusIndicator: React.FC<SyncStatusProps> = ({ onSyncComplete }) => {
  const theme = useAppTheme();
  const { mutate: syncEvents, isPending, isSuccess, isError } = useSyncOfflineEvents();
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    checkPendingEvents();
  }, []);

  React.useEffect(() => {
    if (isSuccess) {
      setPendingCount(0);
      onSyncComplete?.();
    }
  }, [isSuccess]);

  const checkPendingEvents = async () => {
    try {
      const pending = await AsyncStorage.getItem('pendingEvents');
      if (pending) {
        const events = JSON.parse(pending);
        setPendingCount(events.length);
      }
    } catch (error) {
      console.error('Error checking pending events:', error);
    }
  };

  const handleSync = async () => {
    try {
      const pending = await AsyncStorage.getItem('pendingEvents');
      if (pending) {
        const events = JSON.parse(pending);
        syncEvents(events);
      }
    } catch (error) {
      console.error('Error syncing events:', error);
    }
  };

  if (pendingCount === 0 && !isPending) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={handleSync}
      disabled={isPending}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isPending 
          ? theme.colors.surface 
          : isError
          ? theme.colors.error + '20'
          : theme.colors.primary + '20',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: isPending 
          ? theme.colors.border 
          : isError
          ? theme.colors.error
          : theme.colors.primary,
      }}
    >
      {isPending ? (
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 8 }} />
      ) : (
        <Text style={{ fontSize: 20, marginRight: 8 }}>
          {isError ? '⚠️' : '🔄'}
        </Text>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[theme.typography.body, { 
          color: theme.colors.text,
          fontWeight: '600'
        }]}>
          {isPending 
            ? 'Syncing...'
            : isError
            ? 'Sync Failed'
            : `${pendingCount} pending ${pendingCount === 1 ? 'event' : 'events'}`
          }
        </Text>
        {!isPending && (
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {isError ? 'Tap to retry' : 'Tap to sync now'}
          </Text>
        )}
      </View>
      {!isPending && (
        <Text style={{ color: theme.colors.primary, fontSize: 20 }}>→</Text>
      )}
    </TouchableOpacity>
  );
};

export const ConnectionStatus: React.FC = () => {
  const theme = useAppTheme();
  const [isOnline, _setIsOnline] = React.useState(true);

  // In a real app, you'd use @react-native-community/netinfo
  // For now, we'll keep it simple
  React.useEffect(() => {
    // Check connection status
    // NetInfo.addEventListener(state => setIsOnline(state.isConnected));
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.warning + '20',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.warning,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>📡</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
          Offline mode - Changes will sync when online
        </Text>
      </View>
    </View>
  );
};
