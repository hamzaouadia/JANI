import React from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/LoadingSkeleton';
import { SyncStatusIndicator } from '@/components/ui/SyncStatus';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useFarmEvents } from '@/features/traceability/hooks/useTraceability';
import type { FarmEvent } from '@/features/traceability/api/traceabilityApi';

type TraceabilityStackParamList = {
  TraceabilityEventsList: undefined;
  TraceabilityEvent: { eventId: string };
  NewEvent: { farmId: string };
};

type Props = NativeStackScreenProps<TraceabilityStackParamList, 'TraceabilityEventsList'>;

export const TraceabilityEventsListScreen = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const selectedFarmId = 'demo-farm-1';
  
  const { 
    data: eventsData, 
    isLoading, 
    error,
    refetch,
    isRefetching
  } = useFarmEvents(selectedFarmId);

  const events = eventsData?.events ?? ([] as FarmEvent[]);

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEventPress = (eventId: string) => {
    navigation.navigate('TraceabilityEvent', { eventId });
  };

  const handleCreateEvent = () => {
    navigation.navigate('NewEvent', { farmId: selectedFarmId });
  };

  const renderContent = () => {
    if (isLoading && !isRefetching) {
      return (
        <View style={{ padding: 16 }}>
          <ListSkeleton count={5} />
        </View>
      );
    }

    if (error) {
      return (
        <EmptyState
          icon="alert-circle"
          title="Failed to Load Events"
          description="There was an error loading traceability events. Please try again."
          actionLabel="Retry"
          onActionPress={handleRefresh}
        />
      );
    }

    if (events.length === 0) {
      return (
        <EmptyState
          icon="leaf"
          title="No Events Yet"
          description="Start tracking your farm activities by creating your first traceability event."
          actionLabel="Create Event"
          onActionPress={handleCreateEvent}
        />
      );
    }

    return (
      <View style={{ padding: 16 }}>
  {events.map((event: FarmEvent) => (
          <TouchableOpacity
            key={event.id}
            onPress={() => handleEventPress(event.id)}
            activeOpacity={0.7}
          >
            <Card style={{ marginBottom: 12, padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>
                    {getEventIcon(event.type)} {event.type}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                    {new Date(event.timestamp || event.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                
                {event.hash && (
                  <View style={{
                    backgroundColor: theme.colors.success + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    alignSelf: 'flex-start',
                  }}>
                    <Text style={[theme.typography.caption, { 
                      color: theme.colors.success,
                      fontWeight: '600',
                    }]}>
                      ✓ Verified
                    </Text>
                  </View>
                )}
              </View>

              {event.cropType && (
                <Text style={[theme.typography.body, { color: theme.colors.text, marginBottom: 4 }]}>
                  Crop: {event.cropType}
                </Text>
              )}

              {event.quantity && (
                <Text style={[theme.typography.body, { color: theme.colors.text, marginBottom: 4 }]}>
                  Quantity: {event.quantity} {event.unit || 'units'}
                </Text>
              )}

              {event.location && (
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  📍 {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
                </Text>
              )}
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Screen>
      <SyncStatusIndicator onSyncComplete={handleRefresh} />
      
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={{
          backgroundColor: theme.colors.surface,
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}>
          <Text style={[theme.typography.heading, { color: theme.colors.text, marginBottom: 4 }]}>
            Traceability Events
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Track and verify all farm activities
          </Text>
        </View>

        {renderContent()}

        {/* Create Event FAB */}
        {events.length > 0 && (
          <TouchableOpacity
            onPress={handleCreateEvent}
            style={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              backgroundColor: theme.colors.primary,
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Screen>
  );
};

function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    PLANTING: '🌱',
    GROWING: '🌿',
    HARVESTING: '🌾',
    PROCESSING: '⚙️',
    PACKAGING: '📦',
    SHIPPING: '🚚',
    RECEIVING: '✅',
  };
  return icons[type] || '📝';
}
