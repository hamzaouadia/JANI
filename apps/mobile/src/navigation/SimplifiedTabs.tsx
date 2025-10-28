import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ParamListBase } from '@react-navigation/native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { getTabsForRole, getInitialTabForRole } from '@/navigation/config/simplifiedNavigation';

// Import navigators and screens
import { FarmsNavigator } from '@/navigation/farms/FarmsNavigator';
import { CaptureTabScreen } from '@/features/capture/screens/CaptureScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { OrdersScreen } from '@/features/orders/screens/OrdersScreen';
import { EnhancedDashboardScreen } from '@/features/dashboard/screens/EnhancedDashboardScreen';
import { FarmStatesScreen } from '@/features/farms/screens/FarmStatesScreen';
import { AdminDashboardScreen } from '@/features/admin/screens/AdminDashboardScreen';
import { AdminUsersScreen } from '@/features/admin/screens/AdminUsersScreen';
import { AdminFarmsScreen } from '@/features/admin/screens/AdminFarmsScreen';
import { AdminAnalyticsScreen } from '@/features/admin/screens/AdminAnalyticsScreen';

const Tab = createBottomTabNavigator<ParamListBase>();

// Map component strings to actual components
const COMPONENT_MAP = {
  HomeNavigator: HomeScreen,
  FarmsNavigator: FarmsNavigator,
  CaptureScreen: CaptureTabScreen,
  OrdersNavigator: OrdersScreen,
  AnalyticsNavigator: EnhancedDashboardScreen,
  ProfileScreen: ProfileScreen,
  FarmStatesScreen: FarmStatesScreen,
  AdminDashboard: AdminDashboardScreen,
  AdminUsers: AdminUsersScreen,
  AdminFarms: AdminFarmsScreen,
  AdminAnalytics: AdminAnalyticsScreen
};

const AnimatedTabIcon = ({ focused, icon }: { focused: boolean; icon: { focused: string; unfocused: string } }) => {
  const theme = useAppTheme();
  const progress = useSharedValue(focused ? 1 : 0);
  
  React.useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, { 
      duration: 220, 
      easing: Easing.out(Easing.cubic) 
    });
  }, [focused, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.9 + progress.value * 0.1 }],
    backgroundColor: focused ? theme.colors.primary : 'transparent',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: focused ? theme.colors.primary + '40' : 'transparent',
    shadowOffset: { width: 0, height: focused ? 4 : 0 },
    shadowOpacity: focused ? 0.3 : 0,
    shadowRadius: focused ? 8 : 0,
    elevation: focused ? 4 : 0
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.95 + progress.value * 0.1 }]
  }));

  const currentIcon = (focused ? icon.focused : icon.unfocused) as React.ComponentProps<typeof Ionicons>['name'];
  const iconColor = focused ? '#FFFFFF' : theme.colors.textMuted;

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={iconStyle}>
        <Ionicons
          name={currentIcon}
          color={iconColor}
          size={22}
        />
      </Animated.View>
    </Animated.View>
  );
};

export const SimplifiedTabs = (): JSX.Element => {
  const theme = useAppTheme();
  const userRole = useAuthStore((s) => s.user?.role);
  
  const availableTabs = React.useMemo(() => {
    return getTabsForRole(userRole ?? 'farm');
  }, [userRole]);

  const initialRouteName = React.useMemo(() => {
    return getInitialTabForRole(userRole ?? 'farm');
  }, [userRole]);

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIconStyle: {
          alignItems: 'center',
          justifyContent: 'center'
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.border,
          marginHorizontal: theme.spacing(2),
          marginBottom: theme.spacing(3),
          borderRadius: 50,
          paddingVertical: 12,
          shadowColor: theme.colors.textMuted + '20',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 6,
          height: 56
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
        },
        tabBarHideOnKeyboard: true
      }}
    >
      {availableTabs.map((tab) => {
        const Component = COMPONENT_MAP[tab.component as keyof typeof COMPONENT_MAP];
        
        // Wrapper component to fix navigation type issues
        const WrappedComponent: React.ComponentType<Record<string, unknown>> = (props) => <Component {...props} />;
        
        return (
          <Tab.Screen
            key={tab.key}
            name={tab.key}
            component={WrappedComponent}
            options={{
              title: tab.title,
              tabBarAccessibilityLabel: tab.title,
              tabBarIcon: ({ focused }) => (
                <AnimatedTabIcon focused={focused} icon={tab.icon} />
              )
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};