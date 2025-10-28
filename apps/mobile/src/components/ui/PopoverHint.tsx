import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type PopoverHintProps = PropsWithChildren<{
  title: string;
  tips?: string[];
  triggerLabel?: string;
}>;

export const PopoverHint = ({ title, tips = [] as string[], triggerLabel = 'Help', children }: PopoverHintProps) => {
  const theme = useAppTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${triggerLabel}: ${title}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: '#12271C20',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 2,
            transform: [{ scale: pressed ? 0.98 : 1 }]
          }
        ]}
      >
        <Text style={[theme.typography.caption, { color: theme.colors.text }]}>?</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }
            ]}
          >
            <Text style={[theme.typography.subheading, styles.title, { color: theme.colors.text }]}>
              {title}
            </Text>
            {tips.length > 0 ? (
              <View style={styles.tips}>
                {tips.map((tip, idx) => (
                  <View key={idx} style={styles.tipRow}>
                    <Text style={[styles.bullet, { color: theme.colors.textMuted }]}>•</Text>
                    <Text style={[theme.typography.body, { color: theme.colors.text }]}>{tip}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            {children}
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              style={({ pressed }) => [
                styles.close,
                {
                  backgroundColor: theme.colors.primary,
                  borderColor: 'transparent',
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.16,
                  shadowRadius: 12,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              <Text style={[theme.typography.body, { color: '#FFFFFF' }]}>Got it</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start'
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  sheet: {
    width: '100%',
    maxWidth: 520,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 18,
    gap: 12
  },
  title: {
    marginBottom: 4
  },
  tips: {
    gap: 10
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8
  },
  bullet: {
    lineHeight: 20
  },
  close: {
    alignSelf: 'flex-end',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16
  }
});
