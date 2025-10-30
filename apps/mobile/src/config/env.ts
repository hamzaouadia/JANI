import Constants from 'expo-constants';
import { Platform } from 'react-native';

const resolveUrl = (raw?: string | null, label?: string, fallback?: string) => {
  const input = raw?.trim();
  if (!input) {
    if (fallback) {
      console.warn(`${label ?? 'URL'} is not set. Using fallback: ${fallback}`);
      return fallback;
    }
    throw new Error(`${label ?? 'URL'} is not set. Define it in app config or environment.`);
  }
  try {
    const url = new URL(input);
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';
    if (Platform.OS === 'android' && isLocalhost) {
      // Android emulator cannot reach host's localhost; use 10.0.2.2
      url.hostname = '10.0.2.2';
      return url.toString();
    }
    return input;
  } catch {
    return input;
  }
};

const apiBaseRaw = Constants.expoConfig?.extra?.apiBaseUrl ?? process.env.API_BASE_URL;
const authBaseRaw = Constants.expoConfig?.extra?.authBaseUrl ?? process.env.AUTH_BASE_URL;
const traceabilityBaseRaw = Constants.expoConfig?.extra?.traceabilityBaseUrl ?? process.env.TRACEABILITY_BASE_URL;
const operationsBaseRaw = Constants.expoConfig?.extra?.operationsBaseUrl ?? process.env.OPERATIONS_BASE_URL;

export const ENV = {
  API_BASE_URL: resolveUrl(apiBaseRaw, 'API_BASE_URL', 'http://localhost:5000'),
  AUTH_BASE_URL: resolveUrl(authBaseRaw, 'AUTH_BASE_URL', 'http://localhost:4000'),
  TRACEABILITY_BASE_URL: resolveUrl(traceabilityBaseRaw, 'TRACEABILITY_BASE_URL', 'http://localhost:4002'),
  // Operations service exposes routes under the /api prefix (eg. /api/farms).
  // Default to include the /api prefix so client calls like '/farms' become
  // 'http://localhost:4003/api/farms' against the operations service.
  OPERATIONS_BASE_URL: resolveUrl(operationsBaseRaw, 'OPERATIONS_BASE_URL', 'http://localhost:4003/api')
};
