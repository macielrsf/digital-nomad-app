import { supabaseService } from '../supabase/supabaseService';
import { useFetchData } from './useFetchData';

export function useRelatedCities(cityId: string) {
  return useFetchData(() => supabaseService.getRelatedCities(cityId));
}
