import type { TextStyle } from 'react-native';

export type ThemeColorMode = 'light' | 'dark';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string; // #4C6EF5
    primaryMuted: string; // subtle tint of primary for chips/badges
    secondary: string; // accent #00D4FF
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: (_multiplier: number) => number;
  radii: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  typography: {
    heading: TextStyle;
    subheading: TextStyle;
    subtitle: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
}

// 8pt grid
const spacing = (multiplier: number) => multiplier * 8;


export const lightTheme: Theme = {
  colors: {
    background: '#F9FDF7',
    surface: '#FFFFFF',
    primary: '#8CCFA2',
    primaryMuted: '#EAF6EF',
    secondary: '#5BA7D1',
    text: '#1F2C26',
    textMuted: '#597064',
    border: 'rgba(31,44,38,0.10)',
    success: '#2F6E49',
    warning: '#F0B429',
    error: '#E74C3C'
  },
  spacing,
  radii: {
    sm: 8,
    md: 12,
    lg: 12,
    pill: 999
  },
  shadows: {
    sm: {
      shadowColor: '#1F2C26',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1
    },
    md: {
      shadowColor: '#1F2C26',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2
    },
    lg: {
      shadowColor: '#1F2C26',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4
    }
  },
  typography: {
    heading: { fontSize: 28, fontWeight: '700', letterSpacing: 0.1 },
    subheading: { fontSize: 20, fontWeight: '600', letterSpacing: 0.1 },
    subtitle: { fontSize: 18, fontWeight: '600', letterSpacing: 0.1 },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 14, fontWeight: '400' }
  }
};

export const darkTheme: Theme = {
  colors: {
    background: '#1C2621',
    surface: '#16201B',
    primary: '#89E4B2',
    primaryMuted: '#244036',
    secondary: '#5BA7D1',
    text: '#EAF6EF',
    textMuted: '#A8C0B3',
    border: 'rgba(234,246,239,0.12)',
    success: '#8CCFA2',
    warning: '#F0B429',
    error: '#F0776B'
  },
  spacing,
  radii: {
    sm: 8,
    md: 12,
    lg: 12,
    pill: 999
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 1
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.20,
      shadowRadius: 8,
      elevation: 2
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 4
    }
  },
  typography: {
    heading: { fontSize: 28, fontWeight: '700', letterSpacing: 0.1 },
    subheading: { fontSize: 20, fontWeight: '600', letterSpacing: 0.1 },
    subtitle: { fontSize: 18, fontWeight: '600', letterSpacing: 0.1 },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 14, fontWeight: '400' }
  }
};
