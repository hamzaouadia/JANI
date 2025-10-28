import axios from 'axios';
import { apiClient } from '@/lib/api/client';

export type CollectionPayload = {
  farmId?: string;
  commodity: string;
  weightKg: number;
  pricePerKg: number;
  collectedAt?: string; // ISO date
  notes?: string;
};

export type Collection = {
  id: string;
  farmId?: string;
  commodity: string;
  weightKg: number;
  pricePerKg: number;
  status: 'pending' | 'paid';
  collectedAt: string;
  createdAt: string;
};

const normalizeError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const message =
      (typeof error.response?.data?.error === 'string' && error.response.data.error) ||
      'Collection request failed. Please try again.';

    return new Error(message);
  }

  return new Error('Unexpected collections error.');
};

export const createCollection = async (payload: CollectionPayload): Promise<Collection> => {
  try {
    const { data } = await apiClient.post<Collection>('/collections', payload);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};
