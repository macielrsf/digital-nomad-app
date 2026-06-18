import { City, CityPreview } from '../../../../domain/city/City';
import {
  CitiesGroupedByCategory,
  CityToggleFavoriteParams,
  ICityRepo,
} from '../../../../domain/city/ICityRepo';

import { supabase } from './supabase';
import { supabaseAdapter } from './supabaseAdapter';
import { supabaseHelpers } from './supabaseHelpers';

export type CityFilters = {
  name?: string;
  categoryId?: string | null;
};

const CITY_PREVIEW_FIELD = '*,favorite_cities!left(user_id)';

async function findAll(filters: CityFilters): Promise<CityPreview[]> {
  try {
    const user = await supabaseHelpers.getUserFromSession();

    let query = supabase
      .from('cities_with_full_info')
      .select(CITY_PREVIEW_FIELD)
      .eq('favorite_cities.user_id', user.id);

    if (filters.name) {
      query = query.ilike('name', `%${filters.name}%`);
    }

    if (filters.categoryId) {
      // Get city IDs that match the category filter
      const { data: cityIds } = await supabase
        .from('city_categories')
        .select('city_id')
        .eq('category_id', filters.categoryId);

      if (cityIds && cityIds.length > 0) {
        const ids = cityIds.map(row => row.city_id);
        query = query.in('id', ids);
      } else {
        // No cities match this category, return empty array
        return [];
      }
    }

    const { data } = await query;

    if (!data) {
      throw new Error('data is not available');
    }

    return data?.map(row => supabaseAdapter.toCityPreview(row));
  } catch (error) {
    throw error;
  }
}

async function findById(id: string): Promise<City> {
  const user = await supabaseHelpers.getUserFromSession();

  const { data, error } = await supabase
    .from('cities_with_full_info')
    .select('*,favorite_cities!left(user_id)')
    .eq('id', id)
    .eq('favorite_cities.user_id', user.id)
    .single();

  if (error) {
    throw new Error('city not found');
  }

  return supabaseAdapter.toCity(data);
}

async function getRelatedCities(cityId: string): Promise<CityPreview[]> {
  const user = await supabaseHelpers.getUserFromSession();

  const { data } = await supabase
    .from('related_cities')
    .select(CITY_PREVIEW_FIELD)
    .eq('source_city_id', cityId)
    .eq('favorite_cities.user_id', user.id)
    .throwOnError();

  return data.map(row => supabaseAdapter.toCityPreview(row));
}

async function toggleFavorite(params: CityToggleFavoriteParams): Promise<void> {
  const user = await supabaseHelpers.getUserFromSession();

  if (params.isFavorite) {
    await supabase
      .from('favorite_cities')
      .delete()
      .eq('user_id', user.id)
      .eq('city_id', params.cityId);
  } else {
    await supabase
      .from('favorite_cities')
      .insert({ city_id: params.cityId, user_id: user.id });
  }
}

async function findAllFavorites(): Promise<CityPreview[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('favorite cities user error', userError);
    throw new Error('invalid user');
  }

  const { data } = await supabase
    .from('favorite_cities')
    .select(
      `
  city_id,
  cities (
    id,
    name,
    country,
    cover_image
  )
  `
    )
    .eq('user_id', user.id)
    .throwOnError();

  return (data ?? []).flatMap(item => {
    const city = Array.isArray(item.cities) ? item.cities[0] : item.cities;

    if (!city) {
      return [];
    }

    return [supabaseAdapter.toCityPreview(city, true)];
  });
}

async function findGroupedByCategory(): Promise<CitiesGroupedByCategory[]> {
  const { data } = await supabase
    .from('categories')
    .select(
      `
      id,
      name,
      description,
      code,
      city_categories (
        cities(
          id,
          name,
          country,
          cover_image
        )
      )
    `
    )
    .throwOnError();

  return data.map(category => ({
    category: supabaseAdapter.toCategory({
      code: category.code,
      description: category.description,
      id: category.id,
      name: category.name,
    }),
    cities: category.city_categories.flatMap(item => {
      const city = Array.isArray(item.cities) ? item.cities[0] : item.cities;

      if (!city) {
        return [];
      }

      return [supabaseAdapter.toCityPreview(city)];
    }),
  }));
}

export const SupabaseCityRepo: ICityRepo = {
  findAll,
  findById,
  getRelatedCities,
  toggleFavorite,
  findAllFavorites,
  findGroupedByCategory,
};
