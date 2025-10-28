import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

export type VerificationStatus = 'verified' | 'pending' | 'flagged' | 'optional' | 'error';

export const VerificationBadge = ({ status }: { status: VerificationStatus }) => {
  const theme = useAppTheme();
  const map = {
    verified: { bg: `${theme.colors.success}20`, fg: theme.colors.success, label: 'Verified' },
    pending: { bg: `${theme.colors.warning}20`, fg: theme.colors.warning, label: 'Pending' },
    flagged: { bg: `${theme.colors.error}20`, fg: theme.colors.error, label: 'Flagged' },
    optional: { bg: `${theme.colors.textMuted}20`, fg: theme.colors.textMuted, label: 'Optional' },
    error: { bg: `${theme.colors.error}20`, fg: theme.colors.error, label: 'Error' }
  } as const;
  const s = map[status];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.fg }]}> 
      <Text style={[styles.text, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  text: {
    fontWeight: '600',
    fontSize: 12
  }
});
