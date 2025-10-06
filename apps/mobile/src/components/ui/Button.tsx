import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type ButtonProps = PropsWithChildren<{
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}>;

export const Button = ({ children, onPress, variant = 'primary' }: ButtonProps) => {
  const theme = useAppTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isPrimary ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.8 : 1
        }
      ]}
    >
      <Text
        style={[
          theme.typography.body,
          styles.label,
          { color: isPrimary ? '#ffffff' : theme.colors.text }
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start'
  },
  label: {
    textAlign: 'center'
  }
});
