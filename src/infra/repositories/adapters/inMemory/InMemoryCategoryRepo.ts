import { ICategoryRepo } from '@/src/domain/category/ICategoryRepo';
import { categories } from '@/src/data/categories';

export class InMemoryCategoryRepo implements ICategoryRepo {
  async findAll() {
    return categories;
  }
}
