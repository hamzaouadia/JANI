import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyle, ColorValue, DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/ThemeProvider';

interface ShimmerProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const theme = useAppTheme();
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    const numericWidth = typeof width === 'number' ? width : 200;
    const translateX = interpolate(
      shimmer.value,
      [0, 1],
      [-numericWidth, numericWidth],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  const isDark = theme.colors.background === '#000000' || 
                 theme.colors.background === '#121212';

  const colors: [ColorValue, ColorValue, ColorValue] = isDark
    ? ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
    : ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)'];

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.border,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const ShimmerCard: React.FC = () => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Shimmer width={48} height={48} borderRadius={24} />
        <View style={styles.cardHeaderText}>
          <Shimmer width="60%" height={16} style={{ marginBottom: 8 }} />
          <Shimmer width="40%" height={12} />
        </View>
      </View>
      <Shimmer width="100%" height={100} style={{ marginTop: 16 }} />
      <View style={styles.cardFooter}>
        <Shimmer width={80} height={32} borderRadius={16} />
        <Shimmer width={80} height={32} borderRadius={16} />
      </View>
    </View>
  );
};

export const ShimmerList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
