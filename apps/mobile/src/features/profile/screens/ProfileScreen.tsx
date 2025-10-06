import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { useAppTheme, useThemePreference } from '@/theme/ThemeProvider';

export const ProfileScreen = () => {
  const theme = useAppTheme();
  const { preference, setPreference } = useThemePreference();

  return (
    <Screen>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primaryMuted }]}>
          <Text style={[theme.typography.heading, { color: theme.colors.primary }]}>J</Text>
        </View>
        <View>
          <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Jordan Rivers</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>Supply Chain Director</Text>
        </View>
      </View>

      <View style={[styles.card, { borderColor: theme.colors.border }]}>
        <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Theme Preference</Text>
        <View style={styles.buttonRow}>
          {(['light', 'dark', 'system'] as const).map((mode) => (
            <Button
              key={mode}
              variant={preference === mode ? 'primary' : 'secondary'}
              onPress={() => setPreference(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </View>
      </View>

      <View style={[styles.card, { borderColor: theme.colors.border }]}>
        <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Contact</Text>
        <Text style={[theme.typography.body, styles.cardBody, { color: theme.colors.textMuted }]}>
          jordan.rivers@jani.ai
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  cardBody: {
    marginTop: 8
  }
});
