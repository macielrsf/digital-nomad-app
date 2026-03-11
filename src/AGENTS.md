# Source Layer (src/)

## Overview

The `src/` directory contains all application logic organized into three main layers following **Clean Architecture** principles inspired by **Domain-Driven Design (DDD)** and **SOLID** principles.

## Architecture Layers

### 1. Domain Layer (`domain/`)

The **core business logic** layer containing entities, repository interfaces, and use cases.

**Responsibilities**:

- Define business entities and rules
- Declare repository interfaces (contracts)
- Implement business operations (use cases) as React hooks
- Manage business-specific contexts (e.g., AuthContext)

**Dependencies**: None (domain is the innermost layer)

### 2. Infrastructure Layer (`infra/`)

The **implementation details** layer containing concrete implementations of domain interfaces.

**Responsibilities**:

- Implement repository interfaces with actual data sources
- Provide adapters for external services (API, database, storage)
- Configure feedback services (alerts, toasts, logs)
- Manage data persistence and caching strategies

**Dependencies**: Domain layer (implements domain contracts)

### 3. UI Layer (`ui/`)

The **presentation** layer containing all visual components and styling.

**Responsibilities**:

- Reusable components (buttons, inputs, cards)
- Smart containers (components with business logic)
- Theme configuration and design system
- Visual composition and layouts

**Dependencies**: Domain layer (for data operations), Infrastructure (for providers)

## Dependency Flow

```
UI Layer
   ↓ (depends on)
Domain Layer
   ↑ (implemented by)
Infrastructure Layer
```

**Key Principle**: Dependencies point inward. Domain never depends on UI or Infrastructure.

### Dependency Inversion Principle (DIP)

This architecture heavily relies on the **Dependency Inversion Principle**:

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

**In Practice**:

- **Domain layer** defines **abstractions** (repository interfaces like `ICityRepo`, `IAuthRepo`)
- **Infrastructure layer** depends on these abstractions and provides **concrete implementations** (`SupabaseCityRepo`, `InMemoryCityRepo`)
- **Domain operations** use the abstractions, never concrete implementations
- **Implementations are injected** at runtime via React Context (Dependency Injection)

**Benefits**:

- Domain remains independent of infrastructure details (Supabase, database, API)
- Easy to swap implementations (e.g., Supabase → Firebase, or use in-memory for tests)
- Testability: Mock interfaces without touching domain code
- Flexibility: Add new implementations without changing domain logic

**Example**:

```typescript
// Domain defines the abstraction (contract)
interface ICityRepo {
  findAll(): Promise<City[]>;
}

// Domain operation depends on abstraction
function useCityFindAll() {
  const repositories = useRepositories(); // Injected at runtime
  return useAppQuery({
    queryFn: () => repositories.city.findAll(), // Uses abstraction, not concrete class
  });
}

// Infrastructure provides implementations
class SupabaseCityRepo implements ICityRepo { /* ... */ }
class InMemoryCityRepo implements ICityRepo { /* ... */ }

// Provider injects the chosen implementation
<RepositoryProvider> {/* Injects Supabase or InMemory */}
  <App />
</RepositoryProvider>
```

## Technology Stack

### State Management

- **TanStack Query (React Query)**: Async state, caching, and server synchronization
- **React Context**: Local state for auth, theme, and configuration
- No Redux, Zustand, or other global state libraries

### Data Layer

- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Authentication (email/password, OAuth)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage for images

### Routing

- **Expo Router**: File-based routing with type-safe navigation

### Styling

- **Custom theme system**: Theme provider with tokens for colors, spacing, typography
- **StyleSheet API**: React Native's built-in styling

## Core Design Patterns

### 1. Repository Pattern

Abstract data access behind interfaces:

```typescript
// Domain layer defines the contract
export interface ICityRepo {
  findAll(): Promise<City[]>;
  findById(id: string): Promise<City | null>;
}

// Infrastructure implements it
export class SupabaseCityRepo implements ICityRepo {
  // Implementation using Supabase
}
```

### 2. Dependency Injection

Use React Context for dependency injection:

```typescript
// Provide implementations
<RepositoryProvider>
  <App />
</RepositoryProvider>

// Consume via context
const repositories = useRepositories();
const cities = await repositories.city.findAll();
```

### 3. Custom Hooks for Operations

Business operations are encapsulated in custom hooks:

```typescript
// src/domain/city/operations/useCityFindAll.ts
export function useCityFindAll(filters?: CityFilters) {
  return useAppQuery({
    queryKey: ['cities', filters],
    queryFn: () => repositories.city.findAll(filters),
  });
}
```

### 4. Adapter Pattern

Multiple implementations of the same interface:

```typescript
// Adapters for different data sources
-SupabaseCityRepo(production) - InMemoryCityRepo(testing, offline);
```

### 5. Provider Pattern

Configuration and dependencies injected at the root:

```typescript
<RepositoryProvider>
  <StorageProvider>
    <FeedbackProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FeedbackProvider>
  </StorageProvider>
</RepositoryProvider>
```

## SOLID Principles Applied

### Single Responsibility Principle (SRP)

- Each module has one reason to change
- Repositories only handle data access
- Operations only handle one business operation
- Components only handle one UI concern

### Open/Closed Principle (OCP)

- Repository interfaces are open for extension (new implementations)
- Closed for modification (interface stays stable)

### Liskov Substitution Principle (LSP)

- Any repository implementation can replace another
- InMemoryRepo can substitute SupabaseRepo without breaking code

### Dependency Inversion Principle (DIP)

- **High-level modules** (domain operations) don't depend on low-level modules (Supabase, databases)
- **Both depend on abstractions** (repository interfaces defined in domain)
- Infrastructure layer **depends on** and **implements** domain interfaces
- This inverts the traditional dependency flow where business logic depends on database code
- Enables pluggable architecture: swap Supabase for another backend without touching domain

## Data Flow

### Query Flow (Read Operations)

```
1. UI Component
   ↓ calls
2. Domain Operation Hook (useCityFindAll)
   ↓ uses
3. useAppQuery wrapper (TanStack Query)
   ↓ calls
4. Repository Interface (ICityRepo)
   ↓ implemented by
5. Infrastructure Adapter (SupabaseCityRepo)
   ↓ fetches from
6. Supabase API
```

### Mutation Flow (Write Operations)

```
1. UI Component
   ↓ calls
2. Domain Operation Hook (useAuthSignIn)
   ↓ uses
3. useAppMutation wrapper (TanStack Query)
   ↓ calls
4. Repository Interface (IAuthRepo)
   ↓ implemented by
5. Infrastructure Adapter (SupabaseAuthRepo)
   ↓ writes to
6. Supabase API
```

## Testing Strategy

### Unit Tests

- Test domain entities and operations in isolation
- Mock repository interfaces
- Use in-memory implementations for deterministic tests

### Integration Tests

- Test full flows with real implementations
- Use React Native Testing Library
- Test component + hooks + repositories together

### E2E Tests

- Test complete user journeys
- Use Detox or Maestro
- Test on real devices/emulators

## File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `CityCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAppTheme.ts`, `useCityFindAll.ts`)
- **Types/Interfaces**: PascalCase (e.g., `City.ts`, `IAuthRepo.ts`)
- **Utilities**: camelCase (e.g., `dateUtils.ts`)
- **Constants**: UPPER_SNAKE_CASE or PascalCase for objects

## Import Aliases

```typescript
// Use @ alias for absolute imports from src
import { City } from '@/src/domain/city/City';
import { Button } from '@/src/ui/components/Button';
```

## Environment Variables

Configuration managed via environment variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## CI/CD Pipeline

- **EAS Build**: Automated builds for iOS and Android
- **EAS Update**: Over-the-air updates for JavaScript changes
- **Testing**: Automated tests run on PR and merge
- **Store Publishing**: Automated submission to App Store and Play Store

## Performance Considerations

1. **React Query Caching**: Aggressive caching to minimize API calls
2. **Code Splitting**: Lazy load screens and heavy components
3. **Image Optimization**: Use Expo Image with caching
4. **Memoization**: Use `useMemo` and `useCallback` for expensive operations

## Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **Row Level Security**: Enforce at database level (Supabase RLS)
3. **Input Validation**: Validate at both UI and API layer
4. **Authentication**: Token-based auth with secure storage
5. **HTTPS Only**: All API calls use HTTPS

## Notes for AI Agents

- Always respect layer boundaries (domain → infra, never infra → domain)
- Use existing patterns when adding new features
- Repository interfaces go in `domain/`, implementations in `infra/`
- Business operations are always custom hooks using `useAppQuery` or `useAppMutation`
- Never put business logic in UI components
- All async operations use TanStack Query
- Type safety is critical - use TypeScript strictly
