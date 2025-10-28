import { StyleSheet, Text, View } from 'react-native';

import { useOffline } from '@/providers/OfflineProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export const SyncBanner = () => {
  const theme = useAppTheme();
  const { isOnline, pendingCount } = useOffline();

  if (isOnline && pendingCount === 0) {
    return null;
  }

  const backgroundColor = isOnline ? `${theme.colors.primary}20` : `${theme.colors.warning}30`;
  const textColor = isOnline ? theme.colors.primary : theme.colors.warning;
  const statusText = isOnline
    ? pendingCount === 1
      ? '1 item waiting to sync'
      : `${pendingCount} items waiting to sync`
    : 'Offline mode – data will sync when connected';

  return (
    <View style={[styles.container, { backgroundColor, borderBottomColor: theme.colors.border }]}> 
      <Text style={[theme.typography.caption, styles.label, { color: textColor }]}>⏳ {statusText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  label: {
    textAlign: 'center'
  }
});
