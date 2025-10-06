import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  type Theme as NavigationTheme
} from '@react-navigation/native';

import { useSettingsStore, type ThemePreference } from '@/stores/settingsStore';

import { darkTheme, lightTheme, type Theme, type ThemeColorMode } from './index';

type ThemeContextValue = {
  theme: Theme;
  scheme: ThemeColorMode;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  navigationTheme: NavigationTheme;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const preference = useSettingsStore((state) => state.themePreference);
  const setPreference = useSettingsStore((state) => state.setThemePreference);
  const hydrate = useSettingsStore((state) => state.hydrate);
  const hydrated = useSettingsStore((state) => state.hydrated);
  const deviceScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrate, hydrated]);

  const scheme: ThemeColorMode = preference === 'system' ? deviceScheme : preference;
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const navigationTheme = useMemo<NavigationTheme>(() => {
    const base = scheme === 'dark' ? NavigationDarkTheme : NavigationLightTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.secondary
      }
    };
  }, [scheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      scheme,
      preference,
      setPreference,
      navigationTheme
    }),
    [theme, scheme, preference, setPreference, navigationTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }

  return context.theme;
};

export const useThemePreference = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemePreference must be used within ThemeProvider');
  }

  return {
    preference: context.preference,
    setPreference: context.setPreference
  };
};

export const useThemeColorScheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeColorScheme must be used within ThemeProvider');
  }

  return context.scheme;
};

export const useNavigationTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useNavigationTheme must be used within ThemeProvider');
  }

  return context.navigationTheme;
};
