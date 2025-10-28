import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Pressable, Modal, Dimensions, Platform } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/utils/haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
  onClose?: () => void;
  enablePanDownToClose?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      snapPoints = [0.5, 0.9],
      initialSnap = 0,
      onClose,
      enablePanDownToClose = true,
      style,
    },
    ref
  ) => {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const [isVisible, setIsVisible] = React.useState(false);
    
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const backdropOpacity = useSharedValue(0);

    const snapPointsPixels = snapPoints.map((point) => -SCREEN_HEIGHT * point);

    const open = useCallback(() => {
      setIsVisible(true);
      translateY.value = withSpring(snapPointsPixels[initialSnap], {
        damping: 50,
      });
      backdropOpacity.value = withTiming(1, { duration: 250 });
      haptic.light();
    }, [snapPointsPixels, initialSnap]);

    const close = useCallback(() => {
      translateY.value = withTiming(0, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(setIsVisible)(false);
      });
      onClose?.();
      haptic.light();
    }, [onClose]);

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const gestureHandler = useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      { startY: number }
    >({
      onStart: (_event, context) => {
        context.startY = translateY.value;
        active.value = true;
      },
      onActive: (event, context) => {
        const newY = context.startY + event.nativeEvent.translationY;
        // Prevent dragging beyond top snap point
        if (newY <= MAX_TRANSLATE_Y) {
          translateY.value = MAX_TRANSLATE_Y;
        } else {
          translateY.value = newY;
        }
      },
      onEnd: event => {
        active.value = false;
        
        // Close if swiped down fast or past threshold
        if (enablePanDownToClose && (event.nativeEvent.velocityY > 500 || translateY.value > -100)) {
          runOnJS(close)();
          return;
        }

        // Snap to nearest snap point
        const snapTo = snapPointsPixels.reduce((prev, curr) => {
          return Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value)
            ? curr
            : prev;
        });

        translateY.value = withSpring(snapTo, {
          damping: 50,
        });
      },
    });

    const rBottomSheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const rBackdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    return (
      <Modal
        visible={isVisible}
        animationType="none"
        transparent
        statusBarTranslucent
      >
        <View style={styles.container}>
          {/* Backdrop */}
          <Animated.View style={[styles.backdrop, rBackdropStyle]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          </Animated.View>

          {/* Bottom Sheet */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
              style={[
                styles.bottomSheet,
                {
                  backgroundColor: theme.colors.background,
                  paddingBottom: insets.bottom,
                },
                rBottomSheetStyle,
                style,
              ]}
            >
              {/* Handle */}
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
              </View>

              {/* Content */}
              {children}
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
