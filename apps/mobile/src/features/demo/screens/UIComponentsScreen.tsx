import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import type { BottomSheetRef } from '@/components/ui/BottomSheet';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { SwipeableItem } from '@/components/ui/SwipeableItem';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { EnhancedInput } from '@/components/ui/EnhancedInput';
import { PullToRefreshView } from '@/components/ui/PullToRefresh';
import { useToast } from '@/components/ui/Toast';
import { useAppTheme } from '@/theme/ThemeProvider';
import { haptic } from '@/utils/haptics';
import type { Theme } from '@/theme';

export const UIComponentsScreen = () => {
  const theme = useAppTheme();
  const { show } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    show('Data refreshed!', 'success');
  };

  const handleFABAction = (action: string) => {
    void haptic.light();
    show(`${action} pressed`, 'info');
  };

  const handleSwipeAction = (action: string, item: string) => {
    void haptic.medium();
    show(`${action} on ${item}`, action === 'Delete' ? 'error' : 'success');
  };

  const demoUsers = [
    { id: '1', name: 'John Doe', avatarUri: 'https://i.pravatar.cc/150?img=1', online: true },
    { id: '2', name: 'Jane Smith', avatarUri: 'https://i.pravatar.cc/150?img=2', online: false },
    { id: '3', name: 'Bob Wilson', avatarUri: 'https://i.pravatar.cc/150?img=3', online: true },
    { id: '4', name: 'Alice Brown', avatarUri: undefined, online: false },
  ];

  const swipeableItems = [
    'Swipe me left or right',
    'Try swiping this item',
    'Each item can be swiped',
  ];

  const styles = createStyles(theme);

  return (
    <PullToRefreshView onRefresh={handleRefresh} refreshing={refreshing}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Section: Avatars */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avatars</Text>
            <View style={styles.row}>
              <Avatar
                source={{ uri: demoUsers[0].avatarUri! }}
                name={demoUsers[0].name}
                size="xl"
                online={demoUsers[0].online}
              />
              <Avatar
                name={demoUsers[3].name}
                size="xl"
                online={demoUsers[3].online}
              />
              <Avatar
                source={{ uri: demoUsers[1].avatarUri! }}
                name={demoUsers[1].name}
                size="xl"
                badge={<Text style={{ color: '#FFF', fontWeight: '700' }}>5</Text>}
              />
            </View>
            <Text style={styles.subsectionTitle}>Avatar Group</Text>
            <AvatarGroup
              avatars={demoUsers.map(u => ({
                name: u.name,
                source: u.avatarUri ? { uri: u.avatarUri } : undefined,
              }))}
              max={3}
              size="lg"
            />
          </View>

          {/* Section: Enhanced Inputs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enhanced Inputs</Text>
            <EnhancedInput
              label="Username"
              placeholder="Enter your username"
              value={inputValue}
              onChangeText={setInputValue}
              leftIcon="👤"
            />
            <EnhancedInput
              label="Email"
              placeholder="you@example.com"
              value={emailValue}
              onChangeText={setEmailValue}
              leftIcon="✉️"
              keyboardType="email-address"
              autoCapitalize="none"
              helperText="We'll never share your email"
            />
            <EnhancedInput
              label="Password"
              placeholder="Enter password"
              secureTextEntry
              leftIcon="🔒"
              helperText="Must be at least 8 characters"
            />
          </View>

          {/* Section: Swipeable Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Swipeable Items</Text>
            <Text style={styles.description}>Swipe left for edit, right for delete</Text>
            {swipeableItems.map((item, index) => (
              <SwipeableItem
                key={index}
                leftActions={[
                  {
                    label: 'Edit',
                    backgroundColor: '#4CAF50',
                    onPress: () => handleSwipeAction('Edit', item),
                    icon: '✏️',
                  },
                ]}
                rightActions={[
                  {
                    label: 'Delete',
                    backgroundColor: '#f44336',
                    onPress: () => handleSwipeAction('Delete', item),
                    icon: '🗑️',
                  },
                ]}
              >
                <View style={styles.swipeableContent}>
                  <Text style={styles.swipeableText}>{item}</Text>
                </View>
              </SwipeableItem>
            ))}
          </View>

          {/* Section: Toast Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Toast Notifications</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.successButton]}
                onPress={() => {
                  void haptic.light();
                  show('Success! Operation completed', 'success');
                }}
              >
                <Text style={styles.buttonText}>Success</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.errorButton]}
                onPress={() => {
                  void haptic.medium();
                  show('Error occurred!', 'error');
                }}
              >
                <Text style={styles.buttonText}>Error</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.infoButton]}
                onPress={() => {
                  void haptic.light();
                  show('Information message', 'info');
                }}
              >
                <Text style={styles.buttonText}>Info</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.warningButton]}
                onPress={() => {
                  void haptic.light();
                  show('Warning: Check this out', 'warning');
                }}
              >
                <Text style={styles.buttonText}>Warning</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Bottom Sheet */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bottom Sheet</Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => {
                void haptic.light();
                bottomSheetRef.current?.open();
              }}
            >
              <Text style={styles.buttonText}>Open Bottom Sheet</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* FAB */}
        <FloatingActionButton
          icon="＋"
          onPress={() => handleFABAction('Main FAB')}
          actions={[
            {
              icon: '📷',
              label: 'Camera',
              onPress: () => handleFABAction('Camera'),
              color: '#4CAF50',
            },
            {
              icon: '🖼️',
              label: 'Gallery',
              onPress: () => handleFABAction('Gallery'),
              color: '#3B82F6',
            },
            {
              icon: '📄',
              label: 'Document',
              onPress: () => handleFABAction('Document'),
              color: '#6366F1',
            },
          ]}
        />

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          onClose={() => show('Bottom sheet closed', 'info')}
          snapPoints={[300, 500]}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Bottom Sheet Example</Text>
            <Text style={styles.bottomSheetText}>
              This is a modal bottom sheet with gesture support.
            </Text>
            <Text style={styles.bottomSheetText}>
              You can swipe down to dismiss or tap outside.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { marginTop: 20 }]}
              onPress={() => {
                void haptic.light();
                bottomSheetRef.current?.close();
                show('Bottom sheet closed', 'info');
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>
    </PullToRefreshView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
    },
    subsectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
  color: theme.colors.text,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 8,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    primaryButton: {
      backgroundColor: '#2196F3',
    },
    successButton: {
      backgroundColor: '#4CAF50',
    },
    errorButton: {
      backgroundColor: '#f44336',
    },
    infoButton: {
      backgroundColor: '#2196F3',
    },
    warningButton: {
      backgroundColor: '#FF9800',
    },
    swipeableContent: {
      backgroundColor: theme.colors.surface || '#fff',
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    swipeableText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    bottomSheetContent: {
      padding: 24,
    },
    bottomSheetTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    bottomSheetText: {
      fontSize: 16,
  color: theme.colors.text,
      marginBottom: 8,
      lineHeight: 24,
    },
  });
