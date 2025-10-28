import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type Props = PropsWithChildren<{
  emoji: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}>;

export const BigActionCard = ({ emoji, title, subtitle, onPress }: Props) => {
  const theme = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.95 : 1
        }
      ]}
      accessibilityRole="button"
    >
      <View style={[styles.emojiWrap, { backgroundColor: theme.colors.primaryMuted, borderColor: `${theme.colors.primary}33` }]}> 
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.texts}>
        <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[theme.typography.caption, styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#1A342720',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2
  },
  emojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoji: { fontSize: 26 },
  texts: { flex: 1 },
  subtitle: { marginTop: 2 }
});