import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';

import { getFeaturedSuppliers } from '../api/getFeaturedSuppliers';

export const useFeaturedSuppliers = () =>
  useQuery({
    queryKey: queryKeys.home.featuredSuppliers,
    queryFn: getFeaturedSuppliers
  });
