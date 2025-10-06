import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useNavigationTheme, useThemeColorScheme, ThemeProvider } from '@/theme/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false
    }
  }
});

const NavigationLayer = ({ children }: PropsWithChildren) => {
  const navigationTheme = useNavigationTheme();
  const colorScheme = useThemeColorScheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </NavigationContainer>
  );
};

export const AppProviders = ({ children }: PropsWithChildren) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationLayer>{children}</NavigationLayer>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
