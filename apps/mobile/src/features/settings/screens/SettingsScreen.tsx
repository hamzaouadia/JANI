import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';

export const SettingsScreen = () => {
  const theme = useAppTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <Screen>
      <Text style={[theme.typography.heading, styles.title, { color: theme.colors.text }]}>Settings</Text>

      <View style={[styles.card, { borderColor: theme.colors.border }]}>
        <View style={styles.row}>
          <View>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>Notifications</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Receive supplier status updates</Text>
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
          <View>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>Biometric login</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Use device FaceID/TouchID to access the workspace</Text>
          </View>
          <Switch
            value={biometrics}
            onValueChange={setBiometrics}
            trackColor={{ true: theme.colors.primaryMuted, false: theme.colors.border }}
            thumbColor={biometrics ? theme.colors.primary : '#f4f3f4'}
          />
        </View>
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
    borderRadius: 16,
    padding: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#00000020',
    marginVertical: 20
  }
});
