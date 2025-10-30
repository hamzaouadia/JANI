import { getFarms, type Farm } from '@/lib/api';

export type Supplier = {
  id: string;
  name: string;
  category: string;
  country: string;
  rating: number;
  leadTimeDays: number;
};

// Map farms to suppliers
const parseCountry = (locationDescription: string | null): string => {
  if (!locationDescription) {
    return 'Morocco';
  }

  const parts = locationDescription
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.at(-1) ?? 'Morocco';
};

const mapFarmToSupplier = (farm: Farm): Supplier => {
  const country = parseCountry(farm.locationDescription);
  const category = farm.primaryCrop || 'Agriculture';
  const coverage = farm.summary.totalPlots ? farm.summary.linkedPlots / farm.summary.totalPlots : 0;
  const baseRating = 3.8;
  const rating = parseFloat((baseRating + Math.min(1, coverage * 1.5)).toFixed(1));
  const leadTimeDays = Math.max(5, 14 - Math.round(farm.summary.totalPlots * 1.5));

  return {
    id: farm.id,
    name: farm.name,
    category,
    country,
    rating,
    leadTimeDays,
  };
};

export const getFeaturedSuppliers = async (country?: string): Promise<Supplier[]> => {
  try {
    const farms = await getFarms(country ? { country } : undefined);

    const suppliers = farms
      .filter((farm) => farm.linked)
      .map(mapFarmToSupplier)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    return suppliers;
  } catch (error) {
    console.error('Failed to fetch featured suppliers:', error);
    // Return empty array on error
    return [];
  }
};
