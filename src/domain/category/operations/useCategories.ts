import { useRepository } from '@/src/infra/repositories/RepositoryProvider';
import { useFetchData } from '@/src/data/useFetchData';

export function useCategories() {
  const { category } = useRepository();
  return useFetchData(() => category.findAll());
}
