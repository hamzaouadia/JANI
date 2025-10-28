import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppTheme } from '@/theme/ThemeProvider';

type ButtonProps = PropsWithChildren<{
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export const Button = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style
}: ButtonProps) => {
  const theme = useAppTheme();
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;
  const textColor = isPrimary ? '#FFFFFF' : theme.colors.primary;

  const pressed = useSharedValue(0);
  const shadowStyle = isPrimary ? theme.shadows.lg : theme.shadows.sm;
  
  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.96 : 1, { duration: 150 }) }],
    shadowOpacity: withTiming(pressed.value ? shadowStyle.shadowOpacity * 0.6 : shadowStyle.shadowOpacity, { duration: 150 })
  }));

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    medium: { paddingVertical: 12, paddingHorizontal: 20 },
    large: { paddingVertical: 16, paddingHorizontal: 24 }
  };

  return (
    <Animated.View
      style={[
        {
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          borderRadius: theme.radii.pill,
          shadowColor: shadowStyle.shadowColor,
          shadowOffset: shadowStyle.shadowOffset,
          shadowRadius: shadowStyle.shadowRadius,
          elevation: shadowStyle.elevation,
          opacity: isDisabled ? 0.7 : 1
        },
        aStyle,
        style as StyleProp<ViewStyle>
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        onPress={onPress}
        onPressIn={() => (pressed.value = 1)}
        onPressOut={() => (pressed.value = 0)}
        disabled={isDisabled}
        android_ripple={{ color: `${theme.colors.primary}30`, borderless: false }}
        style={[styles.base, { borderRadius: theme.radii.pill, overflow: 'hidden' }]}
      >
        {isPrimary ? (
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              styles.gradient,
              sizeStyles[size],
              { borderWidth: 1, borderColor: '#FFFFFF33', borderRadius: theme.radii.pill }
            ]}
          >
            <Content loading={loading} textColor={textColor}>{children}</Content>
          </LinearGradient>
        ) : (
          <View
            style={{
              backgroundColor: 'transparent',
              borderColor: theme.colors.primary,
              borderWidth: isOutline ? 1 : 2,
              borderRadius: theme.radii.pill,
              ...sizeStyles[size],
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Content loading={loading} textColor={textColor}>{children}</Content>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const Content = ({ loading, textColor, children }: PropsWithChildren<{ loading?: boolean; textColor: string }>) => (
  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
    {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.label, { color: textColor }]}>{children}</Text>}
  </View>
);

const styles = StyleSheet.create({
  base: {
    borderWidth: 0
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  }
});
