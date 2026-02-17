import { ICategoryRepo } from '@/src/domain/category/ICategoryRepo';
import { categories } from '@/src/infra/repositories/adapters/inMemory/data/categories';

export class InMemoryCategoryRepo implements ICategoryRepo {
  async findAll() {
    return categories;
  }
}
