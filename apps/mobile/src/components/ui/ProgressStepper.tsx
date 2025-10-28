import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

export type ProgressStep = {
  id: string;
  label: string;
  completed?: boolean;
};

export type ProgressStepperProps = {
  steps: ProgressStep[];
};

export const ProgressStepper = ({ steps }: ProgressStepperProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {steps.map((s, idx) => {
        const isLast = idx === steps.length - 1;
        const color = s.completed ? theme.colors.primary : theme.colors.border;
        const textColor = s.completed ? theme.colors.text : theme.colors.textMuted;
        return (
          <View key={s.id} style={styles.item}>
            <View style={[styles.node, { borderColor: color, backgroundColor: s.completed ? theme.colors.primary : 'transparent' }]} />
            {!isLast && <View style={[styles.connector, { backgroundColor: color }]} />}
            <Text style={[styles.label, { color: textColor }]}>{s.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  node: { width: 10, height: 10, borderRadius: 6, borderWidth: 2 },
  connector: { width: 20, height: 2, borderRadius: 1 },
  label: { fontSize: 12, fontWeight: '600' }
});
