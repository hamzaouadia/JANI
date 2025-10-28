import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import type { MainTabsParamList } from '@/navigation/types';
import { useAppTheme, useThemePreference } from '@/theme/ThemeProvider';
import { JourneyNavigator } from '@/navigation/JourneyNavigator';
import { FarmsNavigator } from '@/navigation/farms/FarmsNavigator';
import { CaptureTabScreen } from '@/features/capture/screens/CaptureScreen';
import { RecordsScreen } from '@/features/records/screens/RecordsScreen';
import { IncentivesScreen } from '@/features/incentives/screens/IncentivesScreen';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { AIScreen } from '@/features/ai/screens/AIScreen';
import { useAuthStore } from '@/stores/authStore';

const Tab = createBottomTabNavigator<MainTabsParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type TabConfig = {
  key: keyof MainTabsParamList;
  title: string;
  icon: { focused: IoniconName; unfocused: IoniconName };
  component: React.ComponentType<any>;
};

const TABS: TabConfig[] = [
  { key: 'Journey', title: 'Journey', icon: { focused: 'map', unfocused: 'map-outline' }, component: JourneyNavigator },
  { key: 'Farms', title: 'Farms', icon: { focused: 'leaf', unfocused: 'leaf-outline' }, component: FarmsNavigator },
  { key: 'Capture', title: 'Capture', icon: { focused: 'camera', unfocused: 'camera-outline' }, component: CaptureTabScreen },
  { key: 'AI', title: 'AI', icon: { focused: 'chatbubbles', unfocused: 'chatbubbles-outline' }, component: AIScreen },
  { key: 'Records', title: 'Records', icon: { focused: 'albums', unfocused: 'albums-outline' }, component: RecordsScreen },
  { key: 'Incentives', title: 'Incentives', icon: { focused: 'trophy', unfocused: 'trophy-outline' }, component: IncentivesScreen },
  { key: 'Profile', title: 'Profile', icon: { focused: 'person', unfocused: 'person-outline' }, component: ProfileScreen },
  { key: 'Settings', title: 'Settings', icon: { focused: 'settings', unfocused: 'settings-outline' }, component: SettingsScreen }
];

const HeaderActions = () => {
  const theme = useAppTheme();
  const { preference, setPreference } = useThemePreference();
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);

  const cyclePreference = () => {
    const order: Array<typeof preference> = ['light', 'dark', 'system'];
    const idx = order.indexOf(preference);
    const next = order[(idx + 1) % order.length];
    setPreference(next);
  };
  const iconName: React.ComponentProps<typeof Ionicons>['name'] =
    preference === 'light' ? 'sunny-outline' : preference === 'dark' ? 'moon-outline' : 'contrast-outline';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 8 }}>
      <Pressable
        onPress={cyclePreference}
        hitSlop={12}
        style={{ padding: 8, borderRadius: 999, backgroundColor: theme.colors.primaryMuted }}
        accessibilityRole="button"
        accessibilityLabel={`Theme: ${preference}`}
      >
        <Ionicons name={iconName} size={20} color={theme.colors.primary} />
      </Pressable>
      <Pressable
        onPress={() => void logout()}
        disabled={loading}
        hitSlop={12}
        style={{ padding: 8, borderRadius: 999, backgroundColor: theme.colors.primary }}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

export const MainTabs = () => {
  const theme = useAppTheme();

  return (
    <Tab.Navigator
      initialRouteName="Journey"
      screenOptions={({ route }) => {
  const icon = TABS.find((t) => t.key === route.name)?.icon;

  type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

  const TabIcon = ({ focused }: { focused: boolean }) => {
          const progress = useSharedValue(focused ? 1 : 0);
          progress.value = withTiming(focused ? 1 : 0, { duration: 220, easing: Easing.out(Easing.cubic) });

          const circleStyle = useAnimatedStyle(() => ({
            transform: [{ scale: 0.9 + progress.value * 0.1 }],
            opacity: 0.6 + progress.value * 0.4
          }));
          const iconStyle = useAnimatedStyle(() => ({
            transform: [{ scale: 0.95 + progress.value * 0.1 }, { translateY: -2 * progress.value }]
          }));

          const currentIcon: IoniconName = focused ? (icon?.focused ?? 'ellipse') : (icon?.unfocused ?? 'ellipse-outline');
          const backgroundColor = focused ? theme.colors.primary : 'transparent';
          const tintColor = focused ? '#FFFFFF' : theme.colors.textMuted;

          return (
            <Animated.View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor,
                shadowColor: focused ? '#1A342720' : 'transparent',
                shadowOffset: { width: 0, height: focused ? 6 : 0 },
                shadowOpacity: focused ? 0.16 : 0,
                shadowRadius: focused ? 12 : 0,
                elevation: focused ? 4 : 0
              }}
            >
              <Animated.View style={circleStyle}>
                <Ionicons
                  name={currentIcon}
                  color={tintColor}
                  size={22}
                  style={[{ includeFontPadding: false, textAlignVertical: 'center' }, iconStyle]}
                />
              </Animated.View>
            </Animated.View>
          );
        };

  return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: 'transparent',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.border,
            marginHorizontal: theme.spacing(4),
            marginBottom: theme.spacing(3),
            borderRadius: 32,
            paddingVertical: 12,
            shadowColor: '#1A342720',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 6
          },
          tabBarShowLabel: false,
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center'
          },
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} />
        };
      }}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.key}
          name={tab.key}
          component={tab.component}
          options={{
            title: tab.title,
            tabBarAccessibilityLabel: tab.title,
            ...(tab.key === 'Profile'
              ? {
                  headerShown: true,
                  headerTitle: 'Profile',
                  headerRight: () => <HeaderActions />,
                  headerStyle: { backgroundColor: theme.colors.surface },
                  headerShadowVisible: false,
                  headerTitleStyle: { color: theme.colors.text }
                }
              : null)
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
