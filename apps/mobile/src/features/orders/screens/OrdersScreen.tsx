import { StyleSheet, Text, View, RefreshControl } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useMemo, useState } from 'react';
import Animated, { FadeInUp, Layout, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { SkeletonLines } from '@/components/ui/Skeleton';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { queryKeys } from '@/constants/queryKeys';
import { fetchOrders } from '@/features/orders/api/ordersApi';
import type { OrderStatus } from '@/features/orders/api/ordersApi';

const STATUS_LABELS: Record<OrderStatus, string> = {
  preparing: 'Preparing',
  awaiting_pickup: 'Awaiting pickup',
  in_transit: 'In transit',
  delayed: 'Delayed',
  delivered: 'Delivered'
};

export const OrdersScreen = () => {
  const theme = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [query, setQuery] = useState('');

  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: queryKeys.orders.list,
    queryFn: fetchOrders,
    enabled: Boolean(token)
  });

  const orders = data?.orders ?? [];
  const summary = data?.summary ?? [];
  const filtered = useMemo(() => {
    const orders = data?.orders ?? [];
    if (!query.trim()) return orders;
    const q = query.toLowerCase();
    return orders.filter((o) =>
      o.reference.toLowerCase().includes(q) ||
      o.partner.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q)
    );
  }, [data, query]);

  // Parallax hooks (must be declared before any early returns)
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const heroParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - Math.min(scrollY.value / 1000, 0.06) },
      { translateY: -Math.min(scrollY.value / 6, 12) }
    ],
    opacity: 1 - Math.min(scrollY.value / 500, 0.2)
  }));

  if (!token) {
    return (
      <Screen padded={false}>
        <EmptyState
          icon="log-in"
          title="Sign in to view your orders"
          description="We need a valid session before loading traceability shipments."
          actionLabel="Retry"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  if (isLoading && !orders.length) {
    return (
      <Screen padded={false}>
        <View style={[styles.emptyState, { paddingHorizontal: theme.spacing(6), paddingTop: theme.spacing(8), alignItems: 'stretch' }]}> 
          <SkeletonLines lines={6} />
        </View>
      </Screen>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : 'Unable to load orders.';
    return (
      <Screen padded={false}>
        <EmptyState
          icon="warning"
          title={message}
          description="Check your network connection and try again."
          actionLabel="Retry"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  if (!orders.length) {
    return (
      <Screen padded={false}>
        <EmptyState
          icon="boat-outline"
          title="No orders yet"
          description="Orders will appear here as they are scheduled, dispatched, and delivered."
          actionLabel="Refresh"
          onActionPress={() => refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: theme.spacing(5),
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6)
          }
        ]}
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.primary}
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
          />
        }
        showsVerticalScrollIndicator={false}
>
        <Animated.View style={[styles.hero, { backgroundColor: theme.colors.primaryMuted, borderColor: `${theme.colors.primary}33` }, heroParallaxStyle]}> 
          <Text style={[theme.typography.caption, styles.heroEyebrow, { color: theme.colors.primary }]}>Live order board</Text>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            {user ? `Shipments for ${formatRoleLabel(user.role)}` : 'Active shipments'}
          </Text>
          <Text style={[theme.typography.body, styles.heroIntro, { color: theme.colors.textMuted }]}>Monitor execution, surface delays, and keep partners aligned across the network.
          </Text>
        </Animated.View>

        <SearchBar placeholder="Search by reference, partner, or destination" onChangeText={setQuery} />
        <View style={styles.headerRow}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </Text>
          <Button onPress={() => refetch()}>Refresh</Button>
        </View>

        <View style={styles.metricsWrapper}>
          {summary.map((metric) => (
            <View
              key={metric.id}
              style={[
                styles.metricCard,
                surface(theme),
                {
                  width: summary.length > 2 ? '32%' : '48%'
                }
              ]}
            >
              <Text style={[theme.typography.caption, styles.metricLabel, { color: theme.colors.textMuted }]}>
                {metric.label}
              </Text>
              <Text style={[theme.typography.heading, { color: theme.colors.primary }]}>{metric.value}</Text>
              {metric.helper ? (
                <Text style={[theme.typography.caption, styles.metricHelper, { color: theme.colors.textMuted }]}
                >
                  {metric.helper}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
        <View style={styles.orderList}>
          {filtered.map((order, index) => (
            <Animated.View
              key={order.id}
              entering={FadeInUp.delay(Math.min(index * 40, 500)).springify().damping(14)}
              layout={Layout.springify()}
              style={[styles.orderCard, surface(theme)]}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderHeaderText}>
                  <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>{order.reference}</Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Last updated {formatRelativeTime(order.lastUpdated)}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: `${statusColor(theme, order.status)}20`,
                      borderColor: statusColor(theme, order.status)
                    }
                  ]}
                >
                  <Text style={[theme.typography.caption, { color: statusColor(theme, order.status) }]}>
                    {STATUS_LABELS[order.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.orderMeta}>
                {renderMetaRow(theme, 'Partner', order.partner)}
                {renderMetaRow(theme, 'Destination', order.destination)}
                {renderMetaRow(theme, 'Quantity', order.quantity)}
                {renderMetaRow(theme, 'Order value', order.value)}
                {renderMetaRow(theme, 'Due', formatDueDate(order.dueDate))}
              </View>

              <View style={styles.highlights}>
                {order.highlights.map((highlight, index) => (
                  <View key={`${order.id}-highlight-${index}`} style={styles.highlightRow}>
                    <Text style={[theme.typography.caption, styles.highlightBullet, { color: theme.colors.primary }]}>•</Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{highlight}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>
    </Screen>
  );
};

const formatRoleLabel = (role: string) => {
  switch (role) {
    case 'farm':
      return 'farm owner operations';
    case 'exporter':
      return 'export teams';
    case 'buyer':
      return 'buyer programs';
    case 'logistics':
      return 'logistics runs';
    default:
      return 'field deliveries';
  }
};

const renderMetaRow = (theme: ReturnType<typeof useAppTheme>, label: string, value: string) => (
  <View style={styles.metaRow}>
    <Text style={[theme.typography.caption, styles.metaLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    <Text style={[theme.typography.body, { color: theme.colors.text }]}>{value}</Text>
  </View>
);

const surface = (theme: ReturnType<typeof useAppTheme>): ViewStyle => ({
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.border,
  shadowColor: '#1A342720',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 2
});

const statusColor = (theme: ReturnType<typeof useAppTheme>, status: OrderStatus) => {
  switch (status) {
    case 'delayed':
      return theme.colors.warning;
    case 'in_transit':
      return theme.colors.secondary;
    case 'delivered':
      return theme.colors.success;
    case 'awaiting_pickup':
      return theme.colors.primary;
    default:
      return theme.colors.primary;
  }
};

const formatDueDate = (iso: string) => {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const formatRelativeTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 1) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'yesterday';
  }

  return `${diffDays} days ago`;
};

const styles = StyleSheet.create({
  content: {
    gap: 28
  },
  emptyState: {
    flex: 1,
    gap: 12
  },
  hero: {
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 28,
    padding: 24
  },
  headerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  heroEyebrow: {
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  heroIntro: {
    lineHeight: 22
  },
  metricsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 16,
    columnGap: 12
  },
  metricCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 22,
    padding: 20,
    minWidth: 145
  },
  metricLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10
  },
  metricHelper: {
    marginTop: 12,
    lineHeight: 19
  },
  orderList: {
    gap: 20
  },
  orderCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 26,
    padding: 22,
    gap: 18
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16
  },
  orderHeaderText: {
    flex: 1,
    gap: 6
  },
  statusPill: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  orderMeta: {
    gap: 12
  },
  metaRow: {
    gap: 4
  },
  metaLabel: {
    letterSpacing: 0.5
  },
  highlights: {
    gap: 8
  },
  highlightRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start'
  },
  highlightBullet: {
    marginTop: -2
  }
});
