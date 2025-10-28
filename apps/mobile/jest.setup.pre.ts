jest.mock('expo/src/winter/runtime.native', () => ({}));
jest.mock('expo/src/winter/runtime', () => ({}));

// Stub expo-constants to avoid ESM parsing issues in Jest
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {},
}));

// Mock expo-sqlite for testing
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getFirstSync: jest.fn(),
    getAllSync: jest.fn(),
    closeSync: jest.fn(),
  })),
}));

