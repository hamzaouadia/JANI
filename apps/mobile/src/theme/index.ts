import type { TextStyle } from 'react-native';

export type ThemeColorMode = 'light' | 'dark';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    primaryMuted: string;
    secondary: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: (multiplier: number) => number;
  radii: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  typography: {
    heading: TextStyle;
    subheading: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
}

const spacing = (multiplier: number) => multiplier * 4;

const baseTypography: Theme['typography'] = {
  heading: {
    fontSize: 28,
    fontWeight: '700'
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600'
  },
  body: {
    fontSize: 16,
    fontWeight: '400'
  },
  caption: {
    fontSize: 13,
    fontWeight: '400'
  }
};

export const lightTheme: Theme = {
  colors: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    primary: '#1E7F55',
    primaryMuted: '#CBE8DB',
    secondary: '#3865F4',
    text: '#1A1C1E',
    textMuted: '#67728A',
    border: '#E1E5EC',
    success: '#2A9D8F',
    warning: '#F4A261',
    error: '#E63946'
  },
  spacing,
  radii: {
    sm: 6,
    md: 12,
    lg: 20,
    pill: 999
  },
  typography: baseTypography
};

export const darkTheme: Theme = {
  colors: {
    background: '#0F1115',
    surface: '#16191F',
    primary: '#4DD197',
    primaryMuted: '#254030',
    secondary: '#6C8CFF',
    text: '#F9FAFB',
    textMuted: '#9EA6B7',
    border: '#2B303A',
    success: '#35C2AC',
    warning: '#E9A96F',
    error: '#F26D7A'
  },
  spacing,
  radii: {
    sm: 6,
    md: 12,
    lg: 20,
    pill: 999
  },
  typography: baseTypography
};
