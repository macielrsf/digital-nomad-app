# Domain Layer (src/domain/)

## Overview

The **Domain Layer** is the heart of the application, containing all business logic, entities, and use cases. This layer is **framework-agnostic** and has no dependencies on React Native, Expo, or any external libraries (except TanStack Query for operations).

## Purpose

- Define the **ubiquitous language** of the application
- Encapsulate **business rules** and **domain logic**
- Provide clear **contracts** for data access (repository interfaces)
- Expose **operations** (use cases) as React hooks for UI consumption

## Structure

```
domain/
├── Repositories.ts                   # Central registry of all repositories
├── auth/                             # Authentication domain
│   ├── AuthContext.tsx               # Auth state management
│   ├── AuthUser.ts                   # User entity
│   ├── IAuthRepo.ts                  # Auth repository interface
│   └── operations/                   # Auth use cases
│       ├── useAuthSignIn.ts
│       └── useAuthSignOut.ts
├── category/                         # Category domain
│   ├── Category.ts                   # Category entity
│   ├── ICategoryRepo.ts              # Category repository interface
│   └── operations/
│       └── useCategoryFindAll.ts
└── city/                             # City domain
    ├── City.ts                       # City entity
    ├── ICityRepo.ts                  # City repository interface
    └── operations/                   # City use cases
        ├── useCityDetails.ts
        ├── useCityFindAll.ts
        ├── useCityFindById.ts
        ├── useGetRelatedCities.ts
        └── useRelatedCities.ts
```

## Core Concepts

### 1. Entities

**Entities** are domain objects with identity and business rules.

```typescript
// src/domain/city/City.ts
export type City = {
  id: string;
  name: string;
  country: string;
  description: string;
  image_url: string;
  cost_of_living: number;
  internet_speed: number;
  safety_score: number;
  categories: Category[];
  created_at: string;
};
```

**Design Rules**:

- Entities are **immutable** (TypeScript types, not classes)
- Use TypeScript `type` or `interface` for entity definitions
- Include only business-relevant properties
- Avoid getter/setters, keep data structures simple (easier for React)

### 2. Repository Interfaces

**Repository interfaces** define contracts for data access without exposing implementation details.

```typescript
// src/domain/city/ICityRepo.ts
export interface ICityRepo {
  findAll(filters?: CityFilters): Promise<City[]>;
  findById(id: string): Promise<City | null>;
  getRelatedCities(cityId: string): Promise<City[]>;
}
```

**Design Rules**:

- Use `I` prefix for interface names (e.g., `ICityRepo`)
- Methods return `Promise<T>` for async operations
- Use domain entities, never infrastructure types (e.g., Supabase types)
- Keep interfaces focused (Interface Segregation Principle)
- Return `null` for not-found cases, throw errors for actual failures

**Dependency Inversion Principle Applied**:

Repository interfaces are the **key to Dependency Inversion** in this architecture:

1. **Domain defines the abstraction** (what data access is needed)
2. **Infrastructure implements the abstraction** (how to access data)
3. **Domain depends on its own abstractions**, not on infrastructure
4. **Infrastructure depends on domain abstractions** (inverted dependency)

This means:

- Domain code never imports from `infra/` (no Supabase, no database code)
- Infrastructure code imports interfaces from `domain/`
- You can change from Supabase to Firebase without touching domain
- Tests can use in-memory implementations without mocking external libraries

### 3. Operations (Use Cases)

**Operations** are business use cases exposed as React hooks.

```typescript
// src/domain/city/operations/useCityFindAll.ts
import { useAppQuery } from '@/src/infra/operations/useAppQuery';
import { useRepositories } from '@/src/domain/Repositories';

export function useCityFindAll(filters?: CityFilters) {
  const repositories = useRepositories();

  return useAppQuery({
    queryKey: ['cities', 'list', filters],
    queryFn: async () => {
      return await repositories.city.findAll(filters);
    },
  });
}
```

**Design Rules**:

- Always use `useAppQuery` (reads) or `useAppMutation` (writes)
- One operation = one business use case
- Name with `use` prefix (React hook convention)
- Accept necessary parameters only
- Return TanStack Query result object
- Define clear `queryKey` for caching identification

**Query Keys Convention**:

```typescript
// Format: [domain, operation, ...params]
['cities', 'list', filters][('cities', 'details', cityId)][
  ('cities', 'related', cityId)
][('categories', 'list')][('auth', 'user')];
```

### 4. Contexts

**Contexts** manage domain-specific state that needs to be shared across the app.

```typescript
// src/domain/auth/AuthContext.tsx
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Design Rules**:

- Use contexts sparingly (prefer React Query for server state)
- Provide a custom hook for accessing context (`useAuth`, `useTheme`)
- Throw error if used outside provider
- Keep context value minimal and focused

## Business Rules

### Authentication

- Users must sign in with email/password
- Passwords must meet minimum security requirements (handled by Supabase)
- Sessions are managed with JWT tokens
- Protected routes require valid authentication

### Cities

- Cities have categories (many-to-many relationship)
- Related cities are based on similar categories
- Cities can be favorited by users (future feature)
- Cost of living, internet speed, and safety scores are numeric ratings

### Categories

- Categories classify cities (e.g., "Beach", "Mountain", "Urban")
- Categories have names and optional icons
- A city can belong to multiple categories

### Filtering

- Cities can be filtered by:
  - Search term (name, country, description)
  - Categories (one or multiple)
  - Cost of living range
  - Internet speed minimum
  - Safety score minimum

## Domain Events (Future)

Not currently implemented, but the architecture supports:

- City favorited/unfavorited
- User profile updated
- Search performed (analytics)

## Validation Rules

### Email

- Must be valid email format
- Required for sign-up and sign-in

### Password

- Minimum 6 characters (enforced by Supabase)
- Required for sign-up and sign-in

### City Filters

- Cost of living: 0-5 scale
- Internet speed: Mbps (positive numbers)
- Safety score: 0-10 scale

## Error Handling

Operations should handle errors gracefully:

```typescript
export function useCityFindById(cityId: string) {
  return useAppQuery({
    queryKey: ['cities', 'details', cityId],
    queryFn: async () => {
      const city = await repositories.city.findById(cityId);
      if (!city) {
        throw new Error('City not found');
      }
      return city;
    },
    enabled: !!cityId, // Only run if cityId exists
  });
}
```

**Error Handling Rules**:

- Let repository throw errors for network/server failures
- Throw user-friendly errors in operations
- Use TanStack Query's error handling (`isError`, `error`)
- Show user feedback via FeedbackService

## Repositories Registry

All repositories are accessed through a central registry:

```typescript
// src/domain/Repositories.ts
export type Repositories = {
  auth: IAuthRepo;
  city: ICityRepo;
  category: ICategoryRepo;
};

export const RepositoriesContext = createContext<Repositories | undefined>(
  undefined
);

export function useRepositories(): Repositories {
  const context = useContext(RepositoriesContext);
  if (!context) {
    throw new Error('useRepositories must be used within RepositoryProvider');
  }
  return context;
}
```

**Benefits**:

- Single source of truth for all repositories
- Easy to mock in tests
- Type-safe repository access
- Clear dependency declaration

## Testing Domain Layer

### Unit Tests

```typescript
// Mock repositories
const mockCityRepo: ICityRepo = {
  findAll: jest.fn().mockResolvedValue([mockCity1, mockCity2]),
  findById: jest.fn().mockResolvedValue(mockCity1),
  getRelatedCities: jest.fn().mockResolvedValue([mockCity2]),
};

// Test operations with mocked repos
```

### Integration Tests

```typescript
// Use InMemoryRepo implementations
const inMemoryCityRepo = new InMemoryCityRepo();

// Test full flow with real implementations
```

## Best Practices

1. **Keep domain pure**: No React Native or Expo imports (except React hooks)
2. **No side effects in entities**: Entities are data structures only
3. **Operations are the interface**: UI never calls repositories directly
4. **Type everything**: Strict TypeScript with no `any`
5. **Return domain types**: Never expose infrastructure types (e.g., Supabase types)
6. **Single responsibility**: One operation does one thing
7. **Descriptive names**: Operation names clearly indicate what they do

## Name Conventions

- **Entities**: PascalCase noun (e.g., `City`, `AuthUser`, `Category`)
- **Interfaces**: `I` + PascalCase (e.g., `ICityRepo`, `IAuthRepo`)
- **Operations**: `use` + Entity + Verb (e.g., `useCityFindAll`, `useAuthSignIn`)
- **Context**: PascalCase + `Context` (e.g., `AuthContext`)
- **Custom hooks**: `use` + PascalCase (e.g., `useAuth`, `useRepositories`)

## Notes for AI Agents

- Domain layer is the **most important** layer - protect it from external dependencies
- **Dependency Inversion**: Domain defines abstractions (interfaces), infrastructure implements them
- **Never import from infra**: Domain must never import anything from `src/infra/`
- Always create domain types, never use third-party types directly (e.g., Supabase types)
- Operations must use `useAppQuery` or `useAppMutation` wrappers
- Repository interfaces define **what** (contract), infrastructure defines **how** (implementation)
- Keep operations focused - one operation, one use case
- Query keys are critical for caching - follow the convention
- When adding new features, **start with domain** entities and interfaces first
- Domain should be **testable without any infrastructure** (use in-memory implementations)
- **DIP enables**: swapping implementations, testing without mocks, framework independence
