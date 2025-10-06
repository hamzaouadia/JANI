import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { OrdersScreen } from '@/features/orders/screens/OrdersScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import { useAppTheme } from '@/theme/ThemeProvider';

import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS = {
  Dashboard: { focused: 'speedometer', unfocused: 'speedometer-outline' },
  Home: { focused: 'home', unfocused: 'home-outline' },
  Orders: { focused: 'cart', unfocused: 'cart-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
  Settings: { focused: 'settings', unfocused: 'settings-outline' }
} as const satisfies Record<
  keyof MainTabParamList,
  { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }
>;

export const MainTabs = () => {
  const theme = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const icon = ICONS[route.name];

        return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border
          },
          tabBarLabelStyle: {
            fontSize: 12
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? icon.focused : icon.unfocused} color={color} size={size} />
          )
        };
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
