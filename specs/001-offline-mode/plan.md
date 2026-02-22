# Implementation Plan: Offline Mode for Saved Cities

**Branch**: `001-offline-mode` | **Date**: 2026-02-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-offline-mode/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Enable digital nomads to access city information without internet connectivity. The feature provides automatic caching of viewed cities, explicit download functionality for proactive offline preparation, offline action queuing with automatic sync, and storage management. Uses Realm.js for local data persistence with automatic background sync when connectivity is restored.

## Technical Context

**Language/Version**: TypeScript 5.9.2 with React Native 0.81.4  
**Primary Dependencies**: Expo ~54, Realm.js (@realm/react), React Query (via useAppQuery/useAppMutation), @react-native-async-storage/async-storage, @react-native-community/netinfo  
**Storage**: Realm.js for offline database (primary), AsyncStorage for preferences, Supabase for remote sync  
**Testing**: Jest with React Native Testing Library, Realm in-memory instances for testing  
**Target Platform**: iOS 15+ and Android 8+ via Expo  
**Project Type**: Mobile app (React Native with Expo)  
**Performance Goals**: Query offline data <100ms, auto-cache city on view <2s, explicit downloads <30s per city (WiFi), background sync <30s after connectivity restored  
**Constraints**: Offline-first architecture, <100MB max offline storage (configurable), downloads must be resumable, battery-efficient background sync, works seamlessly with existing InMemory/Supabase repository adapters  
**Scale/Scope**: Support 100+ cached cities per user, handle 10K+ users with offline mode, sync queue up to 500 pending actions

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Reference**: See `.specify/memory/constitution.md` for complete principles

### I. Dependency Rule ✓

- [ ] Confirm domain entities/operations have NO imports from `src/infra/` or `src/ui/`
- [ ] Verify repository interfaces defined in `src/domain/[entity]/I[Entity]Repo.ts`
- [ ] Business logic lives exclusively in `src/domain/` (entities, operations)

### II. Interface Segregation & Dependency Inversion ✓

- [ ] Repository interfaces are defined by domain needs, not implementation details
- [ ] Operations use constructor injection or hooks (useAppQuery/useAppMutation) for dependencies
- [ ] No concrete repository imports in domain layer

### III. Single Responsibility & Separation of Concerns ✓

- [ ] Each operation (use case) has one clear purpose (e.g., useCityFindById, not useCityManager)
- [ ] Entities contain only business data + business rules
- [ ] UI components delegate business logic to domain operations

### IV. Testability & Layer Independence ✓

- [ ] Can test domain operations with InMemory adapters (no database required)
- [ ] Operations return domain entities, never infrastructure types
- [ ] Repository implementations swappable via RepositoryProvider

### V. Simplicity & Readability ✓

- [ ] Function/variable names reveal intent (no abbreviations without reason)
- [ ] No premature abstraction (YAGNI - build only what's needed now)
- [ ] Repeated logic extracted into reusable utilities/hooks (DRY)

## Project Structure

### Documentation (this feature)

```text
specs/001-offline-mode/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - N/A for this feature
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── domain/
│   ├── offline/
│   │   ├── OfflineCity.ts              # Entity: cached city data
│   │   ├── SyncAction.ts               # Entity: pending sync actions
│   │   ├── OfflinePreferences.ts       # Entity: user offline settings
│   │   ├── DownloadJob.ts              # Entity: download task tracking
│   │   ├── IOfflineCityRepo.ts         # Repository interface
│   │   ├── ISyncActionRepo.ts          # Repository interface
│   │   └── operations/
│   │       ├── useOfflineCityGet.ts    # Get cached city
│   │       ├── useOfflineCityCache.ts  # Auto-cache city
│   │       ├── useOfflineCityDownload.ts  # Explicit download
│   │       ├── useOfflineSync.ts       # Sync pending actions
│   │       └── useOfflineStorage.ts    # Manage storage
│   └── city/
│       └── (existing city domain code)
├── infra/
│   ├── repositories/
│   │   └── adapters/
│   │       └── realm/
│   │           ├── index.ts
│   │           ├── realmConfig.ts      # Realm schema & configuration
│   │           ├── RealmOfflineCityRepo.ts   # Realm implementation
│   │           ├── RealmSyncActionRepo.ts    # Realm implementation
│   │           └── models/
│   │               ├── RealmOfflineCity.ts   # Realm schema model
│   │               ├── RealmSyncAction.ts    # Realm schema model
│   │               └── RealmDownloadJob.ts   # Realm schema model
│   └── services/
│       ├── NetworkService.ts           # Connectivity detection
│       ├── DownloadService.ts          # Background download manager
│       └── SyncService.ts              # Background sync manager
└── ui/
    ├── screens/
    │   └── OfflineSettingsScreen.tsx   # Storage management UI
    └── components/
        ├── OfflineIndicator.tsx        # Connection status badge
        ├── DownloadButton.tsx          # Download for offline button
        └── DownloadProgress.tsx        # Progress indicator

app/
└── (protected)/
    └── settings/
        └── offline.tsx                 # Offline settings screen route
```

**Structure Decision**: Using existing Clean Architecture structure (domain/infra/ui). Offline feature integrates as a new domain module with Realm.js adapter in infrastructure layer. Follows established pattern of repository interfaces in domain, concrete implementations in infra/repositories/adapters/realm/. Network detection and sync services live in infra/services/ as cross-cutting concerns. UI components follow existing pattern in src/ui/ and screens in app/ (Expo Router file-based routing).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: ✅ No constitution violations detected

All architectural decisions align with Clean Architecture and SOLID principles:
- Realm.js adapter follows existing repository pattern (similar to InMemory/Supabase adapters)
- Domain layer remains independent with interface definitions
- Infrastructure layer handles all storage implementation details
- UI layer consumes domain operations via hooks
- All complexity is justified by offline-first requirements
