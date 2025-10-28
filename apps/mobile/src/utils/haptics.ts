import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticFeedbackType = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'selection';

/**
 * Provides haptic feedback across platforms
 * Falls back gracefully on web
 */
export const haptic = {
  // Light tap feedback
  light: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  
  // Medium impact feedback
  medium: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  
  // Heavy impact feedback
  heavy: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  
  // Success feedback
  success: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  
  // Warning feedback
  warning: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  
  // Error feedback
  error: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
  
  // Selection feedback (for pickers, sliders, etc)
  selection: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.selectionAsync();
  },
  
  // Generic trigger
  trigger: async (type: HapticFeedbackType) => {
    await haptic[type]();
  },
};

/**
 * Hook for haptic feedback in components
 */
export const useHaptics = () => {
  return {
    light: haptic.light,
    medium: haptic.medium,
    heavy: haptic.heavy,
    success: haptic.success,
    warning: haptic.warning,
    error: haptic.error,
    selection: haptic.selection,
    trigger: haptic.trigger,
  };
};
