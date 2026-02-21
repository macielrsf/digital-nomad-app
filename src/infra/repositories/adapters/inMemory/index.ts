import { Repositories } from '@/src/domain/Repositories';
import { InMemoryAuthRepo } from './InMemoryAuthRepo';
import { InMemoryCityRepo } from './InMemoryCityRepo';
import { InMemoryCategoryRepo } from './InMemoryCategoryRepo';

export const InMemoryRepositories: Repositories = {
  auth: new InMemoryAuthRepo(),
  city: new InMemoryCityRepo(),
  category: new InMemoryCategoryRepo(),
};
