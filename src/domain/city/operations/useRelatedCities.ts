import { useRepository } from '@/src/infra/repositories/RepositoryProvider';
import { useFetchData } from '@/src/data/useFetchData';

export function useRelatedCities(id: string) {
  const { city } = useRepository();
  return useFetchData(() => city.getRelatedCities(id), [id]);
}
