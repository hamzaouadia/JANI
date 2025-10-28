import { useMemo, useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { getEvents } from '@/lib/api';
import { EVENT_CONFIGS } from '@/constants/traceabilityEvents';
import type { TraceabilityEvent as ApiTraceabilityEvent } from '@/lib/api/events';

type ActivityItem = {
  id: string;
  type: 'event' | 'alert' | 'info';
  title: string;
  description: string;
  time: string;
};

// Convert traceability events to activity items
const mapEventToActivity = (event: ApiTraceabilityEvent): ActivityItem => {
  const eventConfig = EVENT_CONFIGS[event.eventType as keyof typeof EVENT_CONFIGS] || {
    title: event.eventType,
    icon: '📝',
  };
  const timeAgo = getTimeAgo(new Date(event.timestamp ?? event.createdAt));
  
  return {
    id: event._id,
    type: event.syncStatus === 'failed' ? 'alert' : 'event',
    title: eventConfig.title,
    description: event.description || `${eventConfig.icon} ${eventConfig.title}`,
    time: timeAgo,
  };
};

const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const ActivityScreen = () => {
  const theme = useAppTheme();
  const [filter, setFilter] = useState<'all' | 'event' | 'alert' | 'info'>('all');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events and convert to activities
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await getEvents();
      const activityItems = events.map(mapEventToActivity);
      
      // Sort by time (newest first)
      activityItems.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeB - timeA;
      });
      
      setActivities(activityItems);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const parseTimeAgo = (timeStr: string): number => {
    if (timeStr === 'Just now') return Date.now();
    const match = timeStr.match(/(\d+)([mhd])/);
    if (!match) return 0;
  const value = parseInt(match[1], 10);
    const unit = match[2];
    const multiplier = unit === 'm' ? 60000 : unit === 'h' ? 3600000 : 86400000;
    return Date.now() - (value * multiplier);
  };

  const data = useMemo(() => (filter === 'all' ? activities : activities.filter((m) => m.type === filter)), [filter, activities]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 16 }]}>
            Loading activities...
          </Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.error, marginBottom: 8 }]}>
            Error
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginBottom: 16 }]}>
            {error}
          </Text>
          <Button onPress={fetchActivities}>Retry</Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Activity</Text>
        <View style={styles.filters}>
          {(['all', 'event', 'alert', 'info'] as const).map((f) => (
            <Button key={f} variant={filter === f ? 'primary' : 'secondary'} onPress={() => setFilter(f)}>
              {f.toUpperCase()}
            </Button>
          ))}
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 60)} layout={Layout.springify()}>
            <Card>
              <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>{item.title}</Text>
              <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 4 }]}>
                {item.description}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 8 }]}>
                {item.time}
              </Text>
            </Card>
          </Animated.View>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
    gap: 12
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
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
});
