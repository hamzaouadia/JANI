import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { SecureStoreOptions } from 'expo-secure-store';

import { logger } from '@/utils/logger';

const TOKEN_KEY = 'authToken';

let cachedAvailability: boolean | null = null;
let hasLoggedFallbackWarning = false;

const logFallback = (error: unknown) => {
  if (hasLoggedFallbackWarning) {
    return;
  }

  hasLoggedFallbackWarning = true;
  logger.warn('SecureStore unavailable, falling back to AsyncStorage', error);
};

const isSecureStoreUsable = async () => {
  if (cachedAvailability !== null) {
    return cachedAvailability;
  }

  try {
    if (typeof SecureStore.isAvailableAsync === 'function') {
      cachedAvailability = await SecureStore.isAvailableAsync();
    } else {
      cachedAvailability = typeof SecureStore.getItemAsync === 'function';
    }
  } catch (error) {
    cachedAvailability = false;
    logFallback(error);
  }

  return cachedAvailability;
};

export const getAuthToken = async (): Promise<string | null> => {
  if (await isSecureStoreUsable()) {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      logFallback(error);
    }
  }

  return AsyncStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = async (
  token: string | null,
  options?: SecureStoreOptions
): Promise<void> => {
  if (token == null) {
    await deleteAuthToken();
    return;
  }

  if (await isSecureStoreUsable()) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token, options);
      return;
    } catch (error) {
      logFallback(error);
    }
  }

  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const deleteAuthToken = async (): Promise<void> => {
  if (await isSecureStoreUsable()) {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      return;
    } catch (error) {
      logFallback(error);
    }
  }

  await AsyncStorage.removeItem(TOKEN_KEY);
};
