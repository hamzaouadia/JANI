import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { InlineAlert } from '@/components/ui/InlineAlert';
import { PopoverHint } from '@/components/ui/PopoverHint';
import { USER_ROLES, getRoleDefinition } from '@/constants/userRoles';
import type { RoleFieldConfig, UserRole } from '@/constants/userRoles';
import { RoleSelector } from '@/features/auth/components/RoleSelector';
import { useAuthStore } from '@/stores/authStore';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { AuthStackParamList } from '@/navigation/types';

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const SignupScreen = ({ navigation, route }: SignupScreenProps) => {
  const theme = useAppTheme();
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);

  const initialRole = useMemo<UserRole>(() => {
    if (route.params?.role) {
      return route.params.role;
    }

    return USER_ROLES[0].value;
  }, [route.params?.role]);

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [roleFieldValues, setRoleFieldValues] = useState<Record<string, string>>(() =>
    createInitialFieldState(initialRole)
  );
  const [roleFieldErrors, setRoleFieldErrors] = useState<Record<string, string | null>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const roleDefinition = useMemo(() => getRoleDefinition(selectedRole), [selectedRole]);
  const identifierField = roleDefinition.identifier;

  useEffect(() => {
    setRoleFieldValues(createInitialFieldState(selectedRole));
    setRoleFieldErrors({});
    setFormError(null);
  }, [selectedRole]);

  const handleRoleFieldChange = (field: RoleFieldConfig, value: string) => {
    setRoleFieldValues((prev) => ({ ...prev, [field.name]: value }));
    setRoleFieldErrors((prev) => ({ ...prev, [field.name]: null }));
  };

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedRoleFields = Object.fromEntries(
      Object.entries(roleFieldValues).map(([key, value]) => [key, value.trim()])
    );
    const identifierValue = (trimmedRoleFields[identifierField.name] ?? '').trim();
    let hasError = false;

    if (!isValidEmail(normalizedEmail)) {
      setEmailError('Enter a valid email address.');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (confirmPassword !== password) {
      setConfirmError('Passwords need to match.');
      hasError = true;
    } else {
      setConfirmError(null);
    }

    const nextRoleErrors: Record<string, string | null> = {};
    for (const field of roleDefinition.signupFields) {
      const value = trimmedRoleFields[field.name] ?? '';
      if (field.requiredMessage && !value) {
        nextRoleErrors[field.name] = field.requiredMessage;
        hasError = true;
      } else {
        nextRoleErrors[field.name] = null;
      }
    }

    if (!identifierValue) {
      nextRoleErrors[identifierField.name] =
        identifierField.requiredMessage ?? 'This field is required.';
      hasError = true;
    }

    setRoleFieldErrors(nextRoleErrors);

    if (hasError) {
      return;
    }

    try {
      const profilePayload: Record<string, string> = {};
      for (const [key, value] of Object.entries(trimmedRoleFields)) {
        if (value) {
          profilePayload[key] = value;
        }
      }

      await signup({
        email: normalizedEmail,
        password,
        role: selectedRole,
        identifier: identifierValue,
        profile: profilePayload
      });
      setFormError(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to create your account.');
    }
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
            <Text style={[theme.typography.caption, styles.heroEyebrow, { color: theme.colors.primary }]}>Join the network</Text>
            <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Create your account</Text>
            <Text style={[theme.typography.body, styles.subtitle, { color: theme.colors.textMuted }]}> 
              We tailor onboarding flows to each role so your team can collaborate from day one.
            </Text>
          </View>

          <View style={[styles.card, cardSurfaceStyle]}> 
            <Text style={[theme.typography.subheading, styles.sectionTitle, { color: theme.colors.text }]}>Select your role</Text>
            <RoleSelector selected={selectedRole} onSelect={setSelectedRole} />
          </View>

          <View style={[styles.card, cardSurfaceStyle]}> 
            <View style={styles.sectionHeader}>
              <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Role profile</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Provide the identifiers and context your partners rely on.</Text>
              <PopoverHint
                title="Tips for role profile"
                tips={[
                  'Use your official organization or team name where applicable.',
                  'Provide a clear identifier so partners can recognize you.',
                  'Optional fields help collaborators route requests faster.'
                ]}
              />
            </View>
            <View style={styles.formFields}>
              {roleDefinition.signupFields.map((field) => (
                <View key={`${selectedRole}-${field.name}`} style={styles.fieldBlock}>
                  <TextField
                    label={field.label}
                    value={roleFieldValues[field.name] ?? ''}
                    onChangeText={(value: string) => handleRoleFieldChange(field, value)}
                    placeholder={field.placeholder}
                    error={roleFieldErrors[field.name] ?? null}
                    autoCapitalize={field.autoCapitalize ?? 'sentences'}
                    autoComplete={field.autoComplete}
                    keyboardType={field.keyboardType}
                  />
                  {field.helper ? (
                    <Text style={[theme.typography.caption, styles.helper, { color: theme.colors.textMuted }]}> 
                      {field.helper}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.card, cardSurfaceStyle]}> 
            <View style={styles.sectionHeader}>
              <Text style={[theme.typography.subheading, { color: theme.colors.text }]}>Account security</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Use your work email so stakeholders can verify your identity.</Text>
              <PopoverHint
                title="Account setup tips"
                tips={[
                  'Use your work email address (you@company.com).',
                  'Passwords must be 8+ characters; prefer a mix of letters, numbers, and symbols.',
                  'Avoid reusing passwords from other sites.'
                ]}
              />
            </View>
            <View style={styles.formFields}>
              <TextField
                label="Work email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                error={emailError}
                placeholder="you@business.com"
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="newPassword"
                error={passwordError}
                placeholder="At least 8 characters"
              />
              <TextField
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                error={confirmError}
                placeholder="Repeat password"
              />
            </View>
            {formError ? (
              <InlineAlert kind="error">{formError}</InlineAlert>
            ) : null}
            <Button onPress={handleSubmit} loading={loading} fullWidth>
              Create account
            </Button>
          </View>

          <View style={styles.footer}>
            <Button variant="secondary" onPress={() => navigation.goBack()} disabled={loading}>
              Back to sign in
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
  sectionHeader: {
    gap: 6
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 26,
    padding: 22,
    gap: 20
  },
  formFields: {
    gap: 16
  },
  fieldBlock: {
    gap: 6
  },
  helper: {
    marginTop: -4,
    marginBottom: 6
  },
  footer: {
    alignItems: 'flex-start'
  }
});


function createInitialFieldState(role: UserRole) {
  const config = getRoleDefinition(role);
  return config.signupFields.reduce<Record<string, string>>((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {});
}
