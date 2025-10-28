import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/components/layout/Screen';
import { useAppTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/Button';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export const AIScreen = () => {
  const theme = useAppTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: 'Hi, I\'m Jani. How can I help today?' }
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    // Fake assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', text: `You said: "${trimmed}"` }
      ]);
      listRef.current?.scrollToEnd({ animated: true });
    }, 300);
    listRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(180)}
              layout={Layout.springify()}
              style={{ marginBottom: 12, alignItems: item.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              {item.role === 'assistant' ? (
                <LinearGradient
                  colors={[theme.colors.surface, theme.colors.surface]}
                  style={[styles.bubble, { borderColor: theme.colors.border }]}
                >
                  <Text style={{ color: theme.colors.text }}>{item.text}</Text>
                </LinearGradient>
              ) : (
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.bubble, styles.bubbleUser]}
                >
                  <Text style={{ color: '#FFFFFF' }}>{item.text}</Text>
                </LinearGradient>
              )}
            </Animated.View>
          )}
        />

        <View style={[styles.composerWrap, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}> 
          <View style={[styles.composer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}> 
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask the AI..."
              placeholderTextColor={theme.colors.textMuted}
              style={{ flex: 1, color: theme.colors.text }}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <Button onPress={send}>Send</Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2
  },
  bubbleUser: {
    borderWidth: 0
  },
  composerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 12
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12
  }
});
