# Infrastructure Layer (src/infra/)

## Overview

The **Infrastructure Layer** contains all implementation details and external integrations. This layer implements domain contracts (repository interfaces) and provides concrete adapters for external services.

**Critical Architectural Note**: This layer **depends on the domain layer** (not the other way around), following the **Dependency Inversion Principle (DIP)**. Infrastructure imports and implements interfaces defined in domain, while domain remains completely unaware of infrastructure details.

## Purpose

- **Implement** domain repository interfaces (DIP: depend on domain abstractions)
- **Integrate** with external services (Supabase, AsyncStorage, etc.)
- **Provide** dependency injection via React Context providers
- **Abstract** implementation details from domain and UI layers
- **Invert dependencies**: Infrastructure knows about domain, domain doesn't know about infrastructure

## Structure

```
infra/
├── operations/                       # Query/mutation wrappers
│   ├── useAppQuery.ts                # TanStack Query wrapper for reads
│   └── useAppMutation.ts             # TanStack Query wrapper for writes
├── repositories/                     # Repository implementations
│   ├── RepositoryProvider.tsx        # DI provider
│   └── adapters/                     # Concrete implementations
│       ├── supabase/                 # Production adapters
│       │   ├── SupabaseAuthRepo.ts
│       │   ├── SupabaseCityRepo.ts
│       │   └── SupabaseCategoryRepo.ts
│       └── inMemory/                 # Test/offline adapters
│           ├── InMemoryAuthRepo.ts
│           ├── InMemoryCityRepo.ts
│           └── InMemoryCategoryRepo.ts
├── storage/                          # Storage abstractions
│   ├── IStorage.ts                   # Storage interface
│   ├── StorageContext.tsx            # Storage provider
│   └── adapters/                     # Storage implementations
│       ├── AsyncStorageAdapter.ts    # React Native AsyncStorage
│       └── InMemoryStorageAdapter.ts # In-memory (testing)
└── feedbackService/                  # User feedback system
    ├── IFeedbackService.ts           # Feedback interface
    ├── FeedbackProvider.tsx          # Feedback provider
    └── adapters/                     # Feedback implementations
        ├── Alert/                    # React Native Alert
        └── Console/                  # Console logging (dev)
```

## Core Concepts

### 1. Repository Implementations

Repository implementations provide concrete data access logic.

```typescript
// src/infra/repositories/adapters/supabase/SupabaseCityRepo.ts
export class SupabaseCityRepo implements ICityRepo {
  constructor(private supabase: SupabaseClient) {}

  async findAll(filters?: CityFilters): Promise<City[]> {
    let query = this.supabase.from('cities').select('*, categories(*)');

    if (filters?.searchTerm) {
      query = query.ilike('name', `%${filters.searchTerm}%`);
    }

    if (filters?.categoryIds?.length) {
      query = query.contains('category_ids', filters.categoryIds);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data.map(this.mapToCity);
  }

  private mapToCity(dbCity: any): City {
    // Map Supabase row to domain entity
    return {
      id: dbCity.id,
      name: dbCity.name,
      country: dbCity.country,
      // ... map all fields
    };
  }
}
```

**Design Rules**:

- Implement domain repository interfaces
- Handle all infrastructure errors
- Map database DTOs to domain entities
- Never expose infrastructure types to domain
- Use dependency injection for external clients (Supabase, etc.)

### 2. Adapter Pattern

Multiple implementations of the same interface for different contexts.

**Production Adapters** (`adapters/supabase/`):

- Use Supabase client for real API calls
- Handle authentication, errors, and retries
- Implement caching when needed

**Test Adapters** (`adapters/inMemory/`):

- Store data in memory (Map, Array)
- Deterministic behavior for tests
- No external dependencies
- Instant responses

**Benefits**:

- Testability: Use in-memory adapters in tests
- Flexibility: Swap implementations without changing domain
- Offline mode: Can fall back to local adapters

### 3. Operation Wrappers

Wrappers around TanStack Query for consistent usage.

```typescript
// src/infra/operations/useAppQuery.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useAppQuery<TData, TError = Error>(
  options: UseQueryOptions<TData, TError>
) {
  return useQuery<TData, TError>(options);
}
```

```typescript
// src/infra/operations/useAppMutation.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useFeedback } from '../feedbackService/FeedbackProvider';

export function useAppMutation<TData, TVariables, TError = Error>(
  options: UseMutationOptions<TData, TError, TVariables>
) {
  const feedback = useFeedback();

  return useMutation<TData, TError, TVariables>({
    ...options,
    onError: (error, variables, context) => {
      // Global error handling
      feedback.showError(error.message);
      options.onError?.(error, variables, context);
    },
  });
}
```

**Design Rules**:

- Provide consistent error handling
- Add logging/monitoring hooks
- Simplify TanStack Query configuration
- Extend with app-specific behavior

### 4. Dependency Injection

Use React Context to inject dependencies.

```typescript
// src/infra/repositories/RepositoryProvider.tsx
import { RepositoriesContext, Repositories } from '@/src/domain/Repositories';
import { SupabaseAuthRepo } from './adapters/supabase/SupabaseAuthRepo';
import { SupabaseCityRepo } from './adapters/supabase/SupabaseCityRepo';

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabase(); // Get Supabase client

  const repositories: Repositories = useMemo(() => ({
    auth: new SupabaseAuthRepo(supabase),
    city: new SupabaseCityRepo(supabase),
    category: new SupabaseCategoryRepo(supabase),
  }), [supabase]);

  return (
    <RepositoriesContext.Provider value={repositories}>
      {children}
    </RepositoriesContext.Provider>
  );
}
```

**Design Rules**:

- Instantiate all repositories in provider
- Use `useMemo` to prevent re-creation
- Inject dependencies (Supabase client, storage, etc.)
- Provide at app root (before any domain operations are used)

## Supabase Integration

### Client Setup

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Authentication

Supabase handles:

- Email/password authentication
- JWT token management
- Session persistence
- OAuth providers (future)

```typescript
// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Sign out
await supabase.auth.signOut();

// Get current session
const {
  data: { session },
} = await supabase.auth.getSession();
```

### Database Queries

Use Supabase's query builder:

```typescript
// Select with filters
const { data, error } = await supabase
  .from('cities')
  .select('*, categories(*)')
  .eq('country', 'Portugal')
  .gte('safety_score', 8)
  .order('name', { ascending: true });

// Insert
const { data, error } = await supabase
  .from('favorites')
  .insert({ user_id: userId, city_id: cityId });

// Update
const { data, error } = await supabase
  .from('users')
  .update({ name: 'New Name' })
  .eq('id', userId);

// Delete
const { data, error } = await supabase
  .from('favorites')
  .delete()
  .eq('id', favoriteId);
```

### Row Level Security (RLS)

Supabase RLS policies enforce security at the database level:

```sql
-- Users can only read their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can create own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Benefits**:

- Security enforced at database, not app
- No API can bypass security
- Multi-tenant support built-in

## Storage Abstraction

Abstract AsyncStorage behind an interface for flexibility.

```typescript
// src/infra/storage/IStorage.ts
export interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

**Use Cases**:

- Store auth tokens
- Cache data for offline mode
- Save user preferences
- Store draft data

## Feedback Service

Provide user feedback for operations.

```typescript
// src/infra/feedbackService/IFeedbackService.ts
export interface IFeedbackService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showInfo(message: string): void;
  showLoading(message: string): void;
  hideLoading(): void;
}
```

**Implementations**:

- **Alert**: React Native Alert (simple dialogs)
- **Console**: Console logging (development)
- **Toast** (future): Toast notifications (react-native-toast-message)

## Error Handling

### Repository Level

```typescript
async findById(id: string): Promise<City | null> {
  try {
    const { data, error } = await this.supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Supabase error
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch city: ${error.message}`);
    }

    return this.mapToCity(data);
  } catch (error) {
    // Network or unexpected errors
    throw new Error('Network error: Unable to fetch city');
  }
}
```

### Mutation Level

```typescript
export function useAppMutation<TData, TVariables, TError = Error>(
  options: UseMutationOptions<TData, TError, TVariables>
) {
  const feedback = useFeedback();

  return useMutation<TData, TError, TVariables>({
    ...options,
    onError: (error, variables, context) => {
      // Show user-friendly error
      feedback.showError(error.message);

      // Call custom error handler
      options.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      // Optional success feedback
      options.onSuccess?.(data, variables, context);
    },
  });
}
```

## Caching Strategy

TanStack Query provides automatic caching:

```typescript
// Cache for 5 minutes
staleTime: 5 * 60 * 1000,

// Keep in cache for 10 minutes after last use
cacheTime: 10 * 60 * 1000,

// Refetch on window focus
refetchOnWindowFocus: true,

// Retry failed requests 3 times
retry: 3,
```

**Cache Invalidation**:

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate all cities queries
await queryClient.invalidateQueries(['cities']);

// Invalidate specific city
await queryClient.invalidateQueries(['cities', 'details', cityId]);

// Update cache directly
queryClient.setQueryData(['cities', 'details', cityId], updatedCity);
```

## Testing Infrastructure

### Unit Tests

```typescript
// Test repository implementations with mocked Supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
};

const repo = new SupabaseCityRepo(mockSupabase as any);
const cities = await repo.findAll();
```

### Integration Tests

```typescript
// Use InMemory implementations
const repo = new InMemoryCityRepo();
await repo.add(mockCity);
const cities = await repo.findAll();
expect(cities).toHaveLength(1);
```

## Environment Configuration

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Access in code
process.env.EXPO_PUBLIC_SUPABASE_URL
```

## Performance Optimizations

1. **Query Deduplication**: TanStack Query automatically deduplicates identical queries
2. **Prefetching**: Prefetch data before navigation
3. **Pagination**: Use cursor-based pagination for large lists
4. **Lazy Loading**: Load images and heavy data on demand
5. **Memoization**: Cache computed values with `useMemo`

## Best Practices

1. **Never leak infrastructure types**: Always map to domain entities
2. **Handle all errors**: Don't let errors bubble up unhandled
3. **Use adapters for testing**: InMemory adapters for fast, deterministic tests
4. **Inject dependencies**: Never instantiate Supabase client directly in repos
5. **Type safety**: Use TypeScript generics for type-safe operations
6. **Centralize configuration**: All config in providers, not scattered
7. **Log operations**: Add logging for debugging and monitoring

## Notes for AI Agents

- Infrastructure implements **how**, domain defines **what**
- Always map Supabase types to domain types - never expose infrastructure types
- Repository classes should be instantiated once and injected
- Use InMemory adapters for tests - they're fast and deterministic
- Error messages should be user-friendly, not technical
- All async operations go through useAppQuery or useAppMutation
- Supabase client is singleton, repositories are not
- RLS policies are the primary security mechanism
- Cache invalidation is critical for data consistency
