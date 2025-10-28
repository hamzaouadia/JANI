// Re-export ThemeProvider and hooks from stores
// This allows imports from @/theme/ThemeProvider to work correctly
export { 
  ThemeProvider, 
  useAppTheme, 
  useThemePreference, 
  useThemeColorScheme,
  useNavigationTheme 
} from '../stores/ThemeProvider';
