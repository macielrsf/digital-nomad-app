import { useEffect, useState } from 'react';
import { supabaseService } from '../supabase/supabaseService';
import { CityPreview } from '../types';

type CityFilter = {
  name?: string;
  categoryId?: string | null;
};

type UseCitiesReturn = {
  cities?: CityPreview[];
  isLoading: boolean;
  error: unknown;
};

export function useCities({ name, categoryId }: CityFilter): UseCitiesReturn {
  const [cities, setCities] = useState<CityPreview[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      const cities = await supabaseService.findAll();
      setCities(cities);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return {
    cities,
    isLoading,
    error,
  };
}
