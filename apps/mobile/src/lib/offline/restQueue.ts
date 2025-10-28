import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const STORAGE_KEY = 'jani-rest-queue';

export type RestQueueItem = {
  id: string;
  method: AxiosRequestConfig['method'];
  url: string;
  body?: unknown;
  headers?: Record<string, string>;
  attempts: number;
  createdAt: string;
};

async function readQueue(): Promise<RestQueueItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RestQueueItem[]) : [];
  } catch {
    return [];
  }
}

async function writeQueue(queue: RestQueueItem[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export async function enqueueRest(item: Omit<RestQueueItem, 'id' | 'attempts' | 'createdAt'>) {
  const queue = await readQueue();
  const entry: RestQueueItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    attempts: 0,
    createdAt: new Date().toISOString(),
    ...item
  };
  queue.push(entry);
  await writeQueue(queue);
}

export async function processRestQueue(apiClient: AxiosInstance) {
  const queue = await readQueue();
  let changed = false;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      await apiClient.request({
        method: item.method,
        url: item.url,
        data: item.body,
        headers: item.headers
      });
      // Remove on success
      queue.splice(i, 1);
      i -= 1;
      changed = true;
    } catch (err: unknown) {
      item.attempts += 1;
      // Network error (no response) -> stop processing; try later
      const hasResponse = (err as { response?: unknown })?.response;
      if (!hasResponse) {
        break;
      }
      // For 4xx/5xx keep it for a few retries, then drop
      if (item.attempts > 5) {
        queue.splice(i, 1);
        i -= 1;
        changed = true;
      }
    }
  }

  if (changed) {
    await writeQueue(queue);
  }

  return changed;
}

export function initRestQueueProcessor(params: { apiClient: AxiosInstance; onProcessed?: () => void }) {
  // Attempt once on init
  void processRestQueue(params.apiClient).then((changed) => {
    if (changed) params.onProcessed?.();
  });

  // Re-run when connectivity returns
  const unsub = NetInfo.addEventListener((state) => {
    if (state.isConnected && state.isInternetReachable) {
      void processRestQueue(params.apiClient).then((changed) => {
        if (changed) params.onProcessed?.();
      });
    }
  });

  return () => unsub();
}
