import { Repositories } from '@/src/domain/Repositories';
import { InMemoryCityRepo } from './InMemoryCityRepo';
import { InMemoryCategoryRepo } from './InMemoryCategoryRepo';

export const InMemoryRepositories: Repositories = {
  city: new InMemoryCityRepo(),
  category: new InMemoryCategoryRepo(),
};
