import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { useOffline } from '@/providers/OfflineProvider';
import { listPendingEvents, removeEvent } from '@/lib/offline/storage';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { LocalEvent } from '@/lib/database/types';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const OfflineQueuePanel = ({ visible, onClose }: Props) => {
  const theme = useAppTheme();
  const { syncManager, refreshQueue } = useOffline();
  const [items, setItems] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const events = await listPendingEvents();
      setItems(events);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) void load();
  }, [visible]);

  const retryAll = async () => {
    await syncManager?.triggerSync(true);
    await load();
    await refreshQueue();
  };

  const clearFailed = async () => {
    const failed = items.filter((i) => i.status === 'error');
    for (const f of failed) {
      await removeEvent(f.id);
    }
    await load();
    await refreshQueue();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.header}>
            <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Sync Queue</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              {items.length} pending
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
            {loading ? (
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Loading…</Text>
            ) : items.length === 0 ? (
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Queue is empty.</Text>
            ) : (
              items.map((e) => (
                <Animated.View key={e.id} entering={FadeInUp.springify().damping(16)} layout={Layout.springify()} style={[styles.item, { borderColor: theme.colors.border }]}> 
                  <View style={{ flex: 1 }}>
                    <Text style={[theme.typography.body, { color: theme.colors.text }]}>{labelForType(e.type)}</Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                      {new Date(e.occurredAt).toLocaleString()} • {e.status.toUpperCase()}
                    </Text>
                    {e.lastError ? (
                      <Text style={[theme.typography.caption, { color: theme.colors.error }]}>Error: {e.lastError}</Text>
                    ) : null}
                  </View>
                  {e.status === 'error' ? (
                    <Pressable
                      onPress={async () => {
                        await removeEvent(e.id);
                        await load();
                        await refreshQueue();
                      }}
                      style={({ pressed }) => [
                        styles.clearBtn,
                        { borderColor: theme.colors.error, backgroundColor: `${theme.colors.error}15`, opacity: pressed ? 0.92 : 1 }
                      ]}
                    >
                      <Text style={[theme.typography.caption, { color: theme.colors.error }]}>Remove</Text>
                    </Pressable>
                  ) : null}
                </Animated.View>
              ))
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Button variant="secondary" onPress={onClose} style={styles.actionBtn}>Close</Button>
            <Button variant="secondary" onPress={clearFailed} style={styles.actionBtn}>
              Clear failed
            </Button>
            <Button onPress={retryAll} style={styles.actionBtn}>Retry all</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

function labelForType(t: LocalEvent['type']) {
  switch (t) {
    case 'planting':
      return 'Planting event';
    case 'input_application':
      return 'Input application';
    case 'harvest':
      return 'Harvest event';
    case 'transfer':
      return 'Transfer event';
    case 'seed_lot':
      return 'Seed lot';
    case 'plot_registration':
      return 'Plot registration';
    case 'farmer_onboarding':
      return 'Farmer onboarding';
    default:
      return 'Event';
  }
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(12, 24, 19, 0.35)', justifyContent: 'flex-end' },
  card: { borderWidth: StyleSheet.hairlineWidth, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  clearBtn: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1 }
});