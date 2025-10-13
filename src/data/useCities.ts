import { CityPreview } from '../types';
import { cities } from './cities';

type CityFilterProps = {
  search: string;
  categoryId?: string | null;
};

export function useCities({ search, categoryId }: CityFilterProps): {
  cityPreviewList: CityPreview[];
} {
  let cityPreviewList: CityPreview[] = [...cities];

  if (search) {
    cityPreviewList = cityPreviewList.filter(city =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (categoryId) {
    cityPreviewList = cityPreviewList.filter(city =>
      city.categories.some(category => category.id === categoryId)
    );
  }

  return { cityPreviewList };
}
