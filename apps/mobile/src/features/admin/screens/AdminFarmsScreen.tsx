import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getFarms } from '@/lib/api';
import type { Farm as ApiFarm } from '@/lib/api/farms';

interface Farm {
  id: string;
  name: string;
  owner: string;
  location: string;
  status: 'verified' | 'pending' | 'suspended';
  sustainabilityScore: number;
  size: string;
  crops: string[];
  certifications: string[];
  lastInspection: string;
}

const mapApiFarmToFarm = (apiFarm: ApiFarm): Farm => {
  const status: Farm['status'] = apiFarm.linked ? 'verified' : 'pending';
  const coverage = apiFarm.summary.totalPlots
    ? apiFarm.summary.linkedPlots / apiFarm.summary.totalPlots
    : 0;
  const sustainabilityScore = Math.round(70 + Math.min(30, coverage * 40));
  const crops = Array.from(new Set(apiFarm.plots.map((plot) => plot.crop)));

  return {
    id: apiFarm.id,
    name: apiFarm.name,
    owner: apiFarm.credentials.registrationId,
    location: apiFarm.locationDescription ?? 'Not specified',
    status,
    sustainabilityScore,
    size: apiFarm.summary.totalHectares ? `${apiFarm.summary.totalHectares} hectares` : 'N/A',
    crops,
    certifications: apiFarm.nextActions ?? [],
    lastInspection: apiFarm.lastSync ? new Date(apiFarm.lastSync).toLocaleDateString() : 'N/A'
  };
};

export const AdminFarmsScreen = () => {
  const theme = useAppTheme();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch farms from API
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiFarms = await getFarms();
        const mappedFarms = apiFarms.map(mapApiFarmToFarm);
        setFarms(mappedFarms);
      } catch (error) {
        console.error('Failed to fetch farms:', error);
        setError('Failed to load farms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
                         farm.owner.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
                         farm.location.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
    const matchesStatus = selectedStatus === 'all' || farm.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'rejected': return theme.colors.error;
      default: return theme.colors.textMuted;
    }
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 85) return theme.colors.success;
    if (score >= 70) return theme.colors.warning;
    return theme.colors.error;
  };

  const farmStats = {
    total: farms.length,
  verified: farms.filter(f => f.status === 'verified').length,
    pending: farms.filter(f => f.status === 'pending').length,
    avgSustainability: farms.length > 0 ? Math.round(farms.reduce((acc, f) => acc + f.sustainabilityScore, 0) / farms.length) : 0
  };

  // Show loading state
  if (loading) {
    return (
      <Screen>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Loading farms...</Text>
        </View>
      </Screen>
    );
  }

  // Show error state
  if (error) {
    return (
      <Screen>
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Error</Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textMuted }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setLoading(true);
              setError(null);
              getFarms().then(apiFarms => {
                setFarms(apiFarms.map(mapApiFarmToFarm));
                setLoading(false);
              }).catch((error) => {
                console.error('Failed to load farms.', error);
                setError('Failed to load farms. Please try again.');
                setLoading(false);
              });
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Farm Management
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
            Monitor farm operations and sustainability
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{farmStats.total}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Total Farms</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>{farmStats.verified}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Verified</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>{farmStats.pending}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{farmStats.avgSustainability}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Avg Score</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersSection}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            placeholder="Search farms..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
            {['all', 'verified', 'pending', 'rejected'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusFilter,
                  {
                    backgroundColor: selectedStatus === status ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.statusFilterText,
                    { color: selectedStatus === status ? '#fff' : theme.colors.text }
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Farms List */}
        <View style={styles.farmsList}>
          {filteredFarms.map((farm) => (
            <View key={farm.id} style={[styles.farmCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.farmHeader}>
                <View style={styles.farmInfo}>
                  <Text style={styles.farmIcon}>🚜</Text>
                  <View style={styles.farmDetails}>
                    <Text style={[styles.farmName, { color: theme.colors.text }]}>{farm.name}</Text>
                    <Text style={[styles.farmOwner, { color: theme.colors.textMuted }]}>{farm.owner}</Text>
                    <Text style={[styles.farmLocation, { color: theme.colors.textMuted }]}>{farm.location}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(farm.status) }]}>
                  <Text style={styles.statusText}>{farm.status}</Text>
                </View>
              </View>
              
              <View style={styles.farmMeta}>
                <View style={styles.farmMetaItem}>
                  <Text style={[styles.farmMetaLabel, { color: theme.colors.textMuted }]}>Size</Text>
                  <Text style={[styles.farmMetaValue, { color: theme.colors.text }]}>{farm.size}</Text>
                </View>
                <View style={styles.farmMetaItem}>
                  <Text style={[styles.farmMetaLabel, { color: theme.colors.textMuted }]}>Sustainability</Text>
                  <Text style={[styles.farmMetaValue, { color: getSustainabilityColor(farm.sustainabilityScore) }]}>
                    {farm.sustainabilityScore}/100
                  </Text>
                </View>
                <View style={styles.farmMetaItem}>
                  <Text style={[styles.farmMetaLabel, { color: theme.colors.textMuted }]}>Last Inspection</Text>
                  <Text style={[styles.farmMetaValue, { color: theme.colors.text }]}>{farm.lastInspection}</Text>
                </View>
              </View>

              <View style={styles.cropsSection}>
                <Text style={[styles.cropsLabel, { color: theme.colors.textMuted }]}>Crops:</Text>
                <View style={styles.cropsContainer}>
                  {farm.crops.map((crop, index) => (
                    <View key={index} style={[styles.cropTag, { backgroundColor: theme.colors.primaryMuted }]}>
                      <Text style={[styles.cropText, { color: theme.colors.primary }]}>{crop}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.certificationsSection}>
                <Text style={[styles.certificationsLabel, { color: theme.colors.textMuted }]}>Certifications:</Text>
                <View style={styles.certificationsContainer}>
                  {farm.certifications.map((cert, index) => (
                    <View key={index} style={[styles.certificationTag, { backgroundColor: theme.colors.success }]}>
                      <Text style={styles.certificationText}>{cert}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.farmActions}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.actionButtonText}>Inspect</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.textMuted }]}>
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {filteredFarms.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚜</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No farms found</Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.textMuted }]}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    width: '25%',
    paddingHorizontal: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  filtersSection: {
    marginBottom: 24,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  statusFilters: {
    flexDirection: 'row',
  },
  statusFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  statusFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  farmsList: {
    gap: 16,
  },
  farmCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  farmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  farmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  farmIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  farmDetails: {
    flex: 1,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  farmOwner: {
    fontSize: 14,
    marginBottom: 2,
  },
  farmLocation: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  farmMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  farmMetaItem: {
    flex: 1,
  },
  farmMetaLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  farmMetaValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  cropsSection: {
    marginBottom: 12,
  },
  cropsLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cropTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cropText: {
    fontSize: 12,
    fontWeight: '500',
  },
  certificationsSection: {
    marginBottom: 16,
  },
  certificationsLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  certificationTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  farmActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});