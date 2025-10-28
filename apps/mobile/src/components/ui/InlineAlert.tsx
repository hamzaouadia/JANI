import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type AlertKind = 'info' | 'success' | 'warning' | 'error';

type InlineAlertProps = PropsWithChildren<{
  kind?: AlertKind;
}>;

export const InlineAlert = ({ kind = 'info', children }: InlineAlertProps) => {
  const theme = useAppTheme();

  const colorMap: Record<AlertKind, string> = {
    info: theme.colors.secondary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error
  };

  const color = colorMap[kind];

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: `${color}20`,
          borderColor: `${color}55`
        }
      ]}
    >
      <Text style={[styles.label, { color }]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  label: {
    fontWeight: '600'
  }
});