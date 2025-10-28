import axios from 'axios';

import { apiClient } from '@/lib/api/client';

export type OrderStatus = 'preparing' | 'awaiting_pickup' | 'in_transit' | 'delayed' | 'delivered';

export type OrderRecord = {
  id: string;
  reference: string;
  partner: string;
  destination: string;
  status: OrderStatus;
  dueDate: string;
  quantity: string;
  value: string;
  lastUpdated: string;
  highlights: string[];
};

export type OrderSummaryMetric = {
  id: string;
  label: string;
  value: string;
  helper?: string;
};

type OrdersResponse = {
  orders: OrderRecord[];
  summary: OrderSummaryMetric[];
};

const normalizeError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message =
      (typeof error.response?.data?.error === 'string' && error.response.data.error) ||
      'Unable to load orders. Please try again.';
    return new Error(message);
  }

  return new Error('Unexpected orders error.');
};

export const fetchOrders = async (): Promise<OrdersResponse> => {
  try {
    const { data } = await apiClient.get<OrdersResponse>('/data/orders');
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};
