import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { z } from 'zod';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useFarmsList, useLinkFarm, useSearchFarms } from '@/features/farms/hooks/useFarms';
import { InlineAlert } from '@/components/ui/InlineAlert';
import type { FarmStackParamList } from '@/navigation/farms/FarmsNavigator';
import type { SearchFarmResult } from '@/features/farms/api/farmApi';

type FarmListScreenProps = NativeStackScreenProps<FarmStackParamList, 'FarmList'>;

export const FarmListScreen = ({ navigation }: FarmListScreenProps) => {
  const theme = useAppTheme();
  const { data, isLoading, isError, refetch } = useFarmsList({ mine: false });
  const searchFarms = useSearchFarms();
  const linkFarm = useLinkFarm();
  const [q, setQ] = useState('');
  const [accessCodeById, setAccessCodeById] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ kind: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const searchFarmsRef = useRef(searchFarms);
  searchFarmsRef.current = searchFarms;

  const farms = data ?? [];
  const searchResults: SearchFarmResult[] = searchFarms.data ?? [];

  const linkSchema = z.object({
    identifier: z
      .string()
      .trim()
      .min(3, 'Farm identifier must have at least 3 characters')
      .max(64, 'Farm identifier must be 64 characters or fewer'),
    accessCode: z
      .string()
      .trim()
      .min(4, 'Access code must have at least 4 characters')
      .max(64, 'Access code must be 64 characters or fewer')
  });

  const onSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      searchFarmsRef.current.reset();
      return;
    }
    try {
      await searchFarmsRef.current.mutateAsync(trimmedQuery);
      setRecent((prev) => [trimmedQuery, ...prev.filter((x) => x !== trimmedQuery)].slice(0, 5));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Search failed. Please try again.';
      setToast({ kind: 'error', message });
      setTimeout(() => setToast(null), 2000);
    }
  }, []); // Using ref to avoid dependency

  const onLink = async (result: SearchFarmResult) => {
    const code = accessCodeById[result.identifier] ?? '';
    const validation = linkSchema.safeParse({ identifier: result.identifier, accessCode: code });
    if (!validation.success) {
      const message = validation.error.issues[0]?.message ?? 'Please check the farm identifier and access code.';
      setToast({ kind: 'error', message });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    const payload = validation.data;
    try {
      await linkFarm.mutateAsync({ farmId: result.id, accessCode: payload.accessCode });
      setToast({ kind: 'success', message: 'Linked to farm successfully' });
      setTimeout(() => setToast(null), 2000);
      setQ('');
      setAccessCodeById((prev) => ({ ...prev, [result.identifier]: '' }));
      void refetch();
    } catch (e: unknown) {
      let message = 'Failed to link farm';
      if (axios.isAxiosError(e)) {
        message = e.response?.status === 403
          ? 'Invalid access code'
          : (typeof e.response?.data?.error === 'string' ? e.response.data.error : e.message);
      } else if (e instanceof Error) {
        message = e.message;
      }
      setToast({ kind: 'error', message });
      setTimeout(() => setToast(null), 2000);
    }
  };

  // Debounced live search
  useEffect(() => {
    const query = q.trim();
    if (!query) {
      searchFarmsRef.current.reset();
      return;
    }
    const timeoutId = setTimeout(() => {
      void onSearch(query);
    }, 400); // Slightly longer debounce for better UX
    return () => clearTimeout(timeoutId);
  }, [q, onSearch]);

  const highlight = (text: string, query: string) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <Text style={{ color: theme.colors.text }}>{text}</Text>;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return (
      <Text style={{ color: theme.colors.text }}>
        {before}
        <Text style={{ fontWeight: '700', color: theme.colors.primary }}>{match}</Text>
        {after}
      </Text>
    );
  };

  return (
    <Screen>
      <View style={{ gap: 16 }}>
        {toast && <InlineAlert kind={toast.kind}>{toast.message}</InlineAlert>}
        
        {/* Farm Progress Navigation */}
        <View style={{ marginBottom: 16 }}>
          <Button
            onPress={() => {
              navigation.navigate('FarmStates');
            }}
            variant="secondary"
            style={{
              backgroundColor: theme.colors.primaryMuted,
              borderColor: theme.colors.primary,
            }}
          >
            📊 View Farm Progress
          </Button>
        </View>
        
        <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.text }}>My Farms</Text>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={q}
              placeholder="Search by farm identifier or name"
              onChangeText={setQ}
            />
          </View>
          <Button 
            onPress={() => void onSearch(q)} 
            loading={searchFarms.isPending} 
            disabled={!q.trim()}
          >
            Search
          </Button>
        </View>

        {/* Search Loading State */}
        {searchFarms.isPending && q.trim() && (
          <View style={styles.searchState}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={[styles.searchStateText, { color: theme.colors.textMuted }]}>
              Searching for &ldquo;{q.trim()}&rdquo;...
            </Text>
          </View>
        )}

        {/* Search Error State */}
        {searchFarms.isError && (
          <View style={styles.searchState}>
            <Text style={{ color: theme.colors.error }}>Search failed. Please try again.</Text>
          </View>
        )}

        {/* Search Results */}
        {searchFarms.isSuccess && q.trim() && (
          <View style={{ gap: 8 }}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Search Results ({searchResults.length})
            </Text>
            {searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: theme.colors.textMuted }]}>
                  No farms found for &ldquo;{q.trim()}&rdquo;
                </Text>
                <Text style={[styles.emptyStateHint, { color: theme.colors.textMuted }]}>
                  Try searching by farm name or identifier
                </Text>
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                {searchResults.map((r) => (
                  <View key={r.id} style={[styles.searchResultCard, {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface
                  }]}>
                    <View style={styles.searchResultHeader}>
                      <Text style={[styles.searchResultName, { color: theme.colors.text }]}>
                        {highlight(r.name, q.trim())}
                      </Text>
                      {r.status && (
                        <View style={[styles.statusBadge, { backgroundColor: theme.colors.primaryMuted }]}>
                          <Text style={[styles.statusText, { color: theme.colors.primary }]}>
                            {r.status}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.searchResultId, { color: theme.colors.textMuted }]}>
                      Identifier: {highlight(r.identifier, q.trim())}
                    </Text>
                    <View style={styles.linkSection}>
                      <View style={{ flex: 1 }}>
                        <SearchBar
                          value={accessCodeById[r.identifier] ?? ''}
                          placeholder="Enter access code"
                          onChangeText={(t) => setAccessCodeById((prev) => ({ ...prev, [r.identifier]: t }))}
                        />
                      </View>
                      <Button
                        onPress={() => void onLink(r)}
                        loading={linkFarm.isPending}
                        disabled={!accessCodeById[r.identifier]?.trim()}
                      >
                        Link
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {isLoading && <ActivityIndicator color={theme.colors.primary} />}
        {isError && (
          <Text style={{ color: theme.colors.error }}>
            Failed to load. <Text onPress={() => void refetch()}>Retry</Text>
          </Text>
        )}

        {/* Recent searches */}
        {recent.length > 0 && !q.trim() && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {recent.map((item) => (
              <Pressable
                key={item}
                onPress={() => setQ(item)}
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 16
                }}
              >
                <Text style={{ color: theme.colors.textMuted }}>{item}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <FlatList
          data={farms}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('FarmDetail', { id: item._id })}
              style={{
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.colors.border,
                borderRadius: theme.radii.lg,
                padding: 12,
                backgroundColor: theme.colors.surface
              }}
            >
              <Text style={{ fontWeight: '600', fontSize: 16, color: theme.colors.text }}>{item.name}</Text>
              <Text style={{ color: theme.colors.textMuted, marginTop: 4 }}>Status: {item.status ?? '—'}</Text>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  searchState: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  searchStateText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyStateHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  searchResultCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  searchResultId: {
    fontSize: 14,
  },
  linkSection: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});
