import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

const analyticsMetrics: AnalyticsMetric[] = [
  {
    id: 'users',
    title: 'Total Users',
    value: '1,284',
    change: '+12.5%',
    changeType: 'positive',
    icon: '👥'
  },
  {
    id: 'farms',
    title: 'Active Farms',
    value: '156',
    change: '+8.3%',
    changeType: 'positive',
    icon: '🚜'
  },
  {
    id: 'exports',
    title: 'Export Volume',
    value: '2,450T',
    change: '+15.7%',
    changeType: 'positive',
    icon: '📦'
  },
  {
    id: 'sustainability',
    title: 'Avg Sustainability',
    value: '78.5',
    change: '+2.1%',
    changeType: 'positive',
    icon: '🌱'
  }
];

export const AdminAnalyticsScreen = () => {
  const theme = useAppTheme();

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Platform Analytics
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
            Key performance indicators and insights
          </Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {analyticsMetrics.map((metric) => (
            <View key={metric.id} style={[styles.metricCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={[styles.metricChange, { 
                  color: metric.changeType === 'positive' ? theme.colors.success : 
                         metric.changeType === 'negative' ? theme.colors.error : theme.colors.textMuted 
                }]}>
                  {metric.change}
                </Text>
              </View>
              <Text style={[styles.metricValue, { color: theme.colors.text }]}>{metric.value}</Text>
              <Text style={[styles.metricTitle, { color: theme.colors.textMuted }]}>{metric.title}</Text>
            </View>
          ))}
        </View>

        {/* Geographic Distribution */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Geographic Distribution</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.regionItem}>
              <Text style={[styles.regionName, { color: theme.colors.text }]}>North Valley</Text>
              <Text style={[styles.regionValue, { color: theme.colors.textMuted }]}>45 farms</Text>
            </View>
            <View style={styles.regionItem}>
              <Text style={[styles.regionName, { color: theme.colors.text }]}>Highland District</Text>
              <Text style={[styles.regionValue, { color: theme.colors.textMuted }]}>38 farms</Text>
            </View>
            <View style={styles.regionItem}>
              <Text style={[styles.regionName, { color: theme.colors.text }]}>Coastal Region</Text>
              <Text style={[styles.regionValue, { color: theme.colors.textMuted }]}>42 farms</Text>
            </View>
            <View style={styles.regionItem}>
              <Text style={[styles.regionName, { color: theme.colors.text }]}>Mountain Area</Text>
              <Text style={[styles.regionValue, { color: theme.colors.textMuted }]}>31 farms</Text>
            </View>
          </View>
        </View>

        {/* Compliance Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Compliance Overview</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.complianceItem}>
              <Text style={[styles.complianceLabel, { color: theme.colors.textMuted }]}>Farm Compliance Rate</Text>
              <Text style={[styles.complianceValue, { color: theme.colors.success }]}>91.0%</Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={[styles.complianceLabel, { color: theme.colors.textMuted }]}>Exporter Certification</Text>
              <Text style={[styles.complianceValue, { color: theme.colors.success }]}>78.3%</Text>
            </View>
            <View style={styles.complianceItem}>
              <Text style={[styles.complianceLabel, { color: theme.colors.textMuted }]}>Traceability Events</Text>
              <Text style={[styles.complianceValue, { color: theme.colors.text }]}>4,567</Text>
            </View>
          </View>
        </View>

        {/* Sustainability Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Sustainability Metrics</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.sustainabilityGrid}>
              <View style={styles.sustainabilityItem}>
                <Text style={[styles.sustainabilityValue, { color: theme.colors.success }]}>78.5</Text>
                <Text style={[styles.sustainabilityLabel, { color: theme.colors.textMuted }]}>Avg Score</Text>
              </View>
              <View style={styles.sustainabilityItem}>
                <Text style={[styles.sustainabilityValue, { color: theme.colors.success }]}>89</Text>
                <Text style={[styles.sustainabilityLabel, { color: theme.colors.textMuted }]}>Organic Farms</Text>
              </View>
              <View style={styles.sustainabilityItem}>
                <Text style={[styles.sustainabilityValue, { color: theme.colors.success }]}>67</Text>
                <Text style={[styles.sustainabilityLabel, { color: theme.colors.textMuted }]}>Fair Trade</Text>
              </View>
              <View style={styles.sustainabilityItem}>
                <Text style={[styles.sustainabilityValue, { color: theme.colors.success }]}>2,340t</Text>
                <Text style={[styles.sustainabilityLabel, { color: theme.colors.textMuted }]}>CO₂ Offset</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  metricCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    fontSize: 24,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  regionValue: {
    fontSize: 14,
  },
  complianceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  complianceLabel: {
    fontSize: 14,
  },
  complianceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  sustainabilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sustainabilityItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  sustainabilityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sustainabilityLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});