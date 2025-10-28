const jestExpoPreset = require('jest-expo/jest-preset');

const reactNativeSetupPath = require.resolve('react-native/jest/setup.js');
const setupFilesFromPreset = (jestExpoPreset.setupFiles || []).map((file) =>
  file === reactNativeSetupPath ? '<rootDir>/jest.react-native.setup.js' : file
);

const setupFilesAfterEnv = Array.from(
  new Set([
    ...(jestExpoPreset.setupFilesAfterEnv || []),
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.ts',
  ])
);

module.exports = {
  ...jestExpoPreset,
  setupFiles: ['<rootDir>/jest.setup.pre.ts', ...setupFilesFromPreset],
  setupFilesAfterEnv,
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native(?:/js-polyfills)?|expo(nent)?|@expo|expo-modules-core|expo-constants|expo-font|expo-asset|expo-status-bar|expo-file-system|expo-sqlite|expo-task-manager|expo-background-fetch|expo-linear-gradient|@react-navigation|@tanstack|nanoid|react-native-vector-icons|react-native-reanimated|react-native-gesture-handler|@react-native-async-storage|react-native-worklets)/)'
  ],
  testPathIgnorePatterns: [
    ...(jestExpoPreset.testPathIgnorePatterns || []),
    '/android/',
    '/ios/',
  ],
  moduleNameMapper: {
    ...(jestExpoPreset.moduleNameMapper || {}),
    '^expo$': '<rootDir>/src/__mocks__/expoMock.ts',
    '^expo/src/winter/.*$': '<rootDir>/src/__mocks__/expoWinterMock.ts',
    '^expo-sqlite/next$': '<rootDir>/src/__mocks__/expoSqliteNextMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
