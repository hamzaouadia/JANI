const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @param {{ config: import('expo/config').ExpoConfig }} param0
 */
module.exports = ({ config }) => {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const authBaseUrl = process.env.AUTH_BASE_URL || 'http://localhost:4000';
  const traceabilityBaseUrl = process.env.TRACEABILITY_BASE_URL || 'http://localhost:5002';
  const operationsBaseUrl = process.env.OPERATIONS_BASE_URL || 'http://localhost:4003';

  return {
    ...config,
    name: 'JANI Mobile',
    slug: 'jani-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'jani',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#DCFCE7'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.jani.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#DCFCE7'
      },
      edgeToEdgeEnabled: true,
      package: 'com.jani.app',
      predictiveBackGestureEnabled: false
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [...(config.plugins ?? []), 'expo-secure-store'],
    extra: {
      ...config.extra,
      apiBaseUrl,
      authBaseUrl,
      traceabilityBaseUrl,
      operationsBaseUrl
    }
  };
};
