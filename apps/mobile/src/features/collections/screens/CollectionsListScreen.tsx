import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '@/theme/ThemeProvider';

type NavigateFn = (_route: string, _params?: Record<string, unknown>) => void;

export const CollectionsListScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const data = useMemo(
    () =>
      [
        { id: 'C-1001', status: 'pending', kg: 240, price: 42.5 },
        { id: 'C-1002', status: 'paid', kg: 180, price: 41.0 },
        { id: 'C-1003', status: 'pending', kg: 320, price: 43.1 }
      ].filter((x) => (filter === 'all' ? true : x.status === filter)),
    [filter]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.filters}>
        {(['all', 'pending', 'paid'] as const).map((key) => (
          <Pressable
            key={key}
            onPress={() => setFilter(key)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: filter === key ? theme.colors.primary : theme.colors.surface,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.colors.border
            }}
          >
            <Text style={{ color: filter === key ? '#fff' : theme.colors.text }}>{key}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => (navigation as { navigate: NavigateFn }).navigate('CollectionDetail', { collectionId: item.id })}
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>{item.id}</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{item.status}</Text>
            </View>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 6 }]}> 
              {item.kg} kg • {item.price.toFixed(2)}/kg
            </Text>
          </Pressable>
        )}
      />

      <Pressable
  onPress={() => (navigation as { navigate: NavigateFn }).navigate('NewCollection')}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 24,
          backgroundColor: theme.colors.primary,
          borderRadius: 24,
          paddingVertical: 12,
          paddingHorizontal: 16
        }}
        accessibilityRole="button"
        accessibilityLabel="New collection"
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>New</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 14 }
});
