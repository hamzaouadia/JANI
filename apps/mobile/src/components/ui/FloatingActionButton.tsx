import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/utils/haptics';

interface FABAction {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

interface FABProps {
  icon?: string;
  onPress?: () => void;
  actions?: FABAction[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  extended?: boolean;
  label?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingActionButton: React.FC<FABProps> = ({
  icon = '+',
  onPress,
  actions = [],
  position = 'bottom-right',
  extended = false,
  label,
}) => {
  const theme = useAppTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const hasActions = actions.length > 0;

  const handlePress = async () => {
    await haptic.medium();
    
    if (hasActions) {
      setIsExpanded(!isExpanded);
      rotation.value = withSpring(isExpanded ? 0 : 45);
    } else if (onPress) {
      onPress();
    }
  };

  const mainButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: withTiming(scale.value, { duration: 150 }) },
    ],
  }));

  const positionStyles = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
    'bottom-center': { bottom: 24, alignSelf: 'center' as const },
  };

  return (
    <View style={[styles.container, positionStyles[position]]}>
      {/* Action Items */}
      {isExpanded && actions.map((action, index) => (
        <ActionItem
          key={index}
          action={action}
          index={index}
          theme={theme}
          onPress={() => {
            action.onPress();
            setIsExpanded(false);
            rotation.value = withSpring(0);
          }}
        />
      ))}

      {/* Main FAB */}
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => {
          scale.value = 0.9;
        }}
        onPressOut={() => {
          scale.value = 1;
        }}
        style={[mainButtonStyle]}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.fab,
            extended && styles.fabExtended,
            theme.shadows.lg,
          ]}
        >
          <Text style={styles.icon}>{icon}</Text>
          {extended && label && (
            <Text style={styles.label}>{label}</Text>
          )}
        </LinearGradient>
      </AnimatedPressable>

      {/* Backdrop */}
      {isExpanded && (
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setIsExpanded(false);
            rotation.value = withSpring(0);
          }}
        />
      )}
    </View>
  );
};

interface ActionItemProps {
  action: FABAction;
  index: number;
  theme: any;
  onPress: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ action, index, theme, onPress }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withSpring(-(70 * (index + 1)), { damping: 15 });
    opacity.value = withTiming(1, { duration: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handlePress = async () => {
    await haptic.light();
    onPress();
  };

  return (
    <Animated.View style={[styles.actionItem, animatedStyle]}>
      <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
        {action.label}
      </Text>
      <Pressable onPress={handlePress}>
        <View
          style={[
            styles.actionButton,
            { backgroundColor: action.color || theme.colors.surface },
            theme.shadows.md,
          ]}
        >
          <Text style={styles.actionIcon}>{action.icon}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fabExtended: {
    width: 'auto',
    paddingHorizontal: 20,
    borderRadius: 28,
  },
  icon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionItem: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 8,
    color: '#fff',
    overflow: 'hidden',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: -1,
  },
});
