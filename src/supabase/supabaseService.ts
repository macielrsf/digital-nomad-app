import { supabase } from './supabase';
import { Category, CategoryCode, City, CityPreview } from '../types';
import { storageURL, supabaseAdapter } from './supabaseAdapter';

export type CityFilters = {
  name?: string;
  categoryId?: string | null;
};

async function findAll(filters: CityFilters): Promise<CityPreview[]> {
  try {
    let query = supabase.from('cities_with_full_info').select('*');

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

    return data?.map(row => ({
      id: row.id,
      country: row.country,
      name: row.name,
      coverImage: `${storageURL}/${row.cover_image}`,
      categories: row.categories || [],
    }));
  } catch (error) {
    throw error;
  }
}

async function listCategory(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    throw new Error('error trying to list categories');
  }

  return data.map(row => ({
    id: row.id,
    description: row.description,
    name: row.name,
    code: row.code as CategoryCode,
  }));
}

async function findById(id: string): Promise<City> {
  const { data, error } = await supabase
    .from('cities_with_full_info')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('city not found');
  }

  return supabaseAdapter.toCity(data);
}

export const supabaseService = { findAll, listCategory, findById };
