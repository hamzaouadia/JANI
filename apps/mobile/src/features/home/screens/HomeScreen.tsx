import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';

import { SupplierCard } from '../components/SupplierCard';
import { useFeaturedSuppliers } from '../hooks/useFeaturedSuppliers';

export const HomeScreen = () => {
  const theme = useAppTheme();
  const { data, isLoading, refetch, isRefetching } = useFeaturedSuppliers();

  return (
    <Screen>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[theme.typography.heading, styles.title, { color: theme.colors.text }]}>
              Discover trusted suppliers
            </Text>
            <Text
              style={[theme.typography.body, styles.subtitle, { color: theme.colors.textMuted }]}
            >
              Curated for artisanal food producers working with JANI.
            </Text>
            <Button onPress={refetch}>Refresh list</Button>
          </View>
        }
        renderItem={({ item }) => <SupplierCard supplier={item} />}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : (
            <Text style={[theme.typography.body, { color: theme.colors.textMuted, textAlign: 'center' }]}>
              No suppliers yet. Pull to refresh.
            </Text>
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
  header: {
    marginBottom: 24
  },
  title: {
    marginBottom: 12
  },
  subtitle: {
    marginBottom: 16
  },
  loaderContainer: {
    paddingVertical: 32
  }
});
