import { useRepository } from '@/src/infra/repositories/RepositoryProvider';
import { useAppQuery } from '@/src/infra/operations/useAppQuery';

export function useRelatedCities(id: string) {
  const { city } = useRepository();
  return useAppQuery(() => city.getRelatedCities(id), [id]);
}
