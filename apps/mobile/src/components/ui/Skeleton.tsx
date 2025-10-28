import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type Percent = `${number}%`;

type SkeletonProps = {
  style?: StyleProp<ViewStyle>;
  width?: number | Percent;
  height?: number | Percent;
  radius?: number;
};

export const Skeleton = ({ style, width = '100%' as Percent, height = 16, radius }: SkeletonProps) => {
  const theme = useAppTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const opacity = useMemo(() => shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }), [shimmer]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.border,
          opacity,
          width,
          height,
          borderRadius: radius ?? theme.radii.sm
        },
        style
      ]}
    />
  );
};

export const SkeletonLines = ({ lines = 3 }: { lines?: number }) => {
  const theme = useAppTheme();
  return (
    <View>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          height={14}
          width={(idx % 3 === 0 ? '90%' : idx % 3 === 1 ? '70%' : '80%') as Percent}
          style={{ marginBottom: theme.spacing(2) }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden'
  }
});