import { Fragment, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Animated, { FadeInUp, Layout, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Screen } from '@/components/layout/Screen';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROLE_DASHBOARD_CONFIG } from '@/features/dashboard/constants/roleDashboards';
import { useAuthStore } from '@/stores/authStore';
import { useAppTheme } from '@/theme/ThemeProvider';

export const DashboardScreen = () => {
  const theme = useAppTheme();
  const user = useAuthStore((state) => state.user);

  const roleConfig = useMemo(() => {
    if (!user) {
      return ROLE_DASHBOARD_CONFIG.farm;
    }

    return ROLE_DASHBOARD_CONFIG[user.role] ?? ROLE_DASHBOARD_CONFIG.farm;
  }, [user]);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const heroParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - Math.min(scrollY.value / 1500, 0.03) },
      { translateY: -Math.min(scrollY.value / 8, 8) }
    ],
    opacity: 1 - Math.min(scrollY.value / 800, 0.1)
  }));

  const statusColors: Record<string, string> = {
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
    info: theme.colors.secondary
  };

  const [query, setQuery] = useState('');
  const filteredSections = useMemo(() => {
    if (!query.trim()) return roleConfig.sections;
    const q = query.toLowerCase();
    return roleConfig.sections
      .map((section) => ({
        ...section,
        items: (section.items ?? []).filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            (item.helper ? item.helper.toLowerCase().includes(q) : false)
        )
      }))
      .filter((section) => (section.items?.length ?? 0) > 0);
  }, [roleConfig, query]);
  const totalResults = useMemo(
    () => filteredSections.reduce((acc, s) => acc + (s.items?.length ?? 0), 0),
    [filteredSections]
  );

  const metricCardWidth = roleConfig.metrics.length > 2 ? '32%' : '48%';
  const cardSurfaceStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    shadowColor: '#1A342720',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2
  };

  return (
    <Screen padded={false}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInUp.springify().damping(16)}
          layout={Layout.springify()}
          style={[
            styles.hero,
            {
              backgroundColor: theme.colors.primaryMuted,
              borderColor: `${theme.colors.primary}33`
            },
            heroParallaxStyle
          ]}
        >
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            {roleConfig.title}
          </Text>
          <Text
            style={[theme.typography.body, styles.subtitle, { color: theme.colors.textMuted }]}
          >
            {roleConfig.subtitle}
          </Text>
        </Animated.View>

        <View style={styles.metricsWrapper}>
          {roleConfig.metrics.map((metric) => (
            <View
              key={metric.id}
              style={[
                styles.metricCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: 'transparent',
                  width: metricCardWidth,
                  shadowColor: '#1A342720',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.08,
                  shadowRadius: 14,
                  elevation: 2
                }
              ]}
            >
              <Text
                style={[theme.typography.caption, styles.metricLabel, { color: theme.colors.textMuted }]}
              >
                {metric.label}
              </Text>
              <Text style={[theme.typography.heading, { color: theme.colors.primary }]}>
                {metric.value}
              </Text>
              {metric.helper ? (
                <Text
                  style={[theme.typography.body, styles.metricHelper, { color: theme.colors.textMuted }]}
                >
                  {metric.helper}
                </Text>
              ) : null}
              {metric.trend ? (
                <Text
                  style={[
                    theme.typography.caption,
                    styles.metricTrend,
                    {
                      color:
                        metric.trend.direction === 'down'
                          ? theme.colors.warning
                          : theme.colors.success
                    }
                  ]}
                >
                  {metric.trend.value} {metric.trend.label}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        <SearchBar placeholder="Search dashboard items" onChangeText={setQuery} />
        <View style={styles.headerRow}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {totalResults} result{totalResults === 1 ? '' : 's'}
          </Text>
        </View>

        {query.trim().length > 0 && filteredSections.length === 0 ? (
          <EmptyState
            icon="search"
            title="No items match your search"
            description="Try a different keyword or clear the search."
            actionLabel="Clear search"
            onActionPress={() => setQuery('')}
          />
        ) : (
          filteredSections.map((section, sectionIndex) => (
          <Animated.View
            entering={FadeInUp.springify().damping(16)}
            layout={Layout.springify()}
            key={section.id}
            style={[
              styles.sectionCard,
              cardSurfaceStyle,
              {
                marginTop: sectionIndex === 0 ? theme.spacing(6) : theme.spacing(4)
              }
            ]}
          >
            <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>
              {section.title}
            </Text>
            <Text
              style={[theme.typography.body, styles.sectionBody, { color: theme.colors.textMuted }]}
            >
              {section.description}
            </Text>
              {section.items?.map((item, itemIndex) => {
                const statusColor = item.status ? statusColors[item.status] ?? theme.colors.text : theme.colors.text;

                return (
                  <Fragment key={item.id}>
                    <View style={[styles.sectionItemRow, { borderColor: theme.colors.border }]}>
                      <View style={styles.sectionItemTextWrapper}>
                        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                          {item.label}
                        </Text>
                        {item.helper ? (
                          <Text
                            style={[theme.typography.caption, styles.sectionItemHelper, { color: theme.colors.textMuted }]}
                          >
                            {item.helper}
                          </Text>
                        ) : null}
                      </View>
                      {item.status ? (
                        <View
                          style={[
                            styles.statusPill,
                            {
                              backgroundColor: `${statusColor}20`,
                              borderColor: statusColor
                            }
                          ]}
                        >
                          <Text style={[theme.typography.caption, { color: statusColor }]}>
                            {item.status.toUpperCase()}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    {itemIndex < (section.items?.length ?? 0) - 1 ? (
                      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                    ) : null}
                  </Fragment>
                );
              })}
            </Animated.View>
          ))
        )}
      </Animated.ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 32,
    paddingBottom: 48,
    gap: 24
  },
  hero: {
    marginHorizontal: 24,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 28,
    gap: 12
  },
  subtitle: {
    marginTop: 0
  },
  metricsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginTop: 24,
    rowGap: 16,
    columnGap: 12
  },
  metricCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 22,
    padding: 20,
    minWidth: 140,
    marginBottom: 16
  },
  metricLabel: {
    textTransform: 'uppercase',
    marginBottom: 8
  },
  metricHelper: {
    marginTop: 12,
    lineHeight: 20
  },
  metricTrend: {
    marginTop: 8
  },
  sectionCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 26,
    padding: 22,
    marginHorizontal: 24,
    gap: 18
  },
  headerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24
  },
  sectionBody: {
    marginTop: 12
  },
  sectionItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  sectionItemTextWrapper: {
    flex: 1,
    paddingRight: 12
  },
  sectionItemHelper: {
    marginTop: 6
  },
  statusPill: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  divider: {
    height: StyleSheet.hairlineWidth
  }
});
