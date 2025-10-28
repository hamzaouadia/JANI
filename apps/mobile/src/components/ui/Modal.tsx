import type { PropsWithChildren } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, withTiming } from 'react-native-reanimated';

import { useAppTheme } from '@/theme/ThemeProvider';

export type ModalProps = PropsWithChildren<{
  visible: boolean;
  onRequestClose: () => void;
}>;

export const Modal = ({ visible, onRequestClose, children }: ModalProps) => {
  const theme = useAppTheme();
  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={onRequestClose}>
      <Pressable style={styles.backdrop} onPress={onRequestClose}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(180)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        />
      </Pressable>
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(180)}
          style={{
            minWidth: 320,
            marginHorizontal: 24,
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.border,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            transform: [{ scale: withTiming(visible ? 1 : 0.96, { duration: 180 }) }]
          }}
        >
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
