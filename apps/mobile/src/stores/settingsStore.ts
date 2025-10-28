import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemePreference = 'light' | 'dark' | 'system';

type SettingsState = {
  themePreference: ThemePreference;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setThemePreference: (_preference: ThemePreference) => void;
};

const STORAGE_KEY = 'jani-settings-preference';

const isValidPreference = (value: string | null): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  themePreference: 'system',
  hydrated: false,
  setThemePreference: (themePreference) => {
    set({ themePreference });
    AsyncStorage.setItem(STORAGE_KEY, themePreference).catch(() => {
      // Ignore storage write errors for now; app can operate without persistence
    });
  },
  hydrate: async () => {
    if (get().hydrated) {
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (isValidPreference(stored)) {
        set({ themePreference: stored });
      }
    } catch {
      // Ignore storage read errors and fall back to defaults
    } finally {
      set({ hydrated: true });
    }
  }
}));
