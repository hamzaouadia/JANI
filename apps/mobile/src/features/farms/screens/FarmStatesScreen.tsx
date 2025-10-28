import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { FarmStateTracker } from '@/components/farm/FarmStateTracker';
import type { FarmStackParamList } from '@/navigation/farms/FarmsNavigator';
import { useLinkedOperationsFarms } from '@/features/farms/hooks/useFarms';
import type { OperationsFarm } from '@/features/farms/api/farmApi';
import type { FarmState, FarmStateProgress, PlotProgress } from '@/constants/farmStates';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { haptic } from '@/utils/haptics';

type PlotProgressWithNext = PlotProgress & {
  nextAction?: string;
  hectares?: number | null;
};

const STAGE_STATE_MAP: Record<string, FarmState> = {
  planning: 'planning',
  preparation: 'planning',
  'land preparation': 'planning',
  planting: 'planting',
  sowing: 'planting',
  germination: 'planting',
  growing: 'growing',
  vegetative: 'growing',
  maintenance: 'growing',
  irrigation: 'growing',
  flowering: 'growing',
  harvesting: 'harvesting',
  harvest: 'harvesting',
  'post harvest': 'completed',
  postharvest: 'completed',
  completed: 'completed',
  dormant: 'completed'
};

const STATUS_STATE_MAP: Record<string, FarmState> = {
  active: 'growing',
  inactive: 'planning',
  dormant: 'completed'
};

const STATE_PROGRESS: Record<FarmState, number> = {
  planning: 12,
  planting: 38,
  growing: 65,
  harvesting: 84,
  completed: 100
};

const STATE_WEIGHTS: Record<FarmState, number> = {
  planning: 1,
  planting: 2,
  growing: 3,
  harvesting: 4,
  completed: 5
};

const toTitleCase = (value?: string | null) => {
  if (!value) return '';
  return value
    .split(/[\s_-]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');
};

const getDaysBetween = (iso?: string | null) => {
  if (!iso) return undefined;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  const diff = Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : 0;
};

const mapStageToState = (stage?: string | null): FarmState => {
  const key = stage?.toLowerCase().trim() ?? '';
  return STAGE_STATE_MAP[key] ?? 'planning';
};

const buildPlotProgress = (farm: OperationsFarm | null): PlotProgressWithNext[] => {
  if (!farm || !Array.isArray(farm.plots) || farm.plots.length === 0) {
    return [];
  }

  return farm.plots.map((plot, index) => {
    const state = mapStageToState(plot.stage);
    return {
      plotId: plot.id ?? `${farm.id}-plot-${index + 1}`,
      plotName: plot.name ?? `Plot ${index + 1}`,
      cropType: plot.crop ?? farm.primaryCrop,
      currentState: state,
      progress: STATE_PROGRESS[state],
      lastActivity: plot.stage ? toTitleCase(plot.stage) : undefined,
      lastActivityDate: plot.lastSync ?? undefined,
      nextAction: plot.nextActions?.[0],
      hectares: plot.hectares ?? null
    };
  });
};

const pickOverallState = (farm: OperationsFarm | null, plots: PlotProgressWithNext[]): FarmState => {
  if (plots.length === 0) {
    const fallback = farm?.status?.toLowerCase() ?? '';
    return STATUS_STATE_MAP[fallback] ?? 'planning';
  }

  const averageWeight =
    plots.reduce((sum, plot) => sum + STATE_WEIGHTS[plot.currentState], 0) / Math.max(plots.length, 1);

  if (averageWeight >= 4.5) return 'completed';
  if (averageWeight >= 3.5) return 'harvesting';
  if (averageWeight >= 2.5) return 'growing';
  if (averageWeight >= 1.5) return 'planting';
  return 'planning';
};

const pickNextAction = (farm: OperationsFarm | null, plots: PlotProgressWithNext[]): string | undefined => {
  if (farm?.nextActions?.length) {
    return farm.nextActions[0];
  }

  const plotAction = plots.find((plot) => Boolean(plot.nextAction))?.nextAction;
  if (plotAction) {
    return plotAction;
  }

  if (farm?.summary?.pendingTasks) {
    const count = farm.summary.pendingTasks;
    return `${count} pending task${count > 1 ? 's' : ''}`;
  }

  return undefined;
};

const computeOverallProgress = (
  farm: OperationsFarm | null,
  plots: PlotProgressWithNext[]
): FarmStateProgress => {
  if (!farm) {
    return {
      state: 'planning',
      progress: 0,
      nextAction: 'Link a farm to view progress',
      daysInState: 0
    };
  }

  const state = pickOverallState(farm, plots);
  const progress = plots.length
    ? Math.round(plots.reduce((sum, plot) => sum + plot.progress, 0) / plots.length)
    : STATE_PROGRESS[state];

  const timelineReference = farm.lastSync ?? plots.find((plot) => plot.lastActivityDate)?.lastActivityDate ?? null;
  const daysInState = getDaysBetween(timelineReference) ?? 0;

  return {
    state,
    progress,
    nextAction: pickNextAction(farm, plots),
    daysInState
  };
};

const formatHectares = (value?: number | null) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  const parsed = Number.parseFloat(String(value));
  return Number.isNaN(parsed) ? undefined : `${parsed.toFixed(1)} ha`;
};

export const FarmStatesScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<FarmStackParamList>>();
  const user = useAuthStore((state) => state.user);

  const ownerIdentifier = user?.identifier ?? null;
  const ownerRole = user?.role ?? null;

  const {
    data: operationsFarms,
    isLoading,
    isError,
    refetch
  } = useLinkedOperationsFarms(ownerIdentifier, ownerRole);

  const linkedFarms = operationsFarms ?? [];
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  useEffect(() => {
    if (!linkedFarms.length) {
      setSelectedFarmId(null);
      return;
    }

    if (!selectedFarmId || !linkedFarms.some((farm) => farm.id === selectedFarmId)) {
      setSelectedFarmId(linkedFarms[0].id);
    }
  }, [linkedFarms, selectedFarmId]);

  const selectedFarm = useMemo<OperationsFarm | null>(
    () => linkedFarms.find((farm) => farm.id === selectedFarmId) ?? null,
    [linkedFarms, selectedFarmId]
  );

  const plotsProgress = useMemo<PlotProgressWithNext[]>(() => buildPlotProgress(selectedFarm), [selectedFarm]);

  const overallProgress = useMemo<FarmStateProgress>(
    () => computeOverallProgress(selectedFarm, plotsProgress),
    [selectedFarm, plotsProgress]
  );

  const handleStatePress = useCallback(
    (state: FarmState) => {
      if (!selectedFarm) return;
      void haptic.light();
      navigation.navigate('FarmStateDetail', { state });
    },
    [navigation, selectedFarm]
  );

  const handleSelectFarm = useCallback((farmId: string) => {
    setSelectedFarmId((prev) => {
      if (prev === farmId) {
        return prev;
      }
      void haptic.light();
      return farmId;
    });
  }, []);

  if (!ownerIdentifier) {
    return (
      <Screen>
        <View style={styles.centeredMessage}>
          <Text style={[styles.centeredMessageText, { color: theme.colors.text }]}>Sign in with a farm account to view linked farm progress.</Text>
        </View>
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.centeredMessage}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingHint, { color: theme.colors.textMuted }]}>Loading linked farms…</Text>
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <View style={styles.centeredMessage}>
          <Text style={[styles.centeredMessageText, { color: theme.colors.error, textAlign: 'center' }]}>We could not load your farm progress. Please check your connection and try again.</Text>
          <Pressable
            onPress={() => refetch()}
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (!linkedFarms.length) {
    return (
      <Screen>
        <View style={styles.centeredMessage}>
          <Text style={[styles.centeredMessageText, { color: theme.colors.text, textAlign: 'center' }]}>No linked farms yet.</Text>
          <Text style={[styles.loadingHint, { color: theme.colors.textMuted, textAlign: 'center', marginTop: 8 }]}>Link a farm from the Farms tab to see progress here.</Text>
          <Pressable
            onPress={() => navigation.navigate('FarmList')}
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.retryButtonText}>Browse Farms</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroHeader}
        >
          <Text style={styles.heroTitle}>🌾 Farm Progress</Text>
          <Text style={styles.heroSubtitle}>Track every linked farm in one place</Text>
        </LinearGradient>

        <View style={styles.contentWrapper}>
          <View style={styles.selectorSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Linked Farms</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectorChips}
            >
              {linkedFarms.map((farm) => {
                const isSelected = farm.id === selectedFarmId;
                return (
                  <Pressable
                    key={farm.id}
                    onPress={() => handleSelectFarm(farm.id)}
                    style={({ pressed }) => [
                      styles.farmChip,
                      {
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                        backgroundColor: isSelected ? `${theme.colors.primary}15` : theme.colors.surface,
                        opacity: pressed ? 0.85 : 1
                      }
                    ]}
                  >
                    <Text style={[styles.farmChipTitle, { color: theme.colors.text }]} numberOfLines={1}>
                      {farm.name}
                    </Text>
                    <Text style={[styles.farmChipMeta, { color: theme.colors.textMuted }]} numberOfLines={1}>
                      Reg ID · {farm.credentials?.registrationId ?? '—'}
                    </Text>
                    <Text style={[styles.farmChipMeta, { color: theme.colors.textMuted }]} numberOfLines={1}>
                      {farm.summary?.totalPlots ?? 0} plots • {farm.summary?.pendingTasks ?? 0} tasks
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Card style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressHeaderTitle, { color: theme.colors.text }]}>
                  {selectedFarm?.name ?? 'Farm Overview'}
                </Text>
                <Text style={[styles.progressHeaderSubtitle, { color: theme.colors.textMuted }]}>
                  {selectedFarm?.primaryCrop ? `Primary crop: ${selectedFarm.primaryCrop}` : 'Linked farm overview'}
                </Text>
              </View>

              <View style={styles.progressStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                    {overallProgress.progress}%
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Overall progress</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.secondary }]}>{plotsProgress.length}</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Tracked plots</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.success }]}>
                    {selectedFarm?.summary?.pendingTasks ?? 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Pending tasks</Text>
                </View>
              </View>

              <View style={styles.trackerWrapper}>
                <FarmStateTracker
                  currentState={overallProgress.state}
                  progress={overallProgress.progress}
                  nextAction={overallProgress.nextAction}
                  daysInState={overallProgress.daysInState}
                  onStatePress={handleStatePress}
                  compact={false}
                  vertical={false}
                />
              </View>

              {overallProgress.daysInState !== undefined && overallProgress.daysInState > 0 && (
                <Text style={[styles.progressHint, { color: theme.colors.textMuted }]}>
                  {`In this state for ${overallProgress.daysInState} day${overallProgress.daysInState === 1 ? '' : 's'}.`}
                </Text>
              )}

              {overallProgress.nextAction && (
                <View style={[styles.nextActionBanner, { backgroundColor: `${theme.colors.primary}08` }]}
                >
                  <Text style={[styles.nextActionLabel, { color: theme.colors.textMuted }]}>Next action</Text>
                  <Text style={[styles.nextActionText, { color: theme.colors.text }]}>{overallProgress.nextAction}</Text>
                </View>
              )}
            </Card>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBadge, { backgroundColor: `${theme.colors.secondary}15` }]}
              >
                <Text style={styles.sectionIcon}>🌱</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Individual Plots</Text>
            </View>

            {plotsProgress.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: theme.colors.text, textAlign: 'center' }]}>No plots linked to this farm yet.</Text>
                <Text style={[styles.emptyStateHint, { color: theme.colors.textMuted, textAlign: 'center' }]}>Connect plots in the operations portal to see per-plot progress.</Text>
              </View>
            ) : (
              plotsProgress.map((plot, index) => (
                <Pressable
                  key={plot.plotId}
                  onPress={() => void haptic.light()}
                  style={({ pressed }) => [
                    styles.plotCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      opacity: pressed ? 0.85 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }]
                    }
                  ]}
                >
                  <View style={styles.plotHeader}>
                    <View style={styles.plotTitleSection}>
                      <View style={[styles.plotNumberBadge, { backgroundColor: theme.colors.primary }]}
                      >
                        <Text style={styles.plotNumber}>{index + 1}</Text>
                      </View>
                      <View style={styles.plotInfo}>
                        <Text style={[styles.plotName, { color: theme.colors.text }]}>{plot.plotName}</Text>
                        <View style={styles.plotMetaRow}>
                          {plot.cropType && (
                            <View style={[styles.cropBadge, { backgroundColor: `${theme.colors.success}15` }]}
                            >
                              <Text style={[styles.cropText, { color: theme.colors.success }]}>{plot.cropType}</Text>
                            </View>
                          )}
                          <View style={[styles.cropBadge, { backgroundColor: `${theme.colors.primary}15` }]}
                          >
                            <Text style={[styles.cropText, { color: theme.colors.primary }]}>Stage: {toTitleCase(plot.currentState)}</Text>
                          </View>
                          {formatHectares(plot.hectares) && (
                            <View style={[styles.cropBadge, { backgroundColor: `${theme.colors.secondary}15` }]}
                            >
                              <Text style={[styles.cropText, { color: theme.colors.secondary }]}>{formatHectares(plot.hectares)}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    <View style={styles.plotMeta}>
                      {plot.lastActivityDate && (
                        <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>Updated {new Date(plot.lastActivityDate).toLocaleDateString()}</Text>
                      )}
                      {plot.nextAction && (
                        <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>Next: {plot.nextAction}</Text>
                      )}
                    </View>
                  </View>

                  <View style={[styles.progressBarContainer, { backgroundColor: `${theme.colors.primary}10` }]}
                  >
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${plot.progress}%`,
                          backgroundColor: theme.colors.primary
                        }
                      ]}
                    />
                    <Text style={[styles.progressBarText, { color: theme.colors.text }]}>{plot.progress}%</Text>
                  </View>

                  <View style={styles.plotTrackerWrapper}>
                    <FarmStateTracker
                      currentState={plot.currentState}
                      progress={plot.progress}
                      onStatePress={handleStatePress}
                      compact
                      vertical={false}
                    />
                  </View>
                </Pressable>
              ))
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBadge, { backgroundColor: `${theme.colors.primary}15` }]}
              >
                <Text style={styles.sectionIcon}>📅</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Detailed Timeline</Text>
            </View>

            <Card style={styles.timelineCard}>
              <FarmStateTracker
                currentState={overallProgress.state}
                progress={overallProgress.progress}
                nextAction={overallProgress.nextAction}
                daysInState={overallProgress.daysInState}
                onStatePress={handleStatePress}
                compact={false}
                vertical
              />
            </Card>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBadge, { backgroundColor: `${theme.colors.success}15` }]}
              >
                <Text style={styles.sectionIcon}>🏡</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Linked Farms</Text>
            </View>

            {linkedFarms.map((farm) => {
              const isSelected = farm.id === selectedFarmId;
              return (
                <Pressable
                  key={farm.id}
                  onPress={() => handleSelectFarm(farm.id)}
                  style={({ pressed }) => [
                    styles.farmCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      opacity: pressed ? 0.85 : 1
                    }
                  ]}
                >
                  <View style={styles.farmContent}>
                    <View style={styles.farmInfo}>
                      <Text style={[styles.farmName, { color: theme.colors.text }]}>{farm.name}</Text>
                      <Text style={[styles.farmLocation, { color: theme.colors.textMuted }]}>
                        {farm.locationDescription ? `📍 ${farm.locationDescription}` : 'Linked account'}
                      </Text>
                      <Text style={[styles.farmLocation, { color: theme.colors.textMuted }]}>Registration: {farm.credentials?.registrationId ?? '—'}</Text>
                    </View>

                    <View style={[styles.farmStatusBadge, { backgroundColor: theme.colors.primaryMuted }]}
                    >
                      <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                      <Text style={[styles.farmStatus, { color: theme.colors.primary }]}>{toTitleCase(farm.status ?? 'active')}</Text>
                    </View>
                  </View>

                  <View style={styles.farmMetaRow}>
                    <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>{farm.summary?.totalPlots ?? 0} total plots</Text>
                    <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>{farm.summary?.pendingTasks ?? 0} tasks open</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingBottom: 24
  },
  heroHeader: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    color: '#fff',
    textAlign: 'center'
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.92)'
  },
  contentWrapper: {
    paddingHorizontal: 16,
    marginTop: -16
  },
  selectorSection: {
    marginTop: 24,
    gap: 12
  },
  selectorChips: {
    paddingVertical: 12,
    gap: 12,
    paddingRight: 16
  },
  farmChip: {
    minWidth: 220,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4
  },
  farmChipTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  farmChipMeta: {
    fontSize: 13
  },
  section: {
    marginTop: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12
  },
  sectionIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionIcon: {
    fontSize: 24
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700'
  },
  progressCard: {
    padding: 20
  },
  progressHeader: {
    marginBottom: 12,
    gap: 4
  },
  progressHeaderTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  progressHeaderSubtitle: {
    fontSize: 14
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500'
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB'
  },
  trackerWrapper: {
    marginVertical: 16
  },
  progressHint: {
    fontSize: 13,
    marginTop: 4
  },
  nextActionBanner: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12
  },
  nextActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  nextActionText: {
    fontSize: 15,
    fontWeight: '600'
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    gap: 8
  },
  emptyStateText: {
    fontSize: 16
  },
  emptyStateHint: {
    fontSize: 14
  },
  plotCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth
  },
  plotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  plotTitleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1
  },
  plotNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plotNumber: {
    color: '#fff',
    fontWeight: '600'
  },
  plotInfo: {
    flex: 1,
    gap: 6
  },
  plotName: {
    fontSize: 16,
    fontWeight: '600'
  },
  plotMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cropBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  cropText: {
    fontSize: 12,
    fontWeight: '600'
  },
  plotMeta: {
    alignItems: 'flex-end',
    gap: 4
  },
  metaText: {
    fontSize: 12
  },
  progressBarContainer: {
    marginTop: 16,
    height: 12,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8
  },
  progressBarText: {
    position: 'absolute',
    right: 12,
    fontSize: 12,
    fontWeight: '600'
  },
  plotTrackerWrapper: {
    marginTop: 12
  },
  timelineCard: {
    padding: 16,
    borderRadius: 16
  },
  farmCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16
  },
  farmContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  farmInfo: {
    flex: 1,
    gap: 4
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600'
  },
  farmLocation: {
    fontSize: 13
  },
  farmStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  farmStatus: {
    fontSize: 12,
    fontWeight: '600'
  },
  farmMetaRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12
  },
  centeredMessageText: {
    fontSize: 16,
    textAlign: 'center'
  },
  loadingHint: {
    fontSize: 14
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
});
