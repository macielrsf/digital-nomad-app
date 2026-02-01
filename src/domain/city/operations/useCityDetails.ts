import { useRepository } from '@/src/infra/repositories/RepositoryProvider';
import { useFetchData } from '@/src/data/useFetchData';

export function useCityDetails(id: string) {
  const { city } = useRepository();
  return useFetchData(() => city.findById(id), [id]);
}
