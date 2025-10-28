import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme/ThemeProvider';

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  onChangeText?: (_value: string) => void;
};

export const SearchBar = ({ value: valueProp, placeholder = 'Search', onChangeText }: SearchBarProps) => {
  const theme = useAppTheme();
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  
  // Use controlled value if provided, otherwise use internal state
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const handleChange = (text: string) => {
    if (!isControlled) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const clear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChangeText?.('');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: focused ? theme.colors.primary : theme.colors.border,
          shadowColor: focused ? '#1A342720' : 'transparent',
          shadowOffset: { width: 0, height: focused ? 8 : 0 },
          shadowOpacity: focused ? 0.12 : 0,
          shadowRadius: focused ? 14 : 0,
          elevation: focused ? 2 : 0
        }
      ]}
    >
      <Ionicons
        name={value.length > 0 ? 'search' : 'search-outline'}
        size={18}
        color={theme.colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        onChangeText={handleChange}
        style={[styles.input, { color: theme.colors.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel="Search"
      />
      {value.length > 0 ? (
        <Pressable onPress={clear} accessibilityLabel="Clear search" hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    padding: 0
  }
});
