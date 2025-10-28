import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme/ThemeProvider';
import { FARM_STATE_CONFIG } from '@/constants/farmStates';
import type { FarmState } from '@/constants/farmStates';

type FarmStateTrackerProps = {
  currentState: FarmState;
  progress: number; // 0-100
  nextAction?: string;
  daysInState?: number;
  onStatePress?: (_state: FarmState) => void;
  compact?: boolean;
  vertical?: boolean;
};

const FARM_STATES: FarmState[] = ['planning', 'planting', 'growing', 'harvesting', 'completed'];

export const FarmStateTracker = ({ 
  currentState, 
  progress, 
  nextAction,
  daysInState,
  onStatePress,
  compact = false,
  vertical = false
}: FarmStateTrackerProps) => {
  const theme = useAppTheme();
  const currentStateIndex = FARM_STATES.indexOf(currentState);
  
  const progressAnimation = useSharedValue(progress);
  React.useEffect(() => {
    progressAnimation.value = withTiming(progress, { duration: 1000 });
  }, [progress, progressAnimation]);

  // Pre-calculate animated styles to avoid hooks in render functions
  const animatedProgressStyle = useAnimatedStyle(() => {
    const width = interpolate(progressAnimation.value, [0, 100], [0, 100]);
    return {
      width: `${width}%`,
    };
  });

  const renderStateItem = (state: FarmState, index: number) => {
    const config = FARM_STATE_CONFIG[state];
    const isActive = index === currentStateIndex;
    const isCompleted = index < currentStateIndex;
    const isUpcoming = index > currentStateIndex;

    const getStateColor = () => {
      if (isCompleted) return theme.colors.success;
      if (isActive) return config.color;
      return theme.colors.textMuted;
    };

    if (vertical) {
      const stateColor = getStateColor();
      const verticalIconStyle: ViewStyle = {
        backgroundColor: stateColor + '20',
        borderColor: stateColor,
        borderWidth: isActive ? 3 : 2,
        transform: [{ scale: isActive ? 1.05 : 1 }],
      };

      return (
        <Pressable
          key={state}
          onPress={() => onStatePress?.(state)}
          style={styles.verticalStateItem}
          disabled={!onStatePress}
        >
          <View style={styles.verticalStateContent}>
            {/* State Icon */}
            <View
              style={[
                styles.verticalStateIcon,
                verticalIconStyle,
              ]}
            >
              <Ionicons 
                name={isCompleted ? 'checkmark-circle' : config.icon as any} 
                size={compact ? 16 : 20} 
                color={getStateColor()} 
              />
            </View>
            
            {/* State Info */}
            <View style={styles.verticalStateInfo}>
              <Text
                style={[
                  styles.verticalStateTitle,
                  theme.typography.subheading,
                  {
                    color: getStateColor(),
                    fontWeight: isActive ? '700' : '600',
                    opacity: isUpcoming ? 0.6 : 1,
                  },
                ]}
              >
                {config.title}
              </Text>
              
              {!compact && (
                <Text
                  style={[
                    styles.verticalStateDescription,
                    theme.typography.caption,
                    {
                      color: theme.colors.textMuted,
                      opacity: isUpcoming ? 0.5 : 0.8,
                    },
                  ]}
                >
                  {config.description}
                </Text>
              )}
              
              {/* Progress indicator for active state */}
              {isActive && (
                <View style={styles.verticalProgressContainer}>
                  <View style={[styles.verticalProgressTrack, { backgroundColor: theme.colors.border }]}>
                    <View
                      style={[
                        styles.verticalProgressFill,
                        {
                          backgroundColor: getStateColor(),
                          width: `${progress}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[theme.typography.caption, { color: getStateColor(), fontSize: 11, fontWeight: '600' }]}>
                    {progress}%
                  </Text>
                </View>
              )}
              
              {/* Show primary actions for active state */}
              {isActive && !compact && (
                <View style={styles.verticalActions}>
                  {config.primaryActions.slice(0, 2).map((action: string, idx: number) => (
                    <Text
                      key={idx}
                      style={[
                        styles.verticalActionItem,
                        theme.typography.caption,
                        { color: getStateColor() }
                      ]}
                    >
                      • {action}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Pressable>
      );
    }

    // Horizontal layout (original)
    return (
      <Pressable
        key={state}
        onPress={() => onStatePress?.(state)}
        style={styles.stateItem}
        disabled={!onStatePress}
      >
        <View style={{ transform: [{ scale: isActive ? 1.1 : 1 }], opacity: isUpcoming ? 0.5 : 1 }}>
          {/* State Icon */}
          <View
            style={[
              styles.stateIcon,
              {
                backgroundColor: getStateColor() + '20',
                borderColor: getStateColor(),
                borderWidth: isActive ? 2 : 1,
              },
            ]}
          >
            <Ionicons 
              name={isCompleted ? 'checkmark-circle' : config.icon as any} 
              size={compact ? 14 : 18} 
              color={getStateColor()} 
            />
          </View>
          
          {/* State Title */}
          {!compact && (
            <Text
              style={[
                styles.stateTitle,
                theme.typography.caption,
                {
                  color: getStateColor(),
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {config.title}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  const renderConnector = (index: number) => {
    if (index === FARM_STATES.length - 1) return null;
    
    const isCompleted = index < currentStateIndex;
    
    if (vertical) {
      return (
        <View
          key={`connector-${index}`}
          style={[
            styles.verticalConnector,
            {
              backgroundColor: isCompleted ? theme.colors.success : theme.colors.border,
            },
          ]}
        />
      );
    }
    
    return (
      <View
        key={`connector-${index}`}
        style={[
          styles.connector,
          {
            backgroundColor: isCompleted ? theme.colors.success : theme.colors.border,
            height: compact ? 2 : 3,
          },
        ]}
      />
    );
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header */}
      {!compact && (
        <View style={styles.header}>
          <View>
            <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>
              Farm Progress
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              {FARM_STATE_CONFIG[currentState].description}
            </Text>
          </View>
          
          {nextAction && (
            <View style={[styles.nextActionBadge, { backgroundColor: theme.colors.primaryMuted }]}>
              <Text style={[theme.typography.caption, { color: theme.colors.primary, fontWeight: '600' }]}>
                Next: {nextAction}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* State Timeline */}
      <View style={vertical ? styles.verticalTimeline : styles.timeline}>
        {FARM_STATES.map((state, index) => (
          <React.Fragment key={state}>
            {renderStateItem(state, index)}
            {renderConnector(index)}
          </React.Fragment>
        ))}
      </View>

      {/* Progress Bar - Only show for horizontal layout */}
      {!vertical && (
        <View style={[styles.progressBarContainer, { marginTop: compact ? 8 : 12 }]}>
        <View style={[styles.progressBarTrack, { backgroundColor: theme.colors.border }]}>
          <Animated.View style={animatedProgressStyle}>
            <LinearGradient
              colors={[FARM_STATE_CONFIG[currentState].color, FARM_STATE_CONFIG[currentState].color + '80']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressBarFill}
            />
          </Animated.View>
        </View>
        
        <View style={styles.progressText}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {progress}% Complete
            {daysInState !== undefined && ` • Day ${daysInState}`}
          </Text>
        </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nextActionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: 120,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stateItem: {
    alignItems: 'center',
    flex: 1,
  },
  stateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stateTitle: {
    textAlign: 'center',
    fontSize: 11,
  },
  connector: {
    flex: 1,
    height: 3,
    marginHorizontal: 8,
    borderRadius: 2,
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 8,
    alignItems: 'center',
  },
  
  // Vertical layout styles
  verticalTimeline: {
    flexDirection: 'column',
    paddingVertical: 8,
  },
  verticalStateItem: {
    width: '100%',
    marginVertical: 4,
  },
  verticalStateContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  verticalStateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  verticalStateInfo: {
    flex: 1,
    paddingRight: 8,
  },
  verticalStateTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  verticalStateDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  verticalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  verticalProgressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  verticalProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  verticalActions: {
    marginTop: 4,
  },
  verticalActionItem: {
    fontSize: 12,
    marginBottom: 2,
    opacity: 0.8,
  },
  verticalConnector: {
    width: 3,
    height: 24,
    marginLeft: 24,
    marginVertical: -4,
    borderRadius: 2,
  },
});
