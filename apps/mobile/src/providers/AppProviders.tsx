import { QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import type { PropsWithChildren } from 'react';

import { useNavigationTheme, useThemeColorScheme, ThemeProvider } from '@/theme/ThemeProvider';
import { linking } from '@/navigation/linking';
import { handleNavigationReady, navigationRef } from '@/navigation/navigationRef';
import { OfflineProvider } from '@/providers/OfflineProvider';
import { CaptureProvider } from '@/features/capture/context';
import { createPersistedQueryClient } from '@/lib/offline/persistence';
import { SyncBootstrap } from '@/providers/SyncBootstrap';
import { initRestQueueProcessor } from '@/lib/offline/restQueue';
import { apiClient } from '@/lib/api/client';
import { queryKeys } from '@/constants/queryKeys';
import { ToastProvider } from '@/components/ui/Toast';
import { SQLiteWrapper } from './SQLiteWrapper';

const queryClient = createPersistedQueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false
    }
  }
});

const NavigationLayer = ({ children }: PropsWithChildren) => {
  const navigationTheme = useNavigationTheme();
  const colorScheme = useThemeColorScheme();

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onReady={handleNavigationReady}
      linking={linking}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </NavigationContainer>
  );
};

export const AppProviders = ({ children }: PropsWithChildren) => {
  // Initialize REST offline queue processing once
  initRestQueueProcessor({
    apiClient,
    onProcessed: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.farms.all }).catch(() => undefined);
      queryClient.invalidateQueries({ queryKey: queryKeys.collections?.all as unknown as import('@tanstack/react-query').QueryKey }).catch(() => undefined);
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              {Platform.OS !== 'web' ? (
                <SQLiteWrapper>
                  <OfflineProvider>
                    <CaptureProvider>
                      <NavigationLayer>{children}</NavigationLayer>
                    </CaptureProvider>
                    {/* Bootstraps background sync manager */}
                    <SyncBootstrap />
                  </OfflineProvider>
                </SQLiteWrapper>
              ) : (
                <OfflineProvider>
                  <CaptureProvider>
                    <NavigationLayer>{children}</NavigationLayer>
                  </CaptureProvider>
                  {/* Bootstraps background sync manager */}
                  <SyncBootstrap />
                </OfflineProvider>
              )}
            </ToastProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
