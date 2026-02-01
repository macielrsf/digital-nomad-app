import { Category, CategoryCode } from '../domain/category/Category';
import { ICategoryRepo } from '../domain/category/ICategoryRepo';

import { supabase } from './supabase';

async function findAll(): Promise<Category[]> {
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

export const supabaseCategoryRepo: ICategoryRepo = {
  findAll,
};
