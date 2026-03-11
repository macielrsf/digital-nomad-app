# Navigation Layer (app/)

## Overview

This directory contains all navigation and screen files using **Expo Router**, a file-based routing system that automatically creates routes based on the file structure.

## Architecture Pattern

- **File-based Routing**: Each file in this directory automatically becomes a route
- **Layout Files**: `_layout.tsx` files define nested navigation structures
- **Dynamic Routes**: Files with `[param].tsx` create dynamic routes with parameters
- **Route Groups**: Folders with `(name)` create logical grouping without adding to the URL path

## Directory Structure

```
app/
├── _layout.tsx                    # Root layout (stack navigator)
├── sign-in.tsx                    # Sign-in screen (public)
├── sign-up.tsx                    # Sign-up screen (public)
├── reset-password.tsx             # Password reset screen (public)
├── +not-found.tsx                 # 404 page
└── (protected)/                   # Protected routes group
    ├── _layout.tsx                # Protected layout wrapper
    ├── (tabs)/                    # Tab navigation group
    │   ├── _layout.tsx            # Bottom tabs navigator
    │   ├── index.tsx              # Home/Cities list screen
    │   ├── explore.tsx            # Explore screen
    │   └── profile.tsx            # User profile screen
    └── city-details/              # City details stack
        └── [id].tsx               # Dynamic city details screen
```

## Routing Conventions

### Public Routes (Root Level)

- `sign-in.tsx` → `/sign-in`
- `sign-up.tsx` → `/sign-up`
- `reset-password.tsx` → `/reset-password`

### Protected Routes

All routes inside `(protected)/` require authentication. The layout checks for authenticated users and redirects to sign-in if needed.

### Tab Navigation

Routes inside `(protected)/(tabs)/`:

- `index.tsx` → `/` (Home - Cities list)
- `explore.tsx` → `/explore`
- `profile.tsx` → `/profile`

### Dynamic Routes

- `city-details/[id].tsx` → `/city-details/123` (where 123 is the city ID)

## Navigation Principles

### 1. Separation of Concerns

- **Screens**: Only handle navigation, layout, and orchestration
- **Containers**: Contain business logic and data fetching
- **Components**: Pure, reusable UI components

### 2. Type Safety

```typescript
// Use typed navigation
import { useRouter, useLocalSearchParams } from 'expo-router';

// In dynamic routes, params are always strings
const { id } = useLocalSearchParams<{ id: string }>();
```

### 3. Authentication Guards

Protected routes are wrapped in a layout that checks authentication:

```typescript
// (protected)/_layout.tsx checks for authenticated user
// Redirects to /sign-in if not authenticated
```

### 4. Deep Linking

Expo Router automatically handles deep linking. All routes are accessible via URL.

## Best Practices

1. **Keep screens thin**: Move business logic to containers or domain operations
2. **Use layout files**: For shared navigation structures and authentication guards
3. **Type your route params**: Always type search params and dynamic route parameters
4. **Handle loading states**: Show loading indicators while data fetches
5. **Error boundaries**: Use error boundaries for graceful error handling

## Navigation APIs

```typescript
import { useRouter, usePathname, useSegments } from 'expo-router';

// Programmatic navigation
const router = useRouter();
router.push('/city-details/123');
router.replace('/sign-in');
router.back();

// Get current route info
const pathname = usePathname(); // current path
const segments = useSegments(); // route segments array
```

## Integration with Domain Layer

Screens should use domain operations (hooks) from `src/domain/`:

```typescript
// Good: Use domain operations
import { useCityDetails } from '@/src/domain/city/operations/useCityDetails';

// Bad: Direct API calls in screens
// fetch('/api/cities/123') ❌
```

## Notes for AI Agents

- All screens are React components exported as default
- Authentication state is managed in `src/domain/auth/AuthContext.tsx`
- Navigation should never contain business logic
- Always use typed parameters with `useLocalSearchParams<T>()`
- For modal presentations, use `router.push()` with presentation options
