import { supabase } from './supabase';
import { CityPreview } from '../types';

const storageURL = process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL;

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
      query = query.contains('categories', [{ id: filters.categoryId }]);
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

export const supabaseService = { findAll };
