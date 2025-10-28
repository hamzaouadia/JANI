import React from 'react';
import { RefreshControl, ScrollView, type ScrollViewProps } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

interface PullToRefreshProps extends ScrollViewProps {
  onRefresh: () => void | Promise<void>;
  refreshing?: boolean;
  children: React.ReactNode;
}

/**
 * ScrollView with pull-to-refresh functionality
 * Automatically handles loading state and theme colors
 */
export const PullToRefreshView: React.FC<PullToRefreshProps> = ({
  onRefresh,
  refreshing = false,
  children,
  ...scrollViewProps
}) => {
  const theme = useAppTheme();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <ScrollView
      {...scrollViewProps}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || isRefreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary, theme.colors.secondary]}
          progressBackgroundColor={theme.colors.surface}
        />
      }
    >
      {children}
    </ScrollView>
  );
};
