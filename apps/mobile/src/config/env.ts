import Constants from 'expo-constants';

const resolveApiBaseUrl = () => {
  const runtimeValue = Constants.expoConfig?.extra?.apiBaseUrl ?? process.env.API_BASE_URL;

  if (!runtimeValue) {
    throw new Error('API_BASE_URL is not set. Define it in app config or environment.');
  }

  return runtimeValue;
};

export const ENV = {
  API_BASE_URL: resolveApiBaseUrl()
};
