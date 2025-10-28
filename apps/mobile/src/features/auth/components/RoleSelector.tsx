import { USER_ROLES, type UserRole } from '@/constants/userRoles';
import { useAppTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type RoleSelectorProps = {
  selected: UserRole;
  onSelect: (_role: UserRole) => void;
};

export const RoleSelector = ({ selected, onSelect }: RoleSelectorProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {USER_ROLES.map((role) => {
        const isActive = selected === role.value;

        return (
          <Pressable
            key={role.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            onPress={() => onSelect(role.value)}
            style={({ pressed }) => [
              styles.card,
              {
                borderColor: isActive ? theme.colors.primary : 'transparent',
                backgroundColor: isActive ? theme.colors.primaryMuted : theme.colors.surface,
                opacity: pressed ? 0.92 : 1,
                shadowColor: '#1A342720',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.12,
                shadowRadius: 14,
                elevation: 2
              }
            ]}
          >
            <Text
              style={[
                theme.typography.subheading,
                styles.title,
                { color: isActive ? theme.colors.primary : theme.colors.text }
              ]}
            >
              {role.label}
            </Text>
            <Text style={[theme.typography.body, styles.description, { color: theme.colors.textMuted }]}>
              {role.description}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20
  },
  title: {
    marginBottom: 4
  },
  description: {
    lineHeight: 20
  }
});
