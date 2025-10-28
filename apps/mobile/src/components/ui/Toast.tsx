import React, { createContext, useContext, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/utils/haptics';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextValue {
  show: (_message: string, _type?: ToastType, _duration?: number) => void;
  showWithAction: (_message: string, _type: ToastType, _action: Toast['action']) => void;
  hide: (_id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        hide(id);
      }, duration);
    }

    // Haptic feedback
    if (type === 'success') {
      haptic.success();
    } else if (type === 'error') {
      haptic.error();
    } else if (type === 'warning') {
      haptic.warning();
    } else {
      haptic.light();
    }
  }, []);

  const showWithAction = useCallback((
    message: string,
    type: ToastType,
    action: Toast['action']
  ) => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, action, duration: 0 };
    setToasts((prev) => [...prev, toast]);
  }, []);

  const hide = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, showWithAction, hide }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hide} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (_id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="box-none">
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          onDismiss={onDismiss}
        />
      ))}
    </View>
  );
};

interface ToastItemProps {
  toast: Toast;
  index: number;
  onDismiss: (_id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, index, onDismiss }) => {
  const theme = useAppTheme();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withSpring(index * 70, { damping: 15 });
    opacity.value = withTiming(1, { duration: 250 });
  }, [index]);

  const dismiss = () => {
    translateY.value = withTiming(-100, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onDismiss)(toast.id);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const typeConfig = {
    success: {
      icon: '✓',
      colors: [theme.colors.success || '#10B981', '#059669'],
    },
    error: {
      icon: '✕',
      colors: [theme.colors.error || '#EF4444', '#DC2626'],
    },
    warning: {
      icon: '⚠',
      colors: [theme.colors.warning || '#F59E0B', '#D97706'],
    },
    info: {
      icon: 'ⓘ',
      colors: [theme.colors.primary, theme.colors.secondary],
    },
  };

  const config = typeConfig[toast.type];

  return (
    <Animated.View style={[styles.toast, animatedStyle]}>
      <View style={[styles.toastContent, { backgroundColor: config.colors[0] }]}>
        <View style={styles.toastMain}>
          <Text style={styles.toastIcon}>{config.icon}</Text>
          <Text style={styles.toastMessage} numberOfLines={2}>
            {toast.message}
          </Text>
          <Pressable onPress={dismiss} hitSlop={8}>
            <Text style={styles.closeIcon}>×</Text>
          </Pressable>
        </View>
        
        {toast.action && (
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              toast.action?.onPress();
              dismiss();
            }}
          >
            <Text style={styles.actionLabel}>{toast.action.label}</Text>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toast: {
    position: 'absolute',
    width: '90%',
    maxWidth: 400,
  },
  toastContent: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  toastMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toastIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  toastMessage: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  closeIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  actionButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
