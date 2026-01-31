export type CategoryCode =
  | 'ADVENTURE'
  | 'BEACH'
  | 'CULTURE'
  | 'HISTORY'
  | 'LUXURY'
  | 'FAVORITE'
  | 'GASTRONOMY'
  | 'NATURE'
  | 'SHOPPING'
  | 'URBAN';

export type Category = {
  id: string;
  name: string;
  description: string | null;
  code: CategoryCode;
};

export type TouristAttraction = {
  id: string;
  name: string;
  description: string;
  cityId: string;
};

export type City = {
  id: string;
  name: string;
  country: string;
  description: string;
  coverImage: number | string;
  categories: Category[];
  touristAttractions: TouristAttraction[];
  // relatedCitiesIds: string[];
  location: {
    latitude: number;
    longitude: number;
  };
};

export type CityPreview = Pick<
  City,
  'id' | 'name' | 'country' | 'coverImage' | 'categories'
>;
