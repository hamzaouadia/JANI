import { useState, useMemo, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import type { AlertButton } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { getEvents } from '@/lib/api';

import { EVENT_CONFIGS } from '@/constants/traceabilityEvents';
import type { TraceabilityEvent, TraceabilityEventType } from '@/constants/traceabilityEvents';
import type { TraceabilityEvent as ApiEvent } from '@/lib/api/events';
import type { JourneyStackParamList } from '@/navigation/types';

// Map API event to app event format
const mapApiEventToEvent = (apiEvent: ApiEvent): TraceabilityEvent => ({
  id: apiEvent._id,
  type: (apiEvent.eventType as TraceabilityEventType) || 'harvest_collection',
  actorRole: 'farmer',
  actorId: apiEvent.recordedBy,
  payload: apiEvent.metadata || {},
  occurredAt: apiEvent.timestamp,
  location: apiEvent.location?.coordinates ? {
    latitude: apiEvent.location.coordinates.latitude,
    longitude: apiEvent.location.coordinates.longitude,
    accuracy: 5,
    timestamp: Date.now(),
  } : undefined,
  status: apiEvent.syncStatus === 'synced' ? 'synced' : apiEvent.syncStatus === 'pending' ? 'pending' : 'failed',
  createdAt: apiEvent.createdAt,
  updatedAt: apiEvent.updatedAt,
});

type TraceabilityEventsListScreenProps = NativeStackScreenProps<
  JourneyStackParamList,
  'TraceabilityEventsList'
>;

export const TraceabilityEventsListScreen = ({ navigation }: TraceabilityEventsListScreenProps) => {
  const theme = useAppTheme();
  const user = useAuthStore((state) => state.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'synced' | 'failed'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<TraceabilityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiEvents = await getEvents();
      const mappedEvents = apiEvents.map(mapApiEventToEvent);
      setEvents(mappedEvents);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(event => event.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => {
        const config = EVENT_CONFIGS[event.type];
        return (
          config.title.toLowerCase().includes(query) ||
          event.type.toLowerCase().includes(query) ||
          JSON.stringify(event.payload).toLowerCase().includes(query)
        );
      });
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [events, searchQuery, selectedFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const handleEventPress = (event: TraceabilityEvent) => {
    const buttons: AlertButton[] = [{ text: 'OK' }];
    if (event.status === 'failed') {
      buttons.push({ text: 'Retry Sync', onPress: () => handleRetrySync(event) });
    }

    Alert.alert(
      EVENT_CONFIGS[event.type].title,
      `Status: ${event.status}\nCreated: ${new Date(event.createdAt).toLocaleString()}\n\nPayload:\n${JSON.stringify(event.payload, null, 2)}`,
      buttons
    );
  };

  const handleRetrySync = (event: TraceabilityEvent) => {
    Alert.alert('Retry Sync', `Would retry syncing event: ${event.id}`);
  };

  const handleCreateEvent = () => {
    // Show event type selector
    const eventTypes: TraceabilityEventType[] = [
      'plot_registration',
      'seed_planting',
      'fertilizer_application',
      'pesticide_application',
      'harvest_collection',
      'quality_inspection',
      'transfer_to_exporter',
    ];

    const buttons: AlertButton[] = [
      ...eventTypes.map((type) => ({
        text: EVENT_CONFIGS[type].title,
        onPress: () => navigation.navigate('TraceabilityEvent', { eventType: type }),
      })),
      { text: 'Cancel', style: 'cancel' },
    ];

    Alert.alert(
      'Create New Event',
      'Select the type of traceability event to create:',
      buttons
    );
  };

  const renderEvent = ({ item: event }: { item: TraceabilityEvent }) => {
    const config = EVENT_CONFIGS[event.type];
    const timeAgo = getTimeAgo(new Date(event.createdAt));

    return (
      <Pressable
        style={[styles.eventCard, { backgroundColor: theme.colors.surface }]}
        onPress={() => handleEventPress(event)}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleRow}>
            <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>
              {config.icon}
            </Text>
            <Text style={[theme.typography.subtitle, { color: theme.colors.text, flex: 1 }]}>
              {config.title}
            </Text>
            <VerificationBadge status={event.status === 'synced' ? 'verified' : event.status === 'pending' ? 'pending' : 'error'} />
          </View>

          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {timeAgo} • {event.location ? '📍 GPS' : '📍 No GPS'}
          </Text>
        </View>
        <View style={styles.eventDetails}>
          {Object.entries(event.payload).slice(0, 2).map(([key, value]) => (
            <View key={key} style={styles.detailRow}>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
                {String(value)}
              </Text>
            </View>
          ))}
        </View>
        {event.notes && (
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, fontStyle: 'italic' }]}>
            &ldquo;{event.notes}&rdquo;
          </Text>
        )}
      </Pressable>
    );
  };

  const getFilterButtonStyle = (filter: typeof selectedFilter) => ([
    styles.filterButton,
    {
      backgroundColor: selectedFilter === filter ? theme.colors.primary : theme.colors.surface,
      borderColor: theme.colors.border,
    }
  ]);

  const getFilterTextStyle = (filter: typeof selectedFilter) => ([
    theme.typography.caption,
    {
      color: selectedFilter === filter ? theme.colors.background : theme.colors.text,
    }
  ]);

  return (
    <Screen padded={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primaryMuted }]}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Traceability Events
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            All agricultural events for {user?.role || 'user'}
          </Text>
        </View>

        <View style={styles.content}>
          {/* Search and Filters */}
          <View style={styles.controls}>
            <TextField
              label="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search events..."
              style={{ marginBottom: 12 }}
            />

            <View style={styles.filters}>
              {(['all', 'pending', 'synced', 'failed'] as const).map(filter => (
                <Pressable
                  key={filter}
                  style={getFilterButtonStyle(filter)}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={getFilterTextStyle(filter)}>
                    {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    {filter !== 'all' && ` (${events.filter(e => e.status === filter).length})`}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Stats Summary */}
          <View style={[styles.statsRow, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.stat}>
              <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
                {filteredEvents.length}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                Total
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[theme.typography.subtitle, { color: theme.colors.success }]}>
                {events.filter(e => e.status === 'synced').length}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                Synced
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[theme.typography.subtitle, { color: theme.colors.warning }]}>
                {events.filter(e => e.status === 'pending').length}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                Pending
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[theme.typography.subtitle, { color: theme.colors.error }]}>
                {events.filter(e => e.status === 'failed').length}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                Failed
              </Text>
            </View>
          </View>

          {/* Events List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 16 }]}>
                Loading events...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={[theme.typography.subtitle, { color: theme.colors.error, marginBottom: 8 }]}>
                Error
              </Text>
              <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginBottom: 16, textAlign: 'center' }]}>
                {error}
              </Text>
              <Button onPress={fetchEvents}>Retry</Button>
            </View>
          ) : (
            <FlatList
              data={filteredEvents}
              renderItem={renderEvent}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary]}
                  tintColor={theme.colors.primary}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={[theme.typography.subtitle, { color: theme.colors.textMuted, textAlign: 'center' }]}>
                    {searchQuery ? 'No events match your search' : 'No events found'}
                  </Text>
                  <Text style={[theme.typography.body, { color: theme.colors.textMuted, textAlign: 'center', marginTop: 8 }]}>
                    {searchQuery ? 'Try adjusting your search terms' : 'Create your first traceability event'}
                  </Text>
                </View>
              }
            />
          )}

          {/* Create Button */}
          <Button onPress={handleCreateEvent} style={styles.createButton}>
            + Create New Event
          </Button>
        </View>
      </View>
    </Screen>
  );
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  controls: {
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  list: {
    flexGrow: 1,
    paddingBottom: 100, // Space for create button
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  eventHeader: {
    gap: 4,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  createButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
});