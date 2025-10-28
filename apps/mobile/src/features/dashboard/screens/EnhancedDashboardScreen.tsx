import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp, NavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/utils/permissions';
import { getTabsForRole } from '@/navigation/config/simplifiedNavigation';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color,
  onPress
}: { 
  title: string; 
  value: string; 
  change?: string; 
  icon: IoniconName; 
  color: string;
  onPress?: () => void;
}) => {
  const theme = useAppTheme();
  
  const Card = onPress ? Pressable : View;
  
  return (
    <Card 
      style={[styles.metricCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={onPress}
    >
      <View style={styles.metricHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        {change && (
          <Text style={[styles.changeText, { color: change.startsWith('+') ? '#10B981' : '#EF4444' }]}>
            {change}
          </Text>
        )}
      </View>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.metricTitle, { color: theme.colors.textMuted }]}>{title}</Text>
      {onPress && (
        <View style={styles.metricTap}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, fontSize: 10 }]}>
            Tap for details
          </Text>
        </View>
      )}
    </Card>
  );
};

const ActionButton = ({ 
  title, 
  icon, 
  onPress, 
  color 
}: { 
  title: string; 
  icon: IoniconName; 
  onPress: () => void; 
  color: string; 
}) => {
  const theme = useAppTheme();
  
  return (
    <Pressable 
      style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
    </Pressable>
  );
};

type DashboardNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<Record<string, object | undefined>>,
  NavigationProp<Record<string, object | undefined>>
>;

export const EnhancedDashboardScreen = () => {
  const theme = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role ?? 'farm';
  const navigation = useNavigation<DashboardNavigation>();
  

  // Helper function to show metric details
  const showMetricDetails = (title: string, value: string, description: string) => {
    Alert.alert(title, `Current Value: ${value}\n\n${description}`, [{ text: 'OK' }]);
  };

  // Role-specific metrics with interactive details
  const getMetricsForRole = () => {
    switch (userRole) {
      case 'farm':
        return [
          { 
            title: 'Active Plots', 
            value: '8', 
            change: '+2', 
            icon: 'leaf-outline', 
            color: theme.colors.primary,
            onPress: () => showMetricDetails('Active Plots', '8 plots', 'Total number of active plots under cultivation. Added 2 new plots this month.')
          },
          { 
            title: 'Farm Workers', 
            value: '24', 
            icon: 'people-outline', 
            color: theme.colors.secondary,
            onPress: () => showMetricDetails('Farm Workers', '24 workers', 'Number of workers currently active in your farm operations.')
          },
          { 
            title: 'This Month\'s Harvest', 
            value: '1,245 kg', 
            change: '+8%', 
            icon: 'basket-outline', 
            color: theme.colors.success,
            onPress: () => showMetricDetails('This Month\'s Harvest', '1,245 kg', 'Total harvest collected this month. Up 8% from last month.')
          },
          { 
            title: 'Quality Score', 
            value: '94%', 
            change: '+2%', 
            icon: 'shield-checkmark-outline', 
            color: theme.colors.warning,
            onPress: () => showMetricDetails('Quality Score', '94%', 'Overall quality rating based on inspections and compliance checks. Improved by 2% this month.')
          }
        ];
      case 'logistics':
        return [
          { 
            title: 'Active Routes', 
            value: '15', 
            icon: 'car-outline', 
            color: theme.colors.primary,
            onPress: () => showMetricDetails('Active Routes', '15 routes', 'Number of logistics routes currently being served by your fleet.')
          },
          { 
            title: 'Deliveries Today', 
            value: '32', 
            change: '+5', 
            icon: 'checkmark-done-circle-outline', 
            color: theme.colors.success,
            onPress: () => showMetricDetails('Deliveries Today', '32 deliveries', 'Successful deliveries completed today. 5 more than yesterday.')
          },
          { 
            title: 'Pending Pickups', 
            value: '8', 
            icon: 'time-outline', 
            color: theme.colors.warning,
            onPress: () => showMetricDetails('Pending Pickups', '8 pickups', 'Number of pickups scheduled but not yet completed.')
          },
          { 
            title: 'Avg Delivery Time', 
            value: '2.4h', 
            change: '-12min', 
            icon: 'timer-outline', 
            color: theme.colors.secondary,
            onPress: () => showMetricDetails('Average Delivery Time', '2.4 hours', 'Average time from pickup to delivery. Improved by 12 minutes this week.')
          }
        ];
      case 'exporter':
        return [
          { 
            title: 'Export Volume (kg)', 
            value: '12,450', 
            change: '+12%', 
            icon: 'airplane', 
            color: theme.colors.primary,
            onPress: () => showMetricDetails('Export Volume', '12,450 kg', 'Total volume exported this month. Increased by 12% compared to last month.')
          },
          { 
            title: 'Active Certifications', 
            value: '18', 
            icon: 'ribbon', 
            color: theme.colors.success,
            onPress: () => showMetricDetails('Active Certifications', '18 certificates', 'Number of valid quality and compliance certifications.')
          },
          { 
            title: 'Compliance Score', 
            value: '98%', 
            change: '+1%', 
            icon: 'shield-checkmark', 
            color: theme.colors.secondary,
            onPress: () => showMetricDetails('Compliance Score', '98%', 'Overall compliance rating with export regulations. Improved by 1% this month.')
          },
          { 
            title: 'Revenue (USD)', 
            value: '$45,200', 
            change: '+18%', 
            icon: 'trending-up', 
            color: theme.colors.success,
            onPress: () => showMetricDetails('Revenue', '$45,200', 'Total export revenue this month. Outstanding 18% growth from last month.')
          }
        ];
      case 'buyer':
        return [
          { 
            title: 'Active Orders', 
            value: '23', 
            icon: 'bag', 
            color: theme.colors.primary,
            onPress: () => showMetricDetails('Active Orders', '23 orders', 'Number of purchase orders currently being processed.')
          },
          { 
            title: 'Suppliers', 
            value: '12', 
            change: '+2', 
            icon: 'business', 
            color: theme.colors.secondary,
            onPress: () => showMetricDetails('Suppliers', '12 suppliers', 'Active suppliers in your network. Added 2 new suppliers this month.')
          },
          { 
            title: 'Quality Rating', 
            value: '4.8/5', 
            icon: 'star', 
            color: theme.colors.warning,
            onPress: () => showMetricDetails('Quality Rating', '4.8/5', 'Average quality rating of received products based on inspections.')
          },
          { 
            title: 'Cost Savings', 
            value: '12%', 
            change: '+3%', 
            icon: 'trending-down', 
            color: theme.colors.success,
            onPress: () => showMetricDetails('Cost Savings', '12%', 'Cost savings achieved through optimized procurement. Up 3% this month.')
          }
        ];
      default:
        return [];
    }
  };

  // Helper function to navigate to a tab if it exists for the user's role
  const navigateToTab = (tabKey: string, fallbackMessage: string) => {
    const userTabs = getTabsForRole(userRole);
    const targetTab = userTabs.find(tab => tab.key.toLowerCase().includes(tabKey.toLowerCase()));
    
    if (targetTab) {
      navigation.navigate(targetTab.key);
    } else {
      Alert.alert('Not Available', fallbackMessage, [{ text: 'OK' }]);
    }
  };

  // Role-specific actions
  const getActionsForRole = () => {
    const actions: Array<{ title: string; icon: string; onPress: () => void; color: string }> = [];
    
    // Add role-specific primary actions first
    switch (userRole) {
      case 'farm':
        if (hasPermission(userRole, 'manage_farms')) {
          actions.push({
            title: 'My Plots',
            icon: 'leaf',
            onPress: () => navigateToTab('farms', 'Plot management is not available.'),
            color: theme.colors.success
          });
        }
        if (hasPermission(userRole, 'capture_data')) {
          actions.push({
            title: 'Record Event',
            icon: 'camera',
            onPress: () => navigateToTab('capture', 'Event recording is not available.'),
            color: theme.colors.primary
          });
        }
        break;
        
      case 'logistics':
        if (hasPermission(userRole, 'manage_logistics')) {
          actions.push({
            title: 'Fleet Management',
            icon: 'car',
            onPress: () => Alert.alert('Fleet Management', 'Fleet management features coming soon!', [{ text: 'OK' }]),
            color: theme.colors.primary
          });
        }
        if (hasPermission(userRole, 'capture_data')) {
          actions.push({
            title: 'Scan QR Code',
            icon: 'qr-code',
            onPress: () => navigateToTab('capture', 'QR code scanning is not available.'),
            color: theme.colors.secondary
          });
        }
        break;
        
      case 'exporter':
        if (hasPermission(userRole, 'export_data')) {
          actions.push({
            title: 'Export Compliance',
            icon: 'shield-checkmark',
            onPress: () => Alert.alert('Export Compliance', 'Compliance dashboard coming soon!', [{ text: 'OK' }]),
            color: theme.colors.primary
          });
        }
        actions.push({
          title: 'Quality Certificates',
          icon: 'ribbon',
          onPress: () => Alert.alert('Certificates', 'Quality certificate management coming soon!', [{ text: 'OK' }]),
          color: theme.colors.success
        });
        break;
        
      case 'buyer':
        if (hasPermission(userRole, 'view_suppliers')) {
          actions.push({
            title: 'Supplier Network',
            icon: 'business',
            onPress: () => Alert.alert('Supplier Network', 'Supplier management coming soon!', [{ text: 'OK' }]),
            color: theme.colors.primary
          });
        }
        actions.push({
          title: 'Quality Reports',
          icon: 'document-text',
          onPress: () => Alert.alert('Quality Reports', 'Quality reporting features coming soon!', [{ text: 'OK' }]),
          color: theme.colors.secondary
        });
        break;
    }
    
    // Add common actions for all roles
    if (hasPermission(userRole, 'view_orders') || hasPermission(userRole, 'manage_orders')) {
      actions.push({
        title: hasPermission(userRole, 'manage_orders') ? 'Manage Orders' : 'View Orders',
        icon: 'receipt',
        onPress: () => navigateToTab('orders', 'Order management is not available for your role.'),
        color: theme.colors.warning
      });
    }
    
    if (hasPermission(userRole, 'view_analytics')) {
      actions.push({
        title: 'View Analytics',
        icon: 'stats-chart',
        onPress: () => navigateToTab('analytics', 'Analytics are not available for your role.'),
        color: theme.colors.secondary
      });
    }

    // Add Profile/Settings action for all roles
    actions.push({
      title: 'Profile & Settings',
      icon: 'person-circle',
      onPress: () => navigateToTab('profile', 'Profile settings are not available.'),
      color: theme.colors.textMuted
    });

    return actions.slice(0, 6); // Limit to 6 actions to avoid overcrowding
  };

  const metrics = getMetricsForRole();
  const actions = getActionsForRole();

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary + '15', theme.colors.background]}
          style={styles.header}
        >
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            Welcome back, {user?.profile?.name || user?.email || 'User'}
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Here&apos;s your {userRole} dashboard overview
          </Text>
        </LinearGradient>


        {/* Metrics Grid */}
        <View style={styles.section}>
          <Text style={[theme.typography.subheading, { color: theme.colors.text, marginBottom: 16 }]}>
            Key Metrics
          </Text>
          <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon as IoniconName}
                color={metric.color}
                onPress={metric.onPress}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[theme.typography.subheading, { color: theme.colors.text, marginBottom: 16 }]}>
            Quick Actions
          </Text>
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              title={action.title}
              icon={action.icon as IoniconName}
              onPress={action.onPress}
              color={action.color}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricTap: {
    marginTop: 4,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});