import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { SkeletonLines } from '@/components/ui/Skeleton';
import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';

import { SupplierCard } from '../components/SupplierCard';
import { useFeaturedSuppliers } from '../hooks/useFeaturedSuppliers';

const { height } = Dimensions.get('window');

const HeroSection = () => {
  const theme = useAppTheme();
  
  return (
    <LinearGradient
      colors={[theme.colors.primary + '15', theme.colors.background]}
      style={styles.heroContainer}
    >
      <View style={styles.heroContent}>
        <Text style={[theme.typography.heading, styles.heroTitle, { color: theme.colors.text }]}>
          Welcome to JANI
        </Text>
        <Text style={[theme.typography.subheading, styles.heroSubtitle, { color: theme.colors.primary }]}>
          Your Supply Chain Companion
        </Text>
        <Text style={[theme.typography.body, styles.heroDescription, { color: theme.colors.textMuted }]}>
          Track resources from farm to fork. Connect with trusted suppliers, monitor your supply chain, and build transparency for your artisanal food business.
        </Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={[theme.typography.caption, { color: theme.colors.primary, fontWeight: '600' }]}>🏪</Text>
            <Text style={[theme.typography.caption, styles.featureText, { color: theme.colors.textMuted }]}>
              Discover vetted suppliers
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={[theme.typography.caption, { color: theme.colors.primary, fontWeight: '600' }]}>📊</Text>
            <Text style={[theme.typography.caption, styles.featureText, { color: theme.colors.textMuted }]}>
              Real-time tracking
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={[theme.typography.caption, { color: theme.colors.primary, fontWeight: '600' }]}>🤝</Text>
            <Text style={[theme.typography.caption, styles.featureText, { color: theme.colors.textMuted }]}>
              Build trust & transparency
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export const HomeScreen = () => {
  const theme = useAppTheme();
  const { data, isLoading, refetch, isRefetching } = useFeaturedSuppliers();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const suppliers = data ?? [];
    if (!query.trim()) return suppliers;
    const q = query.toLowerCase();
    return suppliers.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        ListHeaderComponent={
          <View>
            <HeroSection />
            <View style={styles.header}>
              <Text style={[theme.typography.heading, styles.title, { color: theme.colors.text }]}>
                Discover trusted suppliers
              </Text>
              <Text
                style={[theme.typography.body, styles.subtitle, { color: theme.colors.textMuted }]}
              >
                Curated for artisanal food producers working with JANI.
              </Text>
              <SearchBar placeholder="Search by name, category, or country" onChangeText={setQuery} />
              <View style={styles.headerRow}>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  {filtered.length} result{filtered.length === 1 ? '' : 's'}
                </Text>
                <Button onPress={refetch}>Refresh</Button>
              </View>
            </View>
          </View>
        }
        renderItem={({ item, index }) => <SupplierCard supplier={item} index={index} />}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loaderContainer}>
              <SkeletonLines lines={5} />
            </View>
          ) : query.trim().length > 0 ? (
            <EmptyState
              icon="search"
              title="No suppliers match your search"
              description="Try a different keyword or clear the search."
              actionLabel="Clear search"
              onActionPress={() => setQuery('')}
            />
          ) : (
            <EmptyState
              icon="storefront"
              title="No suppliers yet"
              description="Pull to refresh or try again."
              actionLabel="Retry"
              onActionPress={refetch}
            />
          )
        }
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.primary}
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
          />
        }
        contentContainerStyle={styles.contentContainer}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  contentContainer: {
    paddingBottom: 48
  },
  heroContainer: {
    minHeight: height * 0.4,
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: 24
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700'
  },
  heroSubtitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600'
  },
  heroDescription: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16
  },
  featuresList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8
  },
  featureText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 16
  },
  headerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    marginBottom: 12
  },
  subtitle: {
    marginBottom: 16
  },
  loaderContainer: {
    paddingVertical: 16
  }
});
