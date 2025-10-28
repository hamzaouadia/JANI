import type { UserRole } from '@/constants/userRoles';
export type UnifiedTab = {
  key: string;
  title: string;
  icon: { focused: string; unfocused: string };
  component: 'HomeNavigator' | 'FarmsNavigator' | 'CaptureScreen' | 'OrdersNavigator' | 'AnalyticsNavigator' | 'ProfileScreen' | 'FarmStatesScreen' | 'AdminDashboard' | 'AdminUsers' | 'AdminFarms' | 'AdminAnalytics';
  roles: UserRole[]; // Which roles can see this tab
};

export const UNIFIED_TABS: UnifiedTab[] = [
  {
    key: 'Home',
    title: 'Home',
    icon: { focused: 'home', unfocused: 'home-outline' },
    component: 'HomeNavigator',
    roles: ['farm', 'logistics', 'exporter', 'buyer']
  },
  {
    key: 'AdminDashboard',
    title: 'Dashboard',
    icon: { focused: 'grid', unfocused: 'grid-outline' },
    component: 'AdminDashboard',
    roles: ['admin']
  },
  {
    key: 'AdminUsers',
    title: 'Users',
    icon: { focused: 'people', unfocused: 'people-outline' },
    component: 'AdminUsers',
    roles: ['admin']
  },
  {
    key: 'AdminFarms',
    title: 'Farms',
    icon: { focused: 'leaf', unfocused: 'leaf-outline' },
    component: 'AdminFarms',
    roles: ['admin']
  },
  {
    key: 'AdminAnalytics',
    title: 'Analytics',
    icon: { focused: 'stats-chart', unfocused: 'stats-chart-outline' },
    component: 'AdminAnalytics',
    roles: ['admin']
  },
  {
    key: 'Farms',
    title: 'Farms',
    icon: { focused: 'leaf', unfocused: 'leaf-outline' },
    component: 'FarmsNavigator',
    roles: ['farm']
  },
  {
    key: 'FarmStates',
    title: 'Farm States',
    icon: { focused: 'pie-chart', unfocused: 'pie-chart-outline' },
    component: 'FarmStatesScreen',
    roles: ['farm']
  },
  {
    key: 'Capture',
    title: 'Capture',
    icon: { focused: 'camera', unfocused: 'camera-outline' },
    component: 'CaptureScreen',
    roles: ['farm', 'logistics']
  },
  {
    key: 'Orders',
    title: 'Orders',
    icon: { focused: 'receipt', unfocused: 'receipt-outline' },
    component: 'OrdersNavigator',
    roles: ['farm', 'logistics', 'exporter', 'buyer']
  },
  {
    key: 'Analytics',
    title: 'Analytics',
    icon: { focused: 'stats-chart', unfocused: 'stats-chart-outline' },
    component: 'AnalyticsNavigator',
    roles: ['farm', 'exporter', 'buyer']
  },
  {
    key: 'Profile',
    title: 'Profile',
    icon: { focused: 'person', unfocused: 'person-outline' },
    component: 'ProfileScreen',
    roles: ['admin', 'farm', 'logistics', 'exporter', 'buyer']
  }
];

// Get tabs visible to a specific user role
export const getTabsForRole = (role: UserRole): UnifiedTab[] => {
  return UNIFIED_TABS.filter(tab => tab.roles.includes(role));
};

// Get initial tab for a user role
export const getInitialTabForRole = (role: UserRole): string => {
  const availableTabs = getTabsForRole(role);
  
  // Role-specific preferences for initial tab
  switch (role) {
    case 'admin':
      return 'AdminDashboard';
    case 'farm':
      return 'Analytics';
    case 'logistics':
      return 'Orders';
    case 'exporter':
    case 'buyer':
      return 'Orders';
    default:
      return availableTabs[0]?.key || 'Home';
  }
};