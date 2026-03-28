# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start          # Start Expo dev server
yarn ios            # Run on iOS simulator
yarn android        # Run on Android emulator
yarn test           # Run all Jest tests
yarn test --testPathPattern="Component"  # Run a single test file
yarn lint           # Run ESLint
yarn format         # Format with Prettier
yarn format:check   # Check formatting without writing
```

Environment variables are required — copy `.env.example` to `.env` and fill in Supabase credentials.

## Architecture

This app follows **Clean Architecture** with three strict layers in `src/`:

```
src/domain/     ← Business logic, no external dependencies
src/infra/      ← Implements domain contracts (Supabase adapters, storage, feedback)
src/ui/         ← Presentation (components, containers, theme)
app/            ← Expo Router file-based navigation screens
```

**Dependency rule**: Domain ← UI, Domain ← Infra. Domain never imports from UI or Infra.

### Key patterns

**Repository pattern with DI**: Domain defines interfaces (`ICityRepo`, `IAuthRepo`, `ICategoryRepo`) in `src/domain/`. Infra provides two sets of implementations:
- `src/infra/repositories/adapters/supabase/` — production
- `src/infra/repositories/adapters/inMemory/` — testing/offline

Implementations are injected via `<RepositoryProvider>` in `app/_layout.tsx`. Currently uses `InMemoryRepositories` in development.

**Operations as hooks**: All async business operations live in `src/domain/*/operations/` as custom hooks wrapping `useAppQuery` or `useAppMutation` (from `src/infra/operations/`), which wrap TanStack Query.

**Provider hierarchy** (outermost → innermost):
```
StorageProvider → AuthProvider → FeedbackProvider → RepositoryProvider → ThemeProvider
```

### Navigation

Expo Router with typed routes. Route groups:
- `app/(protected)/(tabs)/` — authenticated tab screens (Home, Explore, Profile)
- `app/(protected)/city-details/[id].tsx` — dynamic city detail screen
- `app/sign-in.tsx`, `app/sign-up.tsx` — public auth screens

Auth guard lives in `app/(protected)/_layout.tsx`.

### State management

- **TanStack Query** for all server/async state via `useAppQuery`/`useAppMutation`
- **React Context** for auth, storage, feedback, and repository injection
- No Redux or Zustand

### Styling

`@shopify/restyle` theme provider with tokens defined in `src/ui/theme/theme.ts`. Components use theme-aware primitives (`Box`, `Text` from `src/ui/components/`). Fonts are Poppins variants loaded at root layout.

## Testing

Tests use Jest + `@testing-library/react-native`. Use `userEvent.setup()` with `jest.useFakeTimers()` for interaction tests. In-memory repository adapters are used for component/integration tests — no Supabase mocking needed.

## File naming

- Components: `PascalCase.tsx`
- Hooks: `camelCase` with `use` prefix
- Types/Interfaces: `PascalCase.ts`, interfaces prefixed with `I` (e.g., `ICityRepo`)
- Import alias `@/` maps to repo root
