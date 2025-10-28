import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme, useThemeColorScheme } from '@/theme/ThemeProvider';

import { Button } from './Button';

type EmptyStateProps = PropsWithChildren<{
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}>;

export const EmptyState = ({
  icon = 'search',
  title,
  description,
  actionLabel,
  onActionPress,
  children
}: EmptyStateProps) => {
  const theme = useAppTheme();
  const scheme = useThemeColorScheme();
  const tintAlpha = scheme === 'dark' ? '25' : '15';

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: `${theme.colors.primary}${tintAlpha}` }]}
      >
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[theme.typography.subheading, styles.title, { color: theme.colors.text }]}>{title}</Text>
      {description ? (
        <Text style={[theme.typography.body, styles.desc, { color: theme.colors.textMuted }]}>{description}</Text>
      ) : null}
      {children}
      {actionLabel && onActionPress ? (
        <Button onPress={onActionPress} style={{ marginTop: theme.spacing(3) }}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 12
  },
  desc: {
    marginTop: 8,
    textAlign: 'center'
  }
});