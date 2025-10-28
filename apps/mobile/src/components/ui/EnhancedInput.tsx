import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, type TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/utils/haptics';

interface EnhancedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  variant?: 'outline' | 'filled';
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outline',
  ...textInputProps
}) => {
  const theme = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
    haptic.selection();
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
  };

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : theme.colors.border,
    borderWidth: isFocused ? 2 : 1,
  }));

  const animatedLabelStyle = useAnimatedStyle(() => ({
    color: error
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : theme.colors.textMuted,
  }));

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Animated.Text style={[styles.label, animatedLabelStyle]}>
          {label}
        </Animated.Text>
      )}

      {/* Input Container */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor:
              variant === 'filled' ? theme.colors.surface : 'transparent',
          },
          animatedBorderStyle,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Text style={[styles.icon, { color: theme.colors.textMuted }]}>
              {leftIcon}
            </Text>
          </View>
        )}

        {/* Text Input */}
        <TextInput
          {...textInputProps}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              flex: 1,
            },
            textInputProps.style,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Right Icon */}
        {rightIcon && (
          <Pressable
            onPress={() => {
              haptic.light();
              onRightIconPress?.();
            }}
            style={styles.iconContainer}
            hitSlop={8}
          >
            <Text style={[styles.icon, { color: theme.colors.textMuted }]}>
              {rightIcon}
            </Text>
          </Pressable>
        )}
      </Animated.View>

      {/* Helper Text / Error */}
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.colors.error : theme.colors.textMuted,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    padding: 4,
  },
  icon: {
    fontSize: 20,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
