import { cities } from './cities';

export function useCityDetails(id: string) {
  return cities.find(city => city.id === id);
}
