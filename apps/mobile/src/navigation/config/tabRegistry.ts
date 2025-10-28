import type { ComponentType } from 'react';

import { ChatNavigatorFA } from '@/navigation/chat/ChatNavigatorFA';
import { ChatNavigatorTR } from '@/navigation/chat/ChatNavigatorTR';
import { ChatNavigatorEXP } from '@/navigation/chat/ChatNavigatorEXP';
import { ChatNavigatorCA } from '@/navigation/chat/ChatNavigatorCA';
import { TeamChatNavigatorFM } from '@/navigation/chat/TeamChatNavigatorFM';

// Role-aware mapping of tab keys to prebuilt navigators/screens
// Only map tabs we have real implementations for; fall back to generated placeholders otherwise
const registry: Record<string, Record<string, ComponentType<Record<string, unknown>>>> = {
  'field-agent': {
    chat: ChatNavigatorFA
  },
  transporter: {
    chat: ChatNavigatorTR
  },
  exporter: {
    chat: ChatNavigatorEXP
  },
  'coop-admin': {
    chat: ChatNavigatorCA
  },
  'farm-manager': {
    'team-chat': TeamChatNavigatorFM
  }
};

export const getCustomTabComponent = (roleKey: string, tabKey: string): ComponentType<Record<string, unknown>> | null => {
  return registry[roleKey]?.[tabKey] ?? null;
};
