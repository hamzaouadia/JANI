import { apiClient } from '@/lib/api/client';
import { operationsClient } from '@/lib/api/operationsClient';

export type HistoryEntry = { at: string; note?: string; change?: Record<string, unknown>; byUserId: string };
export type Farm = {
  _id: string;
  ownerUserId: string;
  name: string;
  identifier?: string;
  location?: string;
  status?: string;
  notes?: string;
  data?: Record<string, unknown>;
  history?: HistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
};

export async function listFarms({ mine = false }: { mine?: boolean } = {}): Promise<Farm[]> {
  const params = mine ? { mine: '1' } : undefined;
  const res = await apiClient.get('/farms', { params });
  return res.data as Farm[];
}

export type OperationsFarmSummary = {
  totalPlots: number;
  linkedPlots: number;
  totalHectares: number;
  pendingTasks: number;
};

export type OperationsField = {
  id: string;
  name: string;
  hectares?: number | null;
  crop?: string | null;
  stage?: string | null;
  linked: boolean;
  lastSync: string | null;
  sensors: {
    soilMoisture?: string;
    weatherStation: boolean;
    logisticsPartner: string | null;
  };
  nextActions: string[];
};

export type OperationsFarm = {
  id: string;
  ownerRole: string;
  ownerIdentifier: string;
  name: string;
  primaryCrop?: string;
  locationDescription: string | null;
  linked: boolean;
  lastSync: string | null;
  credentials: {
    registrationId: string;
    pin: string | null;
  };
  nextActions: string[];
  status?: 'active' | 'inactive' | 'dormant';
  tags: string[];
  summary: OperationsFarmSummary;
  plots: OperationsField[];
};

export async function listOperationsFarms(params: {
  linkedOnly?: boolean;
  ownerIdentifier?: string | null;
  ownerRole?: string | null;
} = {}): Promise<OperationsFarm[]> {
  const query: Record<string, string> = {};

  if (params.linkedOnly) {
    query.linked = 'true';
  }

  if (params.ownerIdentifier) {
    query.ownerIdentifier = params.ownerIdentifier;
  }

  if (params.ownerRole) {
    query.ownerRole = params.ownerRole;
  }

  const res = await operationsClient.get<{ data: OperationsFarm[] }>('/farms', {
    params: Object.keys(query).length ? query : undefined
  });

  return res.data?.data ?? [];
}

export type SearchFarmResult = {
  id: string;
  name: string;
  identifier: string;
  status?: 'active' | 'inactive' | 'dormant';
  linked: boolean;
  ownerRole?: string;
  ownerIdentifier?: string;
  primaryCrop?: string;
  updatedAt?: string | null;
};

export async function searchFarms(q: string): Promise<SearchFarmResult[]> {
  const trimmed = q.trim();
  if (!trimmed) {
    return [];
  }

  const res = await operationsClient.get<{ data: SearchFarmResult[] }>('/farms/search', {
    params: { q: trimmed }
  });

  return res.data?.data ?? [];
}

export async function linkFarm(payload: { farmId: string; accessCode: string }): Promise<{ farmId: string }> {
  const res = await operationsClient.post<{ data: { id: string } }>(
    `/farms/${payload.farmId}/link`,
    { accessCode: payload.accessCode }
  );
  const farm = res.data?.data;
  return { farmId: farm?.id ?? payload.farmId };
}

export async function getFarm(id: string): Promise<Farm> {
  const res = await apiClient.get(`/farms/${id}`);
  return res.data as Farm;
}

export async function createFarm(payload: { name: string; location?: string }): Promise<Farm> {
  const res = await apiClient.post('/farms', payload);
  return res.data as Farm;
}

export async function updateFarm(id: string, payload: Partial<Pick<Farm, 'name' | 'location' | 'status' | 'notes' | 'data'>> & { note?: string }): Promise<Farm> {
  const res = await apiClient.patch(`/farms/${id}`, payload);
  return res.data as Farm;
}

export async function getFarmHistory(id: string): Promise<HistoryEntry[]> {
  const res = await apiClient.get(`/farms/${id}/history`);
  return res.data as HistoryEntry[];
}

export async function appendFarmUpdate(id: string, payload: { change?: Record<string, unknown>; note?: string }) {
  const res = await apiClient.post(`/farms/${id}/updates`, payload);
  return res.data as { ok: boolean; history: HistoryEntry[] };
}
