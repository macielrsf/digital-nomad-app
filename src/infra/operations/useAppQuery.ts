import { useQuery } from '@tanstack/react-query';

type UseFetchDataReturn<DataT> = {
  data?: DataT;
  isLoading: boolean;
  isPending: boolean;
  error: unknown;
};

type UseAppQueryParams<DataT> = {
  queryKey: (string | null | undefined | number)[];
  fetchData: () => Promise<DataT>;
  enabled?: boolean;
  retry?: boolean;
};

export function useAppQuery<DataT>({
  enabled,
  fetchData,
  queryKey,
  retry = true,
}: UseAppQueryParams<DataT>): UseFetchDataReturn<DataT> {
  const { data, isLoading, error, isPending } = useQuery({
    queryKey,
    queryFn: fetchData,
    enabled,
    retry,
  });

  return {
    data,
    isLoading,
    isPending,
    error,
  };
}
