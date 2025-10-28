import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { useAppTheme } from '@/theme/ThemeProvider';

const MOCK = [
  { id: 'r1', title: 'Harvest Event', subtitle: 'Lot A-12 • 2025-10-01', status: 'verified' as const },
  { id: 'r2', title: 'Transfer to Coop', subtitle: 'Coop Kijani • 2025-10-03', status: 'pending' as const },
  { id: 'r3', title: 'GPS Check', subtitle: 'Precision OK • 2025-10-04', status: 'flagged' as const }
];

export const RecordsScreen = () => {
  const theme = useAppTheme();
  return (
    <Screen>
      <Text style={[theme.typography.heading, { color: theme.colors.text, marginBottom: 8 }]}>Records</Text>
      <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginBottom: 16 }]}>Recent chain-of-custody events</Text>
      <FlatList
        data={MOCK}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 60)}>
            <Card>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>{item.title}</Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 4 }]}>{item.subtitle}</Text>
                </View>
                <VerificationBadge status={item.status} />
              </View>
            </Card>
          </Animated.View>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 }
});
