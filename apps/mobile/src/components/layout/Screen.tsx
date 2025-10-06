import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme/ThemeProvider';

type ScreenProps = PropsWithChildren<{ padded?: boolean }>;

export const Screen = ({ children, padded = true }: ScreenProps) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingHorizontal: padded ? theme.spacing(5) : 0,
          paddingTop: padded ? theme.spacing(4) : 0
        }
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
