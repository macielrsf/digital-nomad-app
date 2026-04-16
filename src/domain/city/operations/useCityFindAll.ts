import { useQuery } from '@tanstack/react-query';

import { useRepository } from '@/src/infra/repositories/RepositoryProvider';
import { CityFindAllFilters } from '../ICityRepo';

export function useCityFindAll(filters: CityFindAllFilters) {
  const { city } = useRepository();

  const { data, isLoading, error } = useQuery({
    queryKey: ['cities', filters],
    queryFn: () => city.findAll(filters),
  });

  return {
    data,
    isLoading,
    error,
  };
}
