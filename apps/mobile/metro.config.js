const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro treats WebAssembly files as static assets so expo-sqlite's web worker can load them.
config.resolver.assetExts = config.resolver.assetExts ?? [];
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

if (config.resolver.sourceExts) {
  config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== 'wasm');
}

module.exports = config;
