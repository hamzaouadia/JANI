import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { loginRequest, signupRequest, type AuthResponse, type AuthUser } from '@/features/auth/api/authApi';
import { apiClient, setUnauthorizedHandler } from '@/lib/api/client';
import { operationsClient } from '@/lib/api/operationsClient';
import { traceabilityClient } from '@/lib/api/traceabilityClient';
import { deleteAuthToken, setAuthToken } from '@/storage/tokenStorage';
import type { UserRole } from '@/constants/userRoles';

type StoredSession = {
  token: string;
  user: AuthUser;
};

type AuthState = {
  hydrated: boolean;
  loading: boolean;
  user: AuthUser | null;
  token: string | null;
  hydrate: () => Promise<void>;
  login: (_credentials: { role: UserRole; identifier: string; password: string }) => Promise<void>;
  signup: (
    _payload: {
      email: string;
      password: string;
      role: UserRole;
      identifier: string;
      profile: Record<string, string>;
    }
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (_payload: { email?: string; profile?: Record<string, string> }) => Promise<void>;
};

const STORAGE_KEY = 'jani-auth-session';

const toSession = ({ accessToken, user }: AuthResponse): StoredSession => ({
  token: accessToken,
  user
});

const readStoredSession = async (): Promise<StoredSession | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
};

const writeStoredSession = async (session: StoredSession | null) => {
  if (!session) {
    await Promise.all([AsyncStorage.removeItem(STORAGE_KEY), deleteAuthToken()]);
    return;
  }

  await Promise.all([
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session)),
    setAuthToken(session.token)
  ]);
};

export const useAuthStore = create<AuthState>((set, get) => {
  const applySession = (session: StoredSession | null) => {
    if (session) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${session.token}`;
      operationsClient.defaults.headers.common.Authorization = `Bearer ${session.token}`;
      traceabilityClient.defaults.headers.common.Authorization = `Bearer ${session.token}`;
      set({ user: session.user, token: session.token });
    } else {
      delete apiClient.defaults.headers.common.Authorization;
      delete operationsClient.defaults.headers.common.Authorization;
      delete traceabilityClient.defaults.headers.common.Authorization;
      set({ user: null, token: null });
    }
  };

  const finalize = (session: StoredSession | null) => {
    applySession(session);
    set({ hydrated: true, loading: false });
  };

  return {
    hydrated: false,
    loading: false,
    user: null,
    token: null,
    hydrate: async () => {
      if (get().hydrated) {
        return;
      }

      set({ loading: true });

      const session = await readStoredSession();
      finalize(session);
    },
    login: async (credentials) => {
      set({ loading: true });

      try {
        const response = await loginRequest(credentials);
        if (!response?.accessToken) {
          console.warn('[authStore] login received unexpected response', response);
          throw new Error('Unexpected login response. Check API_BASE_URL.');
        }

        const session = toSession(response);
        console.log('[authStore] login success', {
          role: session.user?.role,
          identifier: session.user?.identifier
        });
        await writeStoredSession(session);
        finalize(session);
      } catch (error) {
        await writeStoredSession(null);
        finalize(null);
        throw error;
      }
    },
    signup: async (payload) => {
      set({ loading: true });

      try {
        const response = await signupRequest(payload);
        if (!response?.accessToken) {
          console.warn('[authStore] signup received unexpected response', response);
          throw new Error('Unexpected signup response. Check API_BASE_URL.');
        }

        const session = toSession(response);
        console.log('[authStore] signup success', {
          role: session.user?.role,
          identifier: session.user?.identifier
        });
        await writeStoredSession(session);
        finalize(session);
      } catch (error) {
        await writeStoredSession(null);
        finalize(null);
        throw error;
      }
    },
    logout: async () => {
      set({ loading: true });
      await writeStoredSession(null);
      finalize(null);
    },
    updateProfile: async ({ email, profile }) => {
      const current = get().user;
      const token = get().token;
      if (!current || !token) return;
      // Local update; API call could be added here if available
      const updatedUser: AuthUser = {
        ...current,
        email: email ?? current.email,
        profile: { ...current.profile, ...(profile ?? {}) }
      };
      const session: StoredSession = { token, user: updatedUser };
      await writeStoredSession(session);
      set({ user: updatedUser });
    }
  };
});

let isHandlingUnauthorized = false;

setUnauthorizedHandler(async () => {
  const { token, user, logout } = useAuthStore.getState();
  if ((!token && !user) || isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;

  try {
    await logout();
  } catch (error) {
    console.warn('[authStore] failed to logout after 401', error);
  } finally {
    isHandlingUnauthorized = false;
  }
});
