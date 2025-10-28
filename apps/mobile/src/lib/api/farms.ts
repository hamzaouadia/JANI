import { operationsClient } from './operationsClient';

export interface FarmPlot {
  id: string;
  name: string;
  hectares: number;
  crop: string;
  stage: string;
  linked: boolean;
  lastSync: string | null;
  sensors: {
    soilMoisture: string;
    weatherStation: boolean;
    logisticsPartner?: string | null;
  };
  nextActions: string[];
}

export interface FarmSummary {
  totalPlots: number;
  linkedPlots: number;
  totalHectares: number;
  pendingTasks: number;
}

export interface Farm {
  id: string;
  ownerRole?: string;
  ownerIdentifier?: string;
  name: string;
  primaryCrop: string;
  locationDescription: string | null;
  linked: boolean;
  lastSync: string | null;
  credentials: {
    registrationId: string;
    pin?: string | null;
  };
  nextActions: string[];
  status?: 'active' | 'inactive' | 'dormant';
  tags?: string[];
  summary: FarmSummary;
  plots: FarmPlot[];
}

type FarmsResponse = {
  data: Farm[];
};

export const getFarms = async (): Promise<Farm[]> => {
  const response = await operationsClient.get<FarmsResponse>('/farms');
  return response.data?.data ?? [];
};

export const getFarmById = async (farmId: string): Promise<Farm> => {
  const response = await operationsClient.get<{ data: Farm }>(`/farms/${farmId}`);
  const farm = response.data?.data;
  if (!farm) {
    throw new Error(`Farm ${farmId} not found`);
  }
  return farm;
};
