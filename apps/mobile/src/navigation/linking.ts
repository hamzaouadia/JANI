import { navMatrix } from '@/navigation/config/navMatrix';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

// Build a React Navigation linking config from navMatrix
export const linking: LinkingOptions<RootStackParamList> = {
  // Expo scheme is set to "jani" in app config
  prefixes: ['jani://'],
  config: {
    screens: {
      Auth: {
        // Basic auth routes
        screens: {
          Landing: 'auth',
          Login: 'auth/login',
          Signup: 'auth/signup'
        }
      },
      AppTabs: {
        screens: buildTabsScreens()
      }
    }
  }
};

function buildTabsScreens() {
  // Aggregate all tabs across roles and union their stacks
  const tabs: Record<string, { screens: Record<string, string | undefined> }> = {};

  for (const role of navMatrix.roles) {
    for (const tab of role.tabs) {
      const current = tabs[tab.key] ?? { screens: {} };
      for (const s of tab.stack) {
        current.screens[s.name] = s.path;
      }
      tabs[tab.key] = current;
    }
  }

  return tabs;
}
