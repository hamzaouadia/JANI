import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AdminDashboardScreen } from '@/features/admin/screens/AdminDashboardScreen';
import { AdminUsersScreen } from '@/features/admin/screens/AdminUsersScreen';
import { AdminFarmsScreen } from '@/features/admin/screens/AdminFarmsScreen';
import { AdminAnalyticsScreen } from '@/features/admin/screens/AdminAnalyticsScreen';
import { PlaceholderScreen } from '@/navigation/PlaceholderScreen';

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminUsers: undefined;
  AdminFarms: undefined;
  AdminTraceability: undefined;
  AdminExporters: undefined;
  AdminAnalytics: undefined;
  AdminSettings: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="AdminFarms" component={AdminFarmsScreen} />
      <Stack.Screen name="AdminTraceability" component={PlaceholderScreen} />
      <Stack.Screen name="AdminExporters" component={PlaceholderScreen} />
      <Stack.Screen name="AdminAnalytics" component={AdminAnalyticsScreen} />
      <Stack.Screen name="AdminSettings" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};