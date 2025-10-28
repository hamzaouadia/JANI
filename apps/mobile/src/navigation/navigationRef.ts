import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from '@/navigation/types';

type RootRouteName = Extract<keyof RootStackParamList, string>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

let pendingRoute: RootRouteName | null = null;

const performReset = (route: RootRouteName) => {
  navigationRef.reset({
    index: 0,
    routes: [{ name: route }]
  });
};

export const resetRoot = (route: RootRouteName) => {
  if (navigationRef.isReady()) {
    performReset(route);
    pendingRoute = null;
  } else {
    pendingRoute = route;
  }
};

export const handleNavigationReady = () => {
  if (pendingRoute && navigationRef.isReady()) {
    performReset(pendingRoute);
    pendingRoute = null;
  }
};
