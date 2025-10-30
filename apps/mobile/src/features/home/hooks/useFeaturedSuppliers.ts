import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';

import { getFeaturedSuppliers } from '../api/getFeaturedSuppliers';

export const useFeaturedSuppliers = (country?: string) =>
  useQuery({
    queryKey: [queryKeys.home.featuredSuppliers, country ?? 'All'],
    queryFn: () => getFeaturedSuppliers(country),
    // Keep a short stale time so switching tabs triggers a refetch when needed
    staleTime: 1000 * 60
  });
