import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

interface AdminMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface AdminSection {
  id: string;
  title: string;
  description: string;
  items: {
    id: string;
    label: string;
    value?: string;
    status: 'success' | 'warning' | 'error' | 'info';
  }[];
}

const adminMetrics: AdminMetric[] = [
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
    id: 'exporters',
    title: 'Exporters',
    value: '23',
    change: '+15.7%',
    changeType: 'positive',
    icon: '📦'
  },
  {
    id: 'events',
    title: 'Trace Events',
    value: '4,567',
    change: '+23.4%',
    changeType: 'positive',
    icon: '🔗'
  }
];

const adminSections: AdminSection[] = [
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Recent user activities and pending verifications',
    items: [
      { id: '1', label: 'Pending farm verifications', value: '12', status: 'warning' },
      { id: '2', label: 'New registrations today', value: '8', status: 'info' },
      { id: '3', label: 'Compliance alerts', value: '3', status: 'error' }
    ]
  },
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Platform performance and operational status',
    items: [
      { id: '1', label: 'API response time', value: '125ms', status: 'success' },
      { id: '2', label: 'Database connections', status: 'success' },
      { id: '3', label: 'Last backup completed', status: 'success' }
    ]
  }
];

const adminMenuItems = [
  { id: 'users', title: 'Users', subtitle: 'Manage user accounts', icon: '👤', screen: 'AdminUsers' },
  { id: 'farms', title: 'Farms', subtitle: 'Farm management', icon: '🚜', screen: 'AdminFarms' },
  { id: 'traceability', title: 'Traceability', subtitle: 'Supply chain tracking', icon: '🔗', screen: 'AdminTraceability' },
  { id: 'exporters', title: 'Exporters', subtitle: 'Export operations', icon: '📦', screen: 'AdminExporters' },
  { id: 'analytics', title: 'Analytics', subtitle: 'Platform insights', icon: '📊', screen: 'AdminAnalytics' },
  { id: 'settings', title: 'Settings', subtitle: 'System configuration', icon: '⚙️', screen: 'AdminSettings' }
];

export const AdminDashboardScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      case 'info': return theme.colors.secondary;
  default: return theme.colors.textMuted;
    }
  };

  const handleMenuPress = (screen: string) => {
    // @ts-ignore - Navigation will be properly typed when integrated
    navigation.navigate(screen);
  };

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Admin Dashboard
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
            Platform overview and management
          </Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {adminMetrics.map((metric) => (
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.menuGrid}>
            {adminMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleMenuPress(item.screen)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
                <Text style={[styles.menuSubtitle, { color: theme.colors.textMuted }]}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status Sections */}
        {adminSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.textMuted }]}> 
              {section.description}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
              {section.items.map((item, index) => (
                <View 
                  key={item.id} 
                  style={[
                    styles.sectionItem,
                    index < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }
                  ]}
                >
                  <View style={styles.sectionItemContent}>
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={[styles.sectionItemLabel, { color: theme.colors.text }]}>{item.label}</Text>
                  </View>
                  {item.value && (
                    <Text style={[styles.sectionItemValue, { color: theme.colors.textMuted }]}> 
                      {item.value}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
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
  },
  metricCardInner: {
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
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  sectionCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  sectionItemLabel: {
    fontSize: 14,
    flex: 1,
  },
  sectionItemValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  menuItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  menuItemInner: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});