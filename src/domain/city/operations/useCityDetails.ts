import { useRepository } from '@/src/infra/repositories/RepositoryProvider';
import { useAppQuery } from '@/src/infra/operations/useAppQuery';

export function useCityDetails(id: string) {
  const { city } = useRepository();
  return useAppQuery(() => city.findById(id), [id]);
}
