const fs = require('fs');
const os = require('os');
const path = require('path');
const { transformSync } = require('@babel/core');
const expoPreset = require('babel-preset-expo');
const transformWithExpoPreset = (source, filename) =>
  transformSync(source, {
    filename,
    presets: [expoPreset],
    sourceType: 'unambiguous',
    babelrc: false,
    configFile: false,
  });

const compileReactNativeSetup = () => {
  const sourcePath = require.resolve('react-native/jest/setup.js');
  const cacheDir = path.join(os.tmpdir(), 'jani-jest-cache');
  const outputPath = path.join(cacheDir, 'react-native-jest-setup.cjs');

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const source = fs.readFileSync(sourcePath, 'utf8');
  const result = transformWithExpoPreset(source, sourcePath);

  if (!result || !result.code) {
    throw new Error('Failed to transform react-native/jest/setup.js');
  }

  const sanitizedCode = result.code.replace(
    /require\(['"]@react-native\/js-polyfills\/error-guard['"]\);?/,
    '',
  );

  fs.writeFileSync(outputPath, sanitizedCode, 'utf8');
  require(outputPath);
};

compileReactNativeSetup();
