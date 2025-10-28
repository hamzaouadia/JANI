import { authClient } from './authClient';

export interface Partner {
  id: string;
  name: string;
  role: 'buyer' | 'exporter' | 'logistics' | 'advisor';
  status: 'active' | 'pending' | 'invited';
  notes: string;
}

type PartnersResponse = {
  partners: Partner[];
};

export const getPartners = async (): Promise<Partner[]> => {
  const response = await authClient.get<PartnersResponse>('/data/partners');
  return response.data.partners ?? [];
};
