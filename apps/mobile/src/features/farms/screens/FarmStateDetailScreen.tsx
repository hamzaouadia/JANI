import { ScrollView, View, Text, Alert, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/theme/ThemeProvider';
import { FARM_STATE_CONFIG } from '@/constants/farmStates';
import type { FarmState } from '@/constants/farmStates';
import { haptic } from '@/utils/haptics';
import type { FarmStackParamList } from '@/navigation/farms/FarmsNavigator';

type Props = NativeStackScreenProps<FarmStackParamList, 'FarmStateDetail'>;

export const FarmStateDetailScreen = ({ route }: Props) => {
  const { state } = route.params;
  const theme = useAppTheme();
  
  const stateInfo = FARM_STATE_CONFIG[state];
  
  if (!stateInfo) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.error }}>State not found</Text>
        </View>
      </Screen>
    );
  }

  const handleRecordActivity = () => {
    void haptic.light();
    Alert.alert(
      'Record Activity',
      `Record an activity for ${stateInfo.title} stage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Record', 
          onPress: () => {
            void haptic.success();
            // TODO: Navigate to activity recording screen
            console.log('Recording activity for state:', state);
          }
        }
      ]
    );
  };

  const handleViewGuidelines = () => {
    void haptic.light();
    Alert.alert(
      'Guidelines',
      `Best practices for ${stateInfo.title}:\n\n${stateInfo.description}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <Screen>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Hero Header with Gradient */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroHeader}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.heroIcon}>🌾</Text>
          </View>
          <Text style={styles.heroTitle}>{stateInfo.title}</Text>
          <Text style={styles.heroSubtitle}>{stateInfo.description}</Text>
          
          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Stage Progress</Text>
              <Text style={styles.progressValue}>0%</Text>
            </View>
            <View style={styles.progressBarOuter}>
              <View style={[styles.progressBarInner, { width: '0%' }]} />
            </View>
            <Text style={styles.stageInfo}>Current Stage: {stateInfo.title}</Text>
          </View>
        </LinearGradient>

        <View style={styles.contentWrapper}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚡</Text>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Quick Actions
              </Text>
            </View>

            <View style={styles.actionsGrid}>
              <Pressable
                onPress={handleRecordActivity}
                style={({ pressed }: { pressed: boolean }) => [
                  styles.actionButton,
                  styles.primaryAction,
                  {
                    backgroundColor: theme.colors.primary,
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  }
                ]}
              >
                <View style={styles.actionIconBadge}>
                  <Text style={styles.actionIcon}>📝</Text>
                </View>
                <Text style={styles.actionLabel}>Record Activity</Text>
                <Text style={styles.actionSubtext}>Log your work</Text>
              </Pressable>

              <Pressable
                onPress={handleViewGuidelines}
                style={({ pressed }: { pressed: boolean }) => [
                  styles.actionButton,
                  styles.secondaryAction,
                  {
                    backgroundColor: theme.colors.surface,
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  }
                ]}
              >
                <View style={[styles.actionIconBadge, { backgroundColor: `${theme.colors.secondary}20` }]}>
                  <Text style={styles.actionIcon}>📖</Text>
                </View>
                <Text style={[styles.actionLabel, { color: theme.colors.text }]}>View Guidelines</Text>
                <Text style={[styles.actionSubtext, { color: theme.colors.textMuted }]}>Best practices</Text>
              </Pressable>
            </View>
          </View>

          {/* State Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>ℹ️</Text>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                State Information
              </Text>
            </View>

            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>Stage</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
                    {stateInfo.title}
                  </Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>Actions</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                    {stateInfo.primaryActions.length}
                  </Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${theme.colors.success}20` }]}>
                    <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                    <Text style={[styles.statusText, { color: theme.colors.success }]}>Active</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* Typical Tasks */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✓</Text>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Typical Tasks
              </Text>
            </View>

            <Card style={styles.tasksCard}>
              {getTypicalTasks(state).map((task, index) => (
                <View key={index} style={[
                  styles.taskItem,
                  index !== getTypicalTasks(state).length - 1 && styles.taskItemBorder
                ]}>
                  <View style={[styles.taskCheckbox, { borderColor: theme.colors.primary }]}>
                    <View style={[styles.taskCheckboxInner, { backgroundColor: theme.colors.primary }]} />
                  </View>
                  <Text style={[styles.taskText, { color: theme.colors.text }]}>
                    {task}
                  </Text>
                </View>
              ))}
            </Card>
          </View>

          {/* Tips & Best Practices */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💡</Text>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Tips & Best Practices
              </Text>
            </View>

            {getTips(state).map((tip, index) => (
              <Card key={index} style={styles.tipCard}>
                <View style={styles.tipContent}>
                  <View style={[styles.tipIconBadge, { backgroundColor: `${theme.colors.warning}15` }]}>
                    <Text style={styles.tipIcon}>💡</Text>
                  </View>
                  <Text style={[styles.tipText, { color: theme.colors.text }]}>
                    {tip}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  heroHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: 56,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressSection: {
    marginTop: 24,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
  },
  progressBarOuter: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  stageInfo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  contentWrapper: {
    paddingHorizontal: 16,
    marginTop: -16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryAction: {
    // backgroundColor set dynamically
  },
  secondaryAction: {
    // backgroundColor set dynamically
  },
  actionIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  infoCard: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tasksCard: {
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  taskItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  taskCheckboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  tipCard: {
    padding: 16,
    marginBottom: 12,
  },
  tipContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});

// Helper functions for content
function getTypicalTasks(state: FarmState): string[] {
  const tasks: Record<FarmState, string[]> = {
    planning: [
      'Soil testing and analysis',
      'Crop selection based on season and market demand',
      'Resource planning (seeds, fertilizers, tools)',
      'Budget preparation',
      'Plot layout design',
    ],
    planting: [
      'Land preparation and tilling',
      'Seed sowing or transplanting',
      'Initial watering',
      'Marking plot boundaries',
      'Recording planting date and GPS coordinates',
    ],
    growing: [
      'Regular watering and irrigation',
      'Fertilizer application',
      'Pest and disease monitoring',
      'Weeding and maintenance',
      'Growth progress documentation',
    ],
    harvesting: [
      'Crop maturity assessment',
      'Harvesting at optimal time',
      'Quality inspection',
      'Quantity measurement',
      'Post-harvest handling',
    ],
    completed: [
      'Cleaning and sorting',
      'Grading by quality standards',
      'Processing and packaging',
      'Quality control checks',
      'Batch labeling and distribution',
    ],
  };
  
  return tasks[state] || [];
}

function getTips(state: FarmState): string[] {
  const tips: Record<FarmState, string[]> = {
    planning: [
      'Consider crop rotation to maintain soil health',
      'Check weather forecasts for optimal planting windows',
      'Plan for water availability and irrigation needs',
    ],
    planting: [
      'Plant during cooler parts of the day',
      'Ensure proper seed depth and spacing',
      'Take photos for traceability records',
    ],
    growing: [
      'Monitor for early signs of pests or disease',
      'Keep detailed records of all inputs used',
      'Adjust watering based on weather conditions',
    ],
    harvesting: [
      'Harvest during dry weather when possible',
      'Handle produce carefully to avoid damage',
      'Document harvest dates and quantities accurately',
    ],
    completed: [
      'Maintain clean and sanitary conditions',
      'Process promptly to preserve quality',
      'Keep detailed records for traceability',
    ],
  };
  
  return tips[state] || [];
}
