import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import type { QueryClientConfig } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const QUERY_CACHE_KEY = 'jani-query-cache';

export const createPersistedQueryClient = (config?: QueryClientConfig) => {
  const queryClient = new QueryClient(config);

  const persister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: QUERY_CACHE_KEY
  });

  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 12
  });

  return queryClient;
};

