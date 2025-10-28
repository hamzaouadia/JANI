import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { useState } from 'react';

import { useAppTheme } from '@/theme/ThemeProvider';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
};

export const TextField = ({ label, error, style, onFocus, onBlur, ...props }: TextFieldProps) => {
  const theme = useAppTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={[theme.typography.caption, styles.label, { color: theme.colors.textMuted }]}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        selectionColor={theme.colors.primary}
        cursorColor={theme.colors.primary}
        style={[
          theme.typography.body,
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : focused ? theme.colors.primary : theme.colors.border,
            color: theme.colors.text,
            borderRadius: theme.radii.lg
          },
          theme.shadows.sm,
          style
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {error ? <Text style={[theme.typography.caption, styles.error, { color: theme.colors.error }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  label: {
    marginBottom: 6
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  error: {
    marginTop: 6
  }
});
