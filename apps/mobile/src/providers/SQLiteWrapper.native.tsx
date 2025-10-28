import { SQLiteProvider } from 'expo-sqlite';
import type { PropsWithChildren } from 'react';

import { DB_NAME } from '@/lib/database/schema';

/**
 * SQLite wrapper component - only used on native platforms
 * This component is separated to avoid importing expo-sqlite on web
 */
export const SQLiteWrapper = ({ children }: PropsWithChildren) => {
  return <SQLiteProvider databaseName={DB_NAME}>{children}</SQLiteProvider>;
};
