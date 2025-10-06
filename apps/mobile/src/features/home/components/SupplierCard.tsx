import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import type { Supplier } from '../api/getFeaturedSuppliers';

type SupplierCardProps = {
  supplier: Supplier;
};

export const SupplierCard = memo(({ supplier }: SupplierCardProps) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[theme.typography.subheading, styles.title]}>{supplier.name}</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.primaryMuted
            }
          ]}
        >
          <Text style={[styles.badgeLabel, { color: theme.colors.primary }]}>★ {supplier.rating}</Text>
        </View>
      </View>
      <Text style={[theme.typography.body, styles.meta, { color: theme.colors.textMuted }]}>
        {supplier.category} • {supplier.country}
      </Text>
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
        Avg. lead time: {supplier.leadTimeDays} days
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    flex: 1,
    marginRight: 8
  },
  meta: {
    marginTop: 8
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  badgeLabel: {
    fontWeight: '600'
  }
});

SupplierCard.displayName = 'SupplierCard';
