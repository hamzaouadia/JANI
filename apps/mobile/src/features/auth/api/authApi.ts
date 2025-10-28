import axios from 'axios';

import { ENV } from '@/config/env';
import type { UserRole } from '@/constants/userRoles';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  identifier: string;
  profile: Record<string, string>;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type LoginPayload = {
  role: UserRole;
  identifier: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  role: UserRole;
  identifier: string;
  password: string;
  profile: Record<string, string>;
};

const normalizeError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const message =
      (typeof error.response?.data?.error === 'string' && error.response.data.error) ||
      'Authentication request failed. Please try again.';

    return new Error(message);
  }

  return new Error('Unexpected authentication error.');
};

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const { data } = await axios.post<AuthResponse>(`${ENV.AUTH_BASE_URL}/auth/login`, payload);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const signupRequest = async (payload: SignupPayload): Promise<AuthResponse> => {
  try {
    const { data } = await axios.post<AuthResponse>(`${ENV.AUTH_BASE_URL}/auth/signup`, payload);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};
