import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { InlineAlert } from '@/components/ui/InlineAlert';
import { USER_ROLES, getRoleDefinition } from '@/constants/userRoles';
import type { UserRole } from '@/constants/userRoles';
import { RoleSelector } from '@/features/auth/components/RoleSelector';
import { useAuthStore } from '@/stores/authStore';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { AuthStackParamList } from '@/navigation/types';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const getRoleLabel = (role: UserRole) => USER_ROLES.find((item) => item.value === role)?.label ?? '';

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const theme = useAppTheme();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const [selectedRole, setSelectedRole] = useState<UserRole>(USER_ROLES[0].value);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const roleDefinition = useMemo(() => getRoleDefinition(selectedRole), [selectedRole]);
  const identifierField = roleDefinition.identifier;

  useEffect(() => {
    setIdentifier('');
    setPassword('');
    setIdentifierError(null);
    setPasswordError(null);
    setFormError(null);
  }, [selectedRole]);


  const handleSubmit = async () => {
    const trimmedIdentifier = identifier.trim();
    let hasError = false;

    if (!trimmedIdentifier) {
      setIdentifierError(identifierField.requiredMessage ?? 'This field is required.');
      hasError = true;
    } else {
      setIdentifierError(null);
    }

    if (!password) {
      setPasswordError('Enter your password.');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) {
      return;
    }

    try {
      await login({ role: selectedRole, identifier: trimmedIdentifier, password });
      console.log('[LoginScreen] sign-in success', { role: selectedRole, identifier: trimmedIdentifier });
      setFormError(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  };

  const goToSignup = () => {
    navigation.navigate('Signup', { role: selectedRole });
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: theme.spacing(5),
              paddingTop: theme.spacing(6),
              paddingBottom: theme.spacing(6)
            }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.hero, { backgroundColor: theme.colors.primaryMuted, borderColor: `${theme.colors.primary}33` }]}>
            <Text style={[theme.typography.caption, styles.heroEyebrow, { color: theme.colors.primary }]}>Welcome back</Text>
            <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Sign in to JANI</Text>
            <Text style={[theme.typography.body, styles.subtitle, { color: theme.colors.textMuted }]}> 
              {`You're signing in as a ${getRoleLabel(selectedRole).toLowerCase()}.`}
            </Text>
          </View>

          <View style={[styles.card, cardSurfaceStyle]}> 
            <Text style={[theme.typography.subheading, styles.sectionTitle, { color: theme.colors.text }]}>Choose your focus</Text>
            <RoleSelector selected={selectedRole} onSelect={setSelectedRole} />
          </View>

          <View style={[styles.card, cardSurfaceStyle]}> 
            <View style={styles.formHeader}>
              <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Credentials</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Securely authenticate with your role-specific identifiers.</Text>
            </View>
            <View style={styles.formFields}>
              <TextField
                label={identifierField.label}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize={identifierField.autoCapitalize ?? 'characters'}
                placeholder={identifierField.placeholder}
                error={identifierError}
              />
              {roleDefinition.loginHelper ? (
                <Text style={[theme.typography.caption, styles.helper, { color: theme.colors.textMuted }]}>
                  {roleDefinition.loginHelper}
                </Text>
              ) : null}
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                error={passwordError}
                placeholder="Enter your password"
              />
            </View>
            {formError ? (
              <InlineAlert kind="error">{formError}</InlineAlert>
            ) : null}
            <Button onPress={handleSubmit} loading={loading} fullWidth>
              Sign in
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>New to JANI?</Text>
            <Button variant="secondary" onPress={goToSignup} disabled={loading}>
              Create account
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    gap: 28
  },
  hero: {
    gap: 10,
    borderRadius: 28,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth
  },
  heroEyebrow: {
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22
  },
  sectionTitle: {
    marginBottom: 4
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 26,
    padding: 22,
    gap: 20
  },
  formHeader: {
    gap: 6
  },
  formFields: {
    gap: 16
  },
  helper: {
    marginTop: -4,
    marginBottom: 8
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
