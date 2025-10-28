import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useState } from 'react';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Modal } from '@/components/ui/Modal';
import { getRoleDefinition } from '@/constants/userRoles';
import { useAppTheme, useThemePreference } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';

export const ProfileScreen = () => {
  const theme = useAppTheme();
  const { height } = useWindowDimensions();
  const { preference, setPreference } = useThemePreference();
  const logout = useAuthStore((state) => state.logout);
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const roleDefinition = user ? getRoleDefinition(user.role) : null;
  const profileDetails = user && roleDefinition ? getProfileDetails(user.profile, roleDefinition) : [];

  const [editOpen, setEditOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.profile?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const avatarLetter = user?.profile?.fullName?.charAt(0) ?? user?.email?.charAt(0) ?? 'J';
  const roleLabel = roleDefinition?.label ?? 'Member';

  const handleLogout = () => {
    void logout();
  };

  const cardSurfaceStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    shadowColor: '#1A342720',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={[styles.content, { minHeight: height, paddingHorizontal: theme.spacing(5), paddingTop: theme.spacing(4) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primaryMuted }]}>
          <Text style={[theme.typography.heading, { color: theme.colors.primary }]}>{avatarLetter.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>
            {user?.profile?.fullName ?? user?.profile?.companyName ?? roleLabel}
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>{roleLabel}</Text>
          </View>
        </View>

        {/* Quick actions under header */}
        <View style={{ alignSelf: 'flex-end', marginBottom: 12 }}>
          <Button
            variant="secondary"
            onPress={() => {
              setFullName(user?.profile?.fullName ?? '');
              setEmail(user?.email ?? '');
              setEditOpen(true);
            }}
          >
            Edit profile
          </Button>
        </View>

        <View style={[styles.card, cardSurfaceStyle]}> 
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

        <View style={[styles.card, cardSurfaceStyle]}> 
          <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Account</Text>
          <Text style={[theme.typography.body, styles.cardBody, { color: theme.colors.textMuted }]}> 
            {user?.email ?? 'No email available'}
          </Text>
          {user?.identifier && roleDefinition ? (
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}> 
              {roleDefinition.identifier.label}: {user.identifier}
            </Text>
          ) : null}
        </View>

        {profileDetails.length ? (
          <View style={[styles.card, cardSurfaceStyle]}> 
            <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Role details</Text>
            <View style={styles.detailList}>
              {profileDetails.map((detail) => (
                <View key={detail.key} style={styles.detailRow}>
                  <Text style={[theme.typography.caption, styles.detailLabel, { color: theme.colors.textMuted }]}> 
                    {detail.label}
                  </Text>
                  <Text style={[theme.typography.body, { color: theme.colors.text }]}>{detail.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Button variant="secondary" onPress={handleLogout} loading={loading} fullWidth>
          Sign out
        </Button>
      </ScrollView>

      <Modal visible={editOpen} onRequestClose={() => setEditOpen(false)}>
        <Text style={[theme.typography.subheading, { color: theme.colors.text, marginBottom: 12 }]}>Edit profile</Text>
        <View style={{ gap: 12 }}>
          <TextField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
          <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <Button variant="secondary" onPress={() => setEditOpen(false)}>Cancel</Button>
            <Button onPress={() => {
              updateProfile({ email, profile: { fullName } }).then(() => setEditOpen(false));
            }}>Save</Button>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    gap: 20
  },
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
    borderRadius: 26,
    padding: 24,
    marginBottom: 20,
    gap: 16
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  cardBody: {
    marginTop: 8
  },
  detailList: {
    marginTop: 16,
    gap: 12
  },
  detailRow: {
    gap: 4
  },
  detailLabel: {
    letterSpacing: 0.4,
    textTransform: 'uppercase'
  }
});

function getProfileDetails(
  profile: Record<string, string>,
  roleDefinition: ReturnType<typeof getRoleDefinition>
) {
  const seen = new Set<string>();
  const entries: { key: string; label: string; value: string }[] = [];

  for (const field of roleDefinition.signupFields) {
    if (seen.has(field.name)) {
      continue;
    }

    const value = profile?.[field.name];
    if (value) {
      entries.push({ key: field.name, label: field.label, value });
      seen.add(field.name);
    }
  }

  return entries;
}
