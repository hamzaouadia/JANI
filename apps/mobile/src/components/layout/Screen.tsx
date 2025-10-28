import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SyncBanner } from '@/components/layout/SyncBanner';
import { useAppTheme } from '@/theme/ThemeProvider';

type ScreenProps = PropsWithChildren<{ padded?: boolean }>;

export const Screen = ({ children, padded = true }: ScreenProps) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <SyncBanner />
      <View
        style={{
          flex: 1,
          paddingHorizontal: padded ? theme.spacing(5) : 0,
          paddingTop: padded ? theme.spacing(4) : 0,
          paddingBottom: padded ? theme.spacing(5) : 0
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
