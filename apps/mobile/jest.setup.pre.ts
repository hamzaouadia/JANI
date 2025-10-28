jest.mock('expo/src/winter/runtime.native', () => ({}));
jest.mock('expo/src/winter/runtime', () => ({}));

// Stub expo-constants to avoid ESM parsing issues in Jest
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {},
}));
