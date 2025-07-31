import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useAppMutation } from '@/src/infra/operations/useAppMutation';
import { useRepository } from '@/src/infra/repositories/RepositoryProvider';
import { City } from '../City';
import { CityToggleFavoriteParams } from '../ICityRepo';

export function useCityToggleFavorite(params: Pick<City, 'id' | 'isFavorite'>) {
  const [isFavorite, setIsFavorite] = useState(params.isFavorite);
  const { city } = useRepository();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsFavorite(params.isFavorite);
  }, [params.isFavorite]);

  const mutation = useAppMutation<void, CityToggleFavoriteParams>({
    mutationFn: () => toggleFavorite(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['city'] });
    },
    onError: () => {
      setIsFavorite(prev => !prev);
    },
  });

  function toggleFavorite() {
    setIsFavorite(prev => !prev);

    return city.toggleFavorite({
      cityId: params.id,
      isFavorite,
    });
  }

  return {
    ...mutation,
    isFavorite,
  };
}
