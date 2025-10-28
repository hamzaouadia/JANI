import { authClient } from './authClient';

export type OrderStatus = 'preparing' | 'awaiting_pickup' | 'in_transit' | 'delayed' | 'delivered';

export interface Order {
  id: string;
  reference: string;
  partner: string;
  destination: string;
  status: OrderStatus;
  dueDate: string;
  quantity: string;
  value: string;
  lastUpdated: string;
  highlights?: string[];
}

export interface OrdersSummaryItem {
  id: string;
  label: string;
  value: string;
  helper?: string;
}

type OrdersResponse = {
  orders: Order[];
  summary: OrdersSummaryItem[];
};

export const getOrders = async (): Promise<OrdersResponse> => {
  const response = await authClient.get<OrdersResponse>('/data/orders');
  return response.data;
};
