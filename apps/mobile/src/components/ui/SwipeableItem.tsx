import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, PanResponder } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/utils/haptics';

export interface SwipeAction {
  icon: string;
  label: string;
  backgroundColor: string;
  onPress: () => void;
}

interface SwipeableItemProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const SWIPE_THRESHOLD = 80;
const ACTION_WIDTH = 80;

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeStart,
  onSwipeEnd,
}) => {
  const theme = useAppTheme();
  const pan = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);
  const hasTriggeredHaptic = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        onSwipeStart?.();
        hasTriggeredHaptic.current = false;
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = lastOffset.current + gestureState.dx;
        
        // Limit swipe distance
        const maxLeft = leftActions.length * ACTION_WIDTH;
        const maxRight = -rightActions.length * ACTION_WIDTH;
        const clampedValue = Math.max(maxRight, Math.min(maxLeft, newValue));
        
        pan.setValue(clampedValue);

        // Haptic feedback at threshold
        if (!hasTriggeredHaptic.current && Math.abs(clampedValue) > SWIPE_THRESHOLD) {
          haptic.light();
          hasTriggeredHaptic.current = true;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const finalOffset = lastOffset.current + gestureState.dx;
        
        // Snap to action or back to center
        let snapTo = 0;
        
        if (finalOffset > SWIPE_THRESHOLD && leftActions.length > 0) {
          snapTo = leftActions.length * ACTION_WIDTH;
        } else if (finalOffset < -SWIPE_THRESHOLD && rightActions.length > 0) {
          snapTo = -rightActions.length * ACTION_WIDTH;
        }

        Animated.spring(pan, {
          toValue: snapTo,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }).start();

        lastOffset.current = snapTo;
        onSwipeEnd?.();
      },
    })
  ).current;

  const handleActionPress = (action: SwipeAction) => {
    haptic.medium();
    
    // Animate back to center
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    lastOffset.current = 0;

    action.onPress();
  };

  const renderActions = (actions: SwipeAction[]) => {
    return actions.map((action, index) => (
      <Pressable
        key={index}
        onPress={() => handleActionPress(action)}
        style={[
          styles.action,
          {
            backgroundColor: action.backgroundColor,
            width: ACTION_WIDTH,
          },
        ]}
      >
        <Text style={styles.actionIcon}>{action.icon}</Text>
        <Text style={styles.actionLabel}>{action.label}</Text>
      </Pressable>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <View style={[styles.actionsContainer, styles.leftActions]}>
          {renderActions(leftActions)}
        </View>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <View style={[styles.actionsContainer, styles.rightActions]}>
          {renderActions(rightActions)}
        </View>
      )}

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX: pan }],
            backgroundColor: theme.colors.surface,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    zIndex: 10,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  leftActions: {
    left: 0,
  },
  rightActions: {
    right: 0,
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  actionIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
