import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';

export const SettingsScreen = () => {
  const theme = useAppTheme();
  const logout = useAuthStore((state) => state.logout);
  const loading = useAuthStore((state) => state.loading);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const cardSurfaceStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    shadowColor: '#1A342720',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2
  };

  return (
    <Screen>
      <Text style={[theme.typography.heading, styles.title, { color: theme.colors.text }]}>Settings</Text>

      <View style={[styles.card, cardSurfaceStyle]}>
        <View style={styles.row}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>Notifications</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted, flexShrink: 1 }]}>Receive supplier status updates</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: theme.colors.primaryMuted, false: theme.colors.border }}
            thumbColor={notifications ? theme.colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.row}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>Biometric login</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted, flexShrink: 1 }]}>Use device FaceID/TouchID to access the workspace</Text>
          </View>
          <Switch
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={{ true: theme.colors.primaryMuted, false: theme.colors.border }}
            thumbColor={biometrics ? theme.colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.logoutButton}>
        <Button
          variant="secondary"
          onPress={() => {
            void logout();
          }}
          loading={loading}
          fullWidth
        >
          Sign out
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 24
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    padding: 22,
    gap: 20,
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12
  },
  logoutButton: {
    marginTop: 32
  }
});
