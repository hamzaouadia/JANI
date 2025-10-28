import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getUsers } from '@/lib/api';
import type { User as ApiUser } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  lastLogin: string;
  registrationDate: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser._id,
  name: apiUser.fullName,
  email: apiUser.email,
  role: apiUser.role,
  status: apiUser.status,
  lastLogin: apiUser.lastLogin ? formatDate(apiUser.lastLogin) : 'Never',
  registrationDate: formatDate(apiUser.registeredAt),
});

export const AdminUsersScreen = () => {
  const theme = useAppTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUsers = await getUsers();
        const mappedUsers = apiUsers.map(mapApiUserToUser);
        setUsers(mappedUsers);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'suspended': return theme.colors.error;
      default: return theme.colors.textMuted;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farm': return '🚜';
      case 'exporter': return '📦';
      case 'logistics': return '🚛';
      case 'buyer': return '🏪';
      default: return '👤';
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  // Show loading state
  if (loading) {
    return (
      <Screen>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Loading users...</Text>
        </View>
      </Screen>
    );
  }

  // Show error state
  if (error) {
    return (
      <Screen>
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Error</Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textMuted }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setLoading(true);
              setError(null);
              getUsers().then(apiUsers => {
                setUsers(apiUsers.map(mapApiUserToUser));
                setLoading(false);
              }).catch((err) => {
                console.error('Failed to load users:', err);
                setError('Failed to load users. Please try again.');
                setLoading(false);
              });
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            User Management
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
            Manage user accounts and permissions
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{userStats.total}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Total Users</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>{userStats.active}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>{userStats.pending}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>{userStats.suspended}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Suspended</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersSection}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            placeholder="Search users..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleFilters}>
            {['all', 'farm', 'exporter', 'logistics', 'buyer'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleFilter,
                  {
                    backgroundColor: selectedRole === role ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setSelectedRole(role)}
              >
                <Text style={[
                  styles.roleFilterText,
                  { color: selectedRole === role ? '#fff' : theme.colors.text }
                ]}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Users List */}
        <View style={styles.usersList}>
          {filteredUsers.map((user) => (
            <View key={user.id} style={[styles.userCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userIcon}>{getRoleIcon(user.role)}</Text>
                  <View style={styles.userDetails}>
                    <Text style={[styles.userName, { color: theme.colors.text }]}>{user.name}</Text>
                    <Text style={[styles.userEmail, { color: theme.colors.textMuted }]}>{user.email}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
                  <Text style={styles.statusText}>{user.status}</Text>
                </View>
              </View>
              
              <View style={styles.userMeta}>
                <View style={styles.userMetaItem}>
                  <Text style={[styles.userMetaLabel, { color: theme.colors.textMuted }]}>Role</Text>
                  <Text style={[styles.userMetaValue, { color: theme.colors.text }]}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Text>
                </View>
                <View style={styles.userMetaItem}>
                  <Text style={[styles.userMetaLabel, { color: theme.colors.textMuted }]}>Last Login</Text>
                  <Text style={[styles.userMetaValue, { color: theme.colors.text }]}>{user.lastLogin}</Text>
                </View>
                <View style={styles.userMetaItem}>
                  <Text style={[styles.userMetaLabel, { color: theme.colors.textMuted }]}>Registered</Text>
                  <Text style={[styles.userMetaValue, { color: theme.colors.text }]}>{user.registrationDate}</Text>
                </View>
              </View>

              <View style={styles.userActions}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.textMuted }]}>
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No users found</Text>
            <Text style={[styles.emptyMessage, { color: theme.colors.textMuted }]}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    width: '25%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statCardInner: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  filtersSection: {
    marginBottom: 24,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  roleFilters: {
    flexDirection: 'row',
  },
  roleFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  roleFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  usersList: {
    gap: 16,
  },
  userCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  userMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userMetaItem: {
    flex: 1,
  },
  userMetaLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  userMetaValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});