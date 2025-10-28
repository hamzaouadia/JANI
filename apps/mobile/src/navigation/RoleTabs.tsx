import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { navMatrix } from '@/navigation/config/navMatrix';
import { mapAuthRoleToNavRole } from '@/navigation/config/roleMapping';
import { PlaceholderScreen } from '@/navigation/PlaceholderScreen';
import { getCustomTabComponent } from '@/navigation/config/tabRegistry';
import type { NavTab } from '@/navigation/config/navMatrix';

const Tab = createBottomTabNavigator<ParamListBase>();

const iconMap: Record<string, { focused: string; unfocused: string }> = {
  guide: { focused: 'book', unfocused: 'book-outline' },
  'my-farms': { focused: 'leaf', unfocused: 'leaf-outline' },
  capture: { focused: 'camera', unfocused: 'camera-outline' },
  collections: { focused: 'cube', unfocused: 'cube-outline' },
  chat: { focused: 'chatbubbles', unfocused: 'chatbubbles-outline' },
  profile: { focused: 'person', unfocused: 'person-outline' },
  settings: { focused: 'settings', unfocused: 'settings-outline' },
  overview: { focused: 'home', unfocused: 'home-outline' },
  dashboard: { focused: 'speedometer', unfocused: 'speedometer-outline' },
  'lots-collections': { focused: 'albums', unfocused: 'albums-outline' },
  'inventory-tasks': { focused: 'list', unfocused: 'list-outline' },
  'team-chat': { focused: 'people', unfocused: 'people-outline' },
  tasks: { focused: 'checkbox', unfocused: 'square-outline' },
  'farmers-farms': { focused: 'business', unfocused: 'business-outline' },
  'audits-flags': { focused: 'flag', unfocused: 'flag-outline' },
  routes: { focused: 'trail-sign', unfocused: 'trail-sign-outline' },
  scans: { focused: 'qr-code', unfocused: 'qr-code-outline' },
  'loads-manifests': { focused: 'document-text', unfocused: 'document-text-outline' },
  incidents: { focused: 'warning', unfocused: 'warning-outline' },
  lots: { focused: 'albums', unfocused: 'albums-outline' },
  certificates: { focused: 'ribbon', unfocused: 'ribbon-outline' },
  audits: { focused: 'shield-checkmark', unfocused: 'shield-outline' },
  analytics: { focused: 'stats-chart', unfocused: 'stats-chart-outline' },
  'profile-settings': { focused: 'options', unfocused: 'options-outline' },
  'members-farms': { focused: 'people', unfocused: 'people-outline' },
  'data-quality': { focused: 'checkmark-done', unfocused: 'checkmark-done-outline' },
  incentives: { focused: 'cash', unfocused: 'cash-outline' },
  scan: { focused: 'qr-code', unfocused: 'qr-code-outline' },
  trace: { focused: 'time', unfocused: 'time-outline' },
  certifications: { focused: 'ribbon', unfocused: 'ribbon-outline' },
  story: { focused: 'book', unfocused: 'book-outline' },
  feedback: { focused: 'send', unfocused: 'send-outline' },
  'users-roles': { focused: 'people', unfocused: 'people-outline' },
  jobs: { focused: 'construct', unfocused: 'construct-outline' },
  'logs-alerts': { focused: 'alert-circle', unfocused: 'alert-circle-outline' },
  'config-flags': { focused: 'toggle', unfocused: 'toggle-outline' },
  health: { focused: 'medkit', unfocused: 'medkit-outline' }
};

type NamedComponent = React.ComponentType & { displayName?: string };
const makeScreen = (title: string) => {
  const C: NamedComponent = () => <PlaceholderScreen>{title}</PlaceholderScreen>;
  C.displayName = `${title}Screen`;
  return C;
};

const TabStack: React.FC<{ tab: NavTab }> = ({ tab }) => {
  const Stack = useMemo(() => createNativeStackNavigator<ParamListBase>(), []);
  const theme = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName={tab.initialRoute}
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.text }
      }}
    >
      {tab.stack.map((s) => (
        <Stack.Screen key={s.name} name={s.name} component={makeScreen(s.name)} options={{ title: s.name }} />
      ))}
    </Stack.Navigator>
  );
};

export const RoleTabs = (): JSX.Element => {
  const theme = useAppTheme();
  const userRole = useAuthStore((s) => s.user?.role);

  const roleConfig = useMemo(() => {
    const roleKey = mapAuthRoleToNavRole(userRole ?? 'farm');
    return navMatrix.roles.find((r) => r.role === roleKey) ?? navMatrix.roles[0];
  }, [userRole]);

  return (
    <Tab.Navigator
      initialRouteName={roleConfig.initialTab}
      screenOptions={({ route }) => {
        const icon = iconMap[route.name] ?? { focused: 'ellipse', unfocused: 'ellipse-outline' };
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
            paddingVertical: 10,
            shadowColor: '#1A342720',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 6
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size: _size }) => (
            <Ionicons name={(focused ? icon.focused : icon.unfocused) as React.ComponentProps<typeof Ionicons>['name']} color={color} size={22} />
          )
        };
      }}
    >
      {roleConfig.tabs.map((tab) => {
        const Custom = getCustomTabComponent(roleConfig.role, tab.key);
        return (
          <Tab.Screen key={tab.key} name={tab.key} options={{ title: tab.title }}>
            {() => (Custom ? <Custom /> : <TabStack tab={tab} />)}
          </Tab.Screen>
        );
      })}
    </Tab.Navigator>
  );
};
