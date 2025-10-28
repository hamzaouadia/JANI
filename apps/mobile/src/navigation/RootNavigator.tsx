import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthNavigator } from './AuthNavigator';
import { SimplifiedTabs } from './SimplifiedTabs';
import { resetRoot } from './navigationRef';
import { useAuthStore } from '@/stores/authStore';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { RootStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const hydrate = useAuthStore((state) => state.hydrate);
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  const theme = useAppTheme();

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  useEffect(() => {
    if (hydrated) {
      resetRoot(user ? 'AppTabs' : 'Auth');
    }
  }, [hydrated, user]);

  if (!hydrated) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom'
      }}
    >
      {user ? (
        <Stack.Group key="app-group">
          <Stack.Screen name="AppTabs" component={SimplifiedTabs} />
        </Stack.Group>
      ) : (
        <Stack.Group key="auth-group">
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
