import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type BadgeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
}>;

export const Badge = ({ tone = 'neutral', children }: BadgeProps) => {
  const theme = useAppTheme();
  const bgMap: Record<BadgeTone, string> = {
    success: `${theme.colors.success}20`,
    warning: `${theme.colors.warning}20`,
    error: `${theme.colors.error}20`,
    info: `${theme.colors.secondary}20`,
    neutral: `${theme.colors.textMuted}20`
  };
  const fgMap: Record<BadgeTone, string> = {
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
    info: theme.colors.secondary,
    neutral: theme.colors.textMuted
  };

  const bg = bgMap[tone];
  const fg = fgMap[tone];

  return (
    <View style={[styles.base, { backgroundColor: bg, borderColor: `${fg}40` }]}> 
      <Text style={[styles.label, { color: fg }]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2
  }
});
