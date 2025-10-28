import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

import { useAppTheme } from '@/theme/ThemeProvider';

export type SheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  snap?: 'quarter' | 'half' | 'full';
}>;

export const Sheet = ({ visible, onClose, children, snap: _snap = 'half' }: SheetProps) => {
  const theme = useAppTheme();
  const translateY = useSharedValue(1000);

  // const target = snap === 'full' ? 0 : snap === 'half' ? 0.4 : 0.7; // portion of screen hidden

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  const open = () => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
  };
  const close = () => {
    translateY.value = withSpring(1000, { damping: 18, stiffness: 220 });
    setTimeout(onClose, 200);
  };

  if (visible) {
    // kick off open animation
    setTimeout(open, 0);
  }

  return visible ? (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} onPress={close} />
      <PanGestureHandler
        onGestureEvent={event => {
          const { translationY } = event.nativeEvent as unknown as PanGestureHandlerEventPayload;
          translateY.value = translationY;
        }}
        onEnded={event => {
          const { translationY } = event.nativeEvent as unknown as PanGestureHandlerEventPayload;
          if (translationY > 120) {
            close();
          } else {
            open();
          }
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(240)}
          exiting={FadeOutDown.duration(200)}
          style={[styles.container, style, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <View style={styles.handle}>
            <View style={[styles.grabber, { backgroundColor: theme.colors.border }]} />
          </View>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingBottom: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.12,
    shadowRadius: 20
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 8
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2
  }
});
