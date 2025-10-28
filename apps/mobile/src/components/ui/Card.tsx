import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme';

type ElevationSize = keyof Theme['shadows'];

export type CardProps = PropsWithChildren<{
  elevated?: boolean | ElevationSize;
  style?: StyleProp<ViewStyle>;
}>;

export const Card = ({ elevated = true, style, children }: CardProps) => {
  const theme = useAppTheme();

  // Determine shadow style based on elevation prop
  const getShadowStyle = () => {
    if (!elevated) return {};
    
    if (typeof elevated === 'string') {
      return theme.shadows[elevated];
    }
    
    return theme.shadows.md; // default
  };

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        },
        getShadowStyle(),
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 16
  }
});
