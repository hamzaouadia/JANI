import { Fragment, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTraceabilityFlow } from '@/constants/traceability';
import type { TraceabilityFlow } from '@/constants/traceability';
import { ROLE_CONFIG, type UserRole } from '@/constants/userRoles';
import { ROLE_JOURNEY_NAVIGATION, type JourneyAction } from '@/features/dashboard/constants/roleJourneyNavigation';
import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { useAuthStore } from '@/stores/authStore';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { JourneyStackParamList } from '@/navigation/types';

type NavigateHandler = (_route: string, _params?: Record<string, unknown>) => void;

export const JourneyScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<JourneyStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const userRole = (user?.role ?? 'farm') as UserRole;

  const flow = useMemo<TraceabilityFlow | null>(() => {
    if (!user) {
      return null;
    }

    return getTraceabilityFlow(userRole);
  }, [user, userRole]);

  const stageActions = useMemo<Record<string, JourneyAction[]>>(() => {
    if (!user) {
      return {};
    }

    return ROLE_JOURNEY_NAVIGATION[userRole] ?? {};
  }, [user, userRole]);

  const handleNavigate = (action: JourneyAction) => {
    const nav = navigation as unknown as { navigate: NavigateHandler };
    if (action.params) {
      nav.navigate(action.target as string, action.params as Record<string, unknown>);
      return;
    }

    nav.navigate(action.target as string);
  };

  if (!user || !flow) {
    return (
      <Screen padded={false}>
        <EmptyState
          icon="map"
          title="No journey data yet"
          description="Select a role to see your end-to-end workflow."
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: theme.spacing(5),
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6)
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: theme.colors.primaryMuted, borderColor: `${theme.colors.primary}33` }]}> 
          <Text style={[theme.typography.caption, styles.heroEyebrow, { color: theme.colors.primary }]}>Your traceability journey</Text>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            {ROLE_CONFIG[userRole].label}
          </Text>
          <Text style={[theme.typography.body, styles.heroIntro, { color: theme.colors.textMuted }]}>{flow.intro}
          </Text>
          
          {/* Demo UI Components Button */}
          <Pressable
            style={({ pressed }) => [
              styles.demoButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed ? 0.8 : 1
              }
            ]}
            onPress={() => navigation.navigate('UIComponents')}
          >
            <Text style={[theme.typography.caption, { color: '#FFFFFF', fontWeight: '600' }]}>
              🎨 View UI Components Demo
            </Text>
          </Pressable>
        </View>

        <View style={styles.timeline}>
          {flow.stages.map((stage, index) => {
            const actions = stageActions[stage.id] ?? [];

            return (
              <Fragment key={stage.id}>
                <View style={[styles.stageCard, surface(theme)]}>
                  <View style={styles.stageHeader}> 
                    <View style={[styles.stageIcon, { backgroundColor: `${theme.colors.primary}18` }]}>
                      <Text style={styles.emoji}>{stage.emoji}</Text>
                    </View>
                    <View style={styles.stageHeaderText}>
                      <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>{stage.title}</Text>
                      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Goal: {stage.goal}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stageSteps}> 
                    {stage.steps.map((step) => (
                      <View key={step.title} style={styles.stepBlock}>
                        <Text style={[theme.typography.body, styles.stepTitle, { color: theme.colors.text }]}>
                          {step.title}
                        </Text>
                        {step.actions.map((action, actionIndex) => (
                          <Text
                            key={`${step.title}-${actionIndex}`}
                            style={[theme.typography.caption, styles.stepAction, { color: theme.colors.textMuted }]}
                          >
                            • {action}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>

                  <View style={{ marginTop: 8 }}>
                    <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 6 }]}>Steps</Text>
                    <ProgressStepper
                      steps={stage.steps.map((s) => ({ id: s.title, label: s.title, completed: false }))}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Verification</Text>
                    <VerificationBadge status="pending" />
                  </View>
                  {actions.length ? (
                    <View style={styles.actionsRow}>
                      {actions.map((action) => (
                        <Pressable
                          key={String(action.target)}
                          style={({ pressed }) => [
                            styles.actionButton,
                            {
                              backgroundColor: theme.colors.primary,
                              opacity: pressed ? 0.9 : 1
                            }
                          ]}
                          onPress={() => handleNavigate(action)}
                        >
                          <Text style={[theme.typography.caption, styles.actionLabel]}> {action.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
                {index < flow.stages.length - 1 ? <View style={[styles.connector, { backgroundColor: `${theme.colors.primary}30` }]} /> : null}
              </Fragment>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
};

const surface = (theme: ReturnType<typeof useAppTheme>): ViewStyle => ({
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.border,
  shadowColor: '#1A342720',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 2
});

const styles = StyleSheet.create({
  content: {
    gap: 24
  },
  hero: {
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 28,
    padding: 24
  },
  heroEyebrow: {
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  heroIntro: {
    lineHeight: 22
  },
  timeline: {
    gap: 24
  },
  stageCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 26,
    padding: 22,
    gap: 20
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16
  },
  stageIcon: {
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoji: {
    fontSize: 26,
    lineHeight: 28
  },
  stageHeaderText: {
    flex: 1,
    gap: 4
  },
  stageSteps: {
    gap: 14
  },
  stepBlock: {
    gap: 6
  },
  stepTitle: {
    fontWeight: '600'
  },
  stepAction: {
    lineHeight: 18
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  actionButton: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  actionLabel: {
    color: '#FFFFFF'
  },
  connector: {
    alignSelf: 'center',
    width: 2,
    height: 40,
    borderRadius: 999
  },
  demoButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  }
});
