import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

export const CollectionDetailScreen = () => {
  const theme = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Collection Detail</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 8 }]}>ID, items, weights, payouts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16 }
});
