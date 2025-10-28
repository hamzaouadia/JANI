import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import type { TraceabilityFlow } from '@/constants/traceability';

type TraceabilityTimelineProps = {
  flow: TraceabilityFlow;
};

export const TraceabilityTimeline = ({ flow }: TraceabilityTimelineProps) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          shadowColor: '#1C342720',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 2
        }
      ]}
    >
      <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Traceability Journey</Text>
      <Text style={[theme.typography.body, styles.intro, { color: theme.colors.textMuted }]}>
        {flow.intro}
      </Text>

      <View style={styles.stages}>
        {flow.stages.map((stage) => (
          <View key={stage.id} style={styles.stageCard}> 
            <View style={styles.stageHeader}>
              <Text style={styles.emoji}>{stage.emoji}</Text>
              <View style={styles.stageHeaderText}>
                <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>
                  {stage.title}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  Goal: {stage.goal}
                </Text>
              </View>
            </View>
            <View style={styles.stepList}> 
              {stage.steps.map((step) => (
                <View key={`${stage.id}-${step.title}`} style={styles.stepItem}> 
                  <Text style={[theme.typography.body, styles.stepTitle, { color: theme.colors.text }]}>
                    {step.title}
                  </Text>
                  {step.actions.map((action, index) => (
                    <Text
                      key={`${stage.id}-${step.title}-${index}`}
                      style={[theme.typography.caption, styles.stepAction, { color: theme.colors.textMuted }]}
                    >
                      • {action}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.summary, { borderTopColor: theme.colors.border }]}> 
        {flow.summary.map((item) => (
          <View key={item.stage} style={styles.summaryRow}> 
            <Text style={[theme.typography.caption, styles.summaryStage, { color: theme.colors.textMuted }]}>
              {item.stage}
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    padding: 22,
    gap: 20
  },
  intro: {
    lineHeight: 20
  },
  stages: {
    gap: 16
  },
  stageCard: {
    gap: 12
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  emoji: {
    fontSize: 28,
    lineHeight: 32
  },
  stageHeaderText: {
    flex: 1,
    gap: 4
  },
  stepList: {
    gap: 12
  },
  stepItem: {
    gap: 6
  },
  stepTitle: {
    fontWeight: '600'
  },
  stepAction: {
    lineHeight: 18
  },
  summary: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 16,
    gap: 12
  },
  summaryRow: {
    gap: 4
  },
  summaryStage: {
    letterSpacing: 0.4,
    textTransform: 'uppercase'
  }
});
