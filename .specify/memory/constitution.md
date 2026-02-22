<!--
SYNC IMPACT REPORT
==================
Version: N/A → 1.0.0 (Initial Constitution)
Change Type: MAJOR (New constitution established)

Core Principles:
  ✅ NEW: I. Dependency Rule (Clean Architecture)
  ✅ NEW: II. Interface Segregation & Dependency Inversion (SOLID)
  ✅ NEW: III. Single Responsibility & Separation of Concerns (SOLID + Clean Code)
  ✅ NEW: IV. Testability & Layer Independence (Clean Architecture)
  ✅ NEW: V. Simplicity & Readability (Clean Code - YAGNI, KISS, DRY)

Added Sections:
  ✅ Code Quality Standards
  ✅ Architecture Constraints
  ✅ Governance

Templates Requiring Updates:
  ✅ .specify/templates/plan-template.md - Constitution Check section updated with concrete gates for all 5 principles
  ✅ .specify/templates/spec-template.md - Aligned with existing structure, no changes needed
  ✅ .specify/templates/tasks-template.md - Enhanced refactoring tasks with Clean Code and architecture compliance checks

Follow-up TODOs: None

Date: 2026-02-22
-->

# Digital Nomad App Constitution

## Core Principles

### I. Dependency Rule (Clean Architecture)

**Source code dependencies MUST only point inward toward higher-level policies.**

- Domain layer MUST NOT depend on Infrastructure or UI layers
- Infrastructure layer MUST depend only on Domain abstractions (interfaces)
- UI layer MUST depend only on Domain operations and entities
- Dependencies flow: UI → Domain ← Infrastructure (Domain is the center)
- All cross-boundary communication MUST use interfaces/abstractions defined in Domain
- Business logic MUST reside exclusively in the Domain layer

**Rationale**: This is the cornerstone of Clean Architecture. It ensures business logic
remains independent of frameworks, UI, databases, and external agencies. Changes in outer
layers (UI, infrastructure) never force changes to inner layers (domain).

### II. Interface Segregation & Dependency Inversion (SOLID)

**Abstractions MUST be defined by clients; implementations depend on abstractions, never the reverse.**

- Repository interfaces MUST be defined in Domain, implemented in Infrastructure
- Operations (use cases) MUST depend on repository interfaces, not concrete implementations
- No interface should force clients to depend on methods they don't use
- Inject dependencies through constructors/providers, never import concrete implementations in Domain
- Use dependency injection containers (e.g., RepositoryProvider) for wiring implementations

**Rationale**: The Domain layer defines what it needs through interfaces. Infrastructure
provides implementations. This inverts traditional dependency direction and allows swapping
implementations (e.g., InMemory ↔ Supabase) without touching business logic. Interface
segregation ensures focused, cohesive contracts.

### III. Single Responsibility & Separation of Concerns (SOLID + Clean Code)

**Each module MUST have one, and only one, reason to change. Separate concerns into distinct layers.**

- One entity per file; entities contain only business data and business rules
- One repository interface per aggregate root (e.g., ICityRepo for City entity)
- Operations (use cases) MUST be granular and composable (e.g., useCityFindById, not useCityManager)
- UI components MUST handle only presentation logic, delegating business logic to operations
- Each function/method has one clear purpose; refactor when responsibilities mix
- Layer structure enforced: domain/, infra/, ui/ directories maintain strict boundaries

**Rationale**: Single Responsibility Principle (SRP) reduces coupling, improves testability,
and makes code easier to understand and modify. Changes to persistence don't affect business
rules; changes to UI don't affect operations.

### IV. Testability & Layer Independence (Clean Architecture)

**Every layer MUST be independently testable without requiring other layers.**

- Domain entities and operations MUST be testable without database or UI
- Use in-memory adapters (InMemoryAuthRepo, InMemoryCityRepo) for isolated testing
- Repository implementations MUST be swappable through provider configuration
- Operations return domain entities, never infrastructure-specific types (no DB rows, API responses)
- Integration tests validate adapter implementations against domain contracts
- Mock external dependencies at boundaries (use test doubles for repositories)

**Rationale**: Independent testability is a litmus test for proper architecture. If you can't
test domain logic without spinning up Supabase or rendering UI, boundaries are violated. Test
isolation speeds up development and increases confidence.

### V. Simplicity & Readability (Clean Code - YAGNI, KISS, DRY)

**Code MUST be optimized for human understanding. Simple solutions are preferred over clever ones.**

- Meaningful names: Functions, variables, types reveal intent (e.g., useCityFindById not getData)
- YAGNI: Don't build abstractions or features until actually needed
- KISS: Prefer straightforward implementations; justify complexity when unavoidable
- DRY: Extract repeated logic into reusable functions/hooks (e.g., useAppQuery, useAppMutation)
- Small functions: Each function does one thing; prefer composition over large procedures
- Comments explain "why", not "what" (code should be self-explanatory)
- Avoid magic numbers/strings; use constants or enums

**Rationale**: Code is read 10x more than written. Readable code reduces cognitive load,
prevents bugs, and respects future maintainers (including yourself). Premature abstraction
and over-engineering violate simplicity.

## Code Quality Standards

**Clean Code practices enforced across all code contributions:**

- **Naming Conventions**: Use PascalCase for types/components, camelCase for functions/variables,
  UPPER_SNAKE_CASE for constants
- **Function Length**: Max 20-30 lines; extract to smaller functions if longer
- **File Organization**: Group related functionality; one main export per file (entities,
  operations, components)
- **Error Handling**: Explicit error handling; operations return success/failure states,
  never throw in domain unless exceptional
- **Type Safety**: TypeScript strict mode enabled; no `any` types without justification
- **Formatting**: Prettier enforced via pre-commit hooks (`format:staged`)
- **Linting**: ESLint rules must pass; fix warnings, don't suppress without reason

**Mandatory Code Reviews Check For:**

- Dependency rule violations (imports from outer to inner layers)
- Single Responsibility violations (doing too much in one place)
- Missing abstractions (concrete dependencies in domain)
- Poor naming (abbreviations, unclear intent)
- Complexity without justification

## Architecture Constraints

**Enforce Clean Architecture structure throughout the codebase:**

- **Domain Layer** (`src/domain/`): Entities, repository interfaces, operations (use cases).
  NO dependencies on UI or infrastructure.
- **Infrastructure Layer** (`src/infra/`): Repository implementations, adapters, external API
  clients. Implements domain interfaces.
- **UI Layer** (`src/ui/`, `app/`): React Native components, screens, theme. Uses domain
  operations via hooks.
- **Adapters**: Maintain multiple implementations (InMemory for testing, Supabase for
  production). Switch via provider.
- **Cross-Cutting Concerns**: Utilities in `src/utils/` must remain pure and stateless;
  no business logic.

**Technology Stack Alignment:**

- React Native with Expo (mobile framework)
- TypeScript (strict type checking)
- Repository pattern with adapters (InMemory, Supabase)
- React Query wrapped in domain operations (useAppQuery, useAppMutation)
- Shopify Restyle for theming (design system consistency)

**Breaking Changes Policy:**

- Changes to domain interfaces require deprecation cycle or major version bump
- Infrastructure changes (e.g., database schema) must support backward compatibility or
  provide migration path
- UI breaking changes communicated to users with fallback states

## Governance

**This constitution supersedes all other practices and conventions.**

- All feature specifications, implementation plans, and pull requests MUST verify compliance
  with core principles
- Principle violations require explicit justification documented in `plan.md` Complexity
  Tracking table
- Amendments to this constitution require:
  1. Clear rationale for change
  2. Impact analysis on existing codebase
  3. Approval by project maintainers
  4. Migration plan if changes affect existing code
  5. Version bump following semantic versioning rules (see versioning policy below)

**Versioning Policy:**

- **MAJOR**: Backward incompatible changes to core principles (e.g., removing a principle,
  redefining architectural boundaries)
- **MINOR**: Additions (new principle/section) or expansions that don't contradict existing rules
- **PATCH**: Clarifications, typo fixes, wording improvements without semantic change

**Compliance Review:**

- Constitution compliance checked at every phase gate (spec → plan → tasks → implementation)
- Code reviews enforce dependency rule, interface segregation, and single responsibility
- Refactoring tasks for violations included in future iterations
- Team maintains shared understanding through periodic constitution reviews

**Guidance Integration:**

- Runtime development guided by this constitution
- Templates reference constitution principles in checkpoints and gates
- On-boarding documents include constitution walkthrough and architecture examples

**Version**: 1.0.0 | **Ratified**: 2026-02-22 | **Last Amended**: 2026-02-22
