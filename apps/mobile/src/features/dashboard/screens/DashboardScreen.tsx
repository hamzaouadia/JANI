import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';

export const DashboardScreen = () => {
  const theme = useAppTheme();

  return (
    <Screen padded={false}>
      <View style={[styles.hero, { backgroundColor: theme.colors.surface }]}>
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Dashboard</Text>
        <Text
          style={[theme.typography.body, styles.subtitle, { color: theme.colors.textMuted }]}
        >
          High-level health of your supply operations at a glance.
        </Text>
      </View>
      <View style={styles.metricsRow}>
        <View
          style={[
            styles.metricCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
          ]}
        >
          <Text
            style={[theme.typography.caption, styles.metricLabel, { color: theme.colors.textMuted }]}
          >
            Active Suppliers
          </Text>
          <Text style={[theme.typography.heading, { color: theme.colors.primary }]}>32</Text>
        </View>
        <View
          style={[
            styles.metricCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
          ]}
        >
          <Text
            style={[theme.typography.caption, styles.metricLabel, { color: theme.colors.textMuted }]}
          >
            Open Orders
          </Text>
          <Text style={[theme.typography.heading, { color: theme.colors.primary }]}>8</Text>
        </View>
      </View>
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
        ]}
      >
        <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Alerts</Text>
        <Text
          style={[theme.typography.body, styles.sectionBody, { color: theme.colors.textMuted }]}
        >
          No critical alerts. Keep monitoring order lead times to stay ahead of delays.
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  subtitle: {
    marginTop: 12
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 20
  },
  metricCard: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4
  },
  metricLabel: {
    textTransform: 'uppercase',
    marginBottom: 8
  },
  sectionCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginTop: 24
  },
  sectionBody: {
    marginTop: 12
  }
});
