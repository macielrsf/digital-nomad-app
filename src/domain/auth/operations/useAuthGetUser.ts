import { useAppQuery } from '@/src/infra/operations/useAppQuery';
import { useRepository } from '@/src/infra/repositories/RepositoryProvider';

type UseAuthGetUserOptions = {
  enabled?: boolean;
};

export function useAuthGetUser(options?: UseAuthGetUserOptions) {
  const { auth } = useRepository();

  return useAppQuery({
    queryKey: ['user'],
    fetchData: () => auth.getUser(),
    enabled: options?.enabled,
    retry: false,
  });
}
