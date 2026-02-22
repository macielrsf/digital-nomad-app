# Tasks: Offline Mode for Saved Cities

**Input**: Design documents from `/specs/001-offline-mode/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Required using Jest and React Native Testing Library with **80% coverage target**. Tests follow TDD approach - written BEFORE implementation to ensure they fail, then implementation makes them pass.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: Always `- [ ]` (markdown checkbox)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, Realm.js configuration, and test infrastructure

- [ ] T001 Install Realm.js dependencies: `npx expo install @realm/react realm`
- [ ] T002 Install NetInfo for connectivity detection: `npx expo install @react-native-community/netinfo`
- [ ] T003 [P] Install file system for image caching: `npx expo install expo-file-system`
- [ ] T004 [P] Setup Jest configuration for React Native in `jest.config.js` with coverage thresholds (80% lines, branches, functions, statements)
- [ ] T005 [P] Install testing dependencies: `npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo`
- [ ] T006 [P] Create test utilities and mock helpers in `__tests__/utils/testUtils.ts` (render helpers, mock providers)
- [ ] T007 [P] Create mock Realm instance helper for tests in `__tests__/mocks/mockRealm.ts`
- [ ] T008 [P] Create mock NetInfo helper for tests in `__tests__/mocks/mockNetInfo.ts`
- [ ] T009 Create Realm configuration file in `src/infra/repositories/adapters/realm/realmConfig.ts`
- [ ] T010 Wrap app with RealmProvider in `app/_layout.tsx`
- [ ] T011 [P] Create Realm adapter index file in `src/infra/repositories/adapters/realm/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational Layer ⚠️ WRITE FIRST

- [ ] T012 [P] [FOUNDATION] Unit test for NetworkService hook in `src/infra/services/__tests__/NetworkService.test.ts` (test online/offline detection, WiFi vs cellular)
- [ ] T013 [P] [FOUNDATION] Unit test for RepositoryProvider with offline repos in `src/infra/repositories/__tests__/RepositoryProvider.test.tsx`

### Implementation for Foundational Layer

- [ ] T014 Create NetworkService with connectivity detection hook in `src/infra/services/NetworkService.ts` (verify T012 passes)
- [ ] T015 [P] Create base offline domain directory structure `src/domain/offline/`
- [ ] T016 Update RepositoryProvider to support offline repositories in `src/infra/repositories/RepositoryProvider.tsx` (verify T013 passes)
- [ ] T017 [P] Create Realm models directory `src/infra/repositories/adapters/realm/models/`
- [ ] T018 Add Realm adapter to app initialization flow (provider integration)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Downloaded Cities Offline (Priority: P1) 🎯 MVP

**Goal**: Auto-cache cities when viewed online, display cached data offline, show offline indicators

**Independent Test**: View 3 cities while online (Chiang Mai, Lisbon, Medellin), enable airplane mode, navigate to each city's details page, verify all information displays correctly without internet.

### Tests for User Story 1 ⚠️ WRITE TESTS FIRST

- [ ] T019 [P] [US1] Unit test for useOfflineCityGet operation in `src/domain/offline/operations/__tests__/useOfflineCityGet.test.ts`
- [ ] T020 [P] [US1] Unit test for useOfflineCityCache operation in `src/domain/offline/operations/__tests__/useOfflineCityCache.test.ts`
- [ ] T021 [P] [US1] Integration test for RealmOfflineCityRepo in `src/infra/repositories/adapters/realm/__tests__/RealmOfflineCityRepo.test.ts` (save, findById, findAll, updateLastAccessed)
- [ ] T022 [P] [US1] Component test for OfflineIndicator in `src/ui/components/__tests__/OfflineIndicator.test.tsx` (shows when offline, hides when online)
- [ ] T023 [P] [US1] Component test for OfflineBadge in `src/ui/components/__tests__/OfflineBadge.test.tsx` (displays cached status)
- [ ] T024 [P] [US1] Integration test for city details auto-cache in `app/(protected)/city-details/__tests__/[id].test.tsx`

### Domain Layer for User Story 1

- [ ] T025 [P] [US1] Create OfflineCity domain entity in `src/domain/offline/OfflineCity.ts`
- [ ] T026 [P] [US1] Create IOfflineCityRepo interface in `src/domain/offline/IOfflineCityRepo.ts`
- [ ] T027 [US1] Create useOfflineCityGet operation in `src/domain/offline/operations/useOfflineCityGet.ts` (verify T019 passes)
- [ ] T028 [US1] Create useOfflineCityCache operation in `src/domain/offline/operations/useOfflineCityCache.ts` (verify T020 passes)

### Infrastructure Layer for User Story 1

- [ ] T029 [US1] Create RealmOfflineCity schema model in `src/infra/repositories/adapters/realm/models/RealmOfflineCity.ts`
- [ ] T030 [US1] Implement RealmOfflineCityRepo in `src/infra/repositories/adapters/realm/RealmOfflineCityRepo.ts` (verify T021 passes)
- [ ] T031 [US1] Register RealmOfflineCityRepo in RepositoryProvider in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T032 [US1] Update Realm configuration to include OfflineCity schema in `src/infra/repositories/adapters/realm/realmConfig.ts`

### UI Layer for User Story 1

- [ ] T033 [P] [US1] Create OfflineIndicator component in `src/ui/components/OfflineIndicator.tsx` (verify T022 passes)
- [ ] T034 [P] [US1] Create OfflineBadge component for city cards in `src/ui/components/OfflineBadge.tsx` (verify T023 passes)
- [ ] T035 [US1] Integrate auto-cache in city details screen in `app/(protected)/city-details/[id].tsx` (verify T024 passes)
- [ ] T036 [US1] Add OfflineIndicator to app header/layout in `app/_layout.tsx`
- [ ] T037 [US1] Add offline availability badges to saved cities list in `app/(protected)/(tabs)/index.tsx`
- [ ] T038 [US1] Implement offline fallback logic in city details screen (show cached data when offline)
- [ ] T039 [US1] Add "This city requires internet connection" message for non-cached cities when offline

### Coverage Check for User Story 1

- [ ] T040 [US1] Run coverage report for User Story 1: `npm test -- --coverage --collectCoverageFrom='src/domain/offline/**' --collectCoverageFrom='src/infra/**/realm/**' --collectCoverageFrom='src/ui/components/Offline*'` (verify ≥80%)

**Checkpoint**: At this point, User Story 1 (MVP) should be fully functional and tested - users can view cached cities offline

---

## Phase 4: User Story 2 - Explicit Download for Offline Access (Priority: P2)

**Goal**: Allow users to explicitly download cities with progress tracking, "Download All" functionality

**Independent Test**: View a city details page while online, tap "Download for Offline," see progress indicator reach 100%, enable airplane mode, verify the city with all images is fully accessible offline.

### Tests for User Story 2 ⚠️ WRITE TESTS FIRST

- [ ] T041 [P] [US2] Unit test for useOfflineCityDownload operation in `src/domain/offline/operations/__tests__/useOfflineCityDownload.test.ts`
- [ ] T042 [P] [US2] Unit test for useDownloadAllCities operation in `src/domain/offline/operations/__tests__/useDownloadAllCities.test.ts`
- [ ] T043 [P] [US2] Unit test for useDownloadJobStatus operation in `src/domain/offline/operations/__tests__/useDownloadJobStatus.test.ts`
- [ ] T044 [P] [US2] Unit test for DownloadService in `src/infra/services/__tests__/DownloadService.test.ts` (image download, resume, WiFi check)
- [ ] T045 [P] [US2] Integration test for RealmDownloadJobRepo in `src/infra/repositories/adapters/realm/__tests__/RealmDownloadJobRepo.test.ts`
- [ ] T046 [P] [US2] Component test for DownloadButton in `src/ui/components/__tests__/DownloadButton.test.tsx` (disabled when offline, loading state)
- [ ] T047 [P] [US2] Component test for DownloadProgress in `src/ui/components/__tests__/DownloadProgress.test.tsx` (progress 0-100%, cancel)

### Domain Layer for User Story 2

- [ ] T048 [P] [US2] Create DownloadJob domain entity in `src/domain/offline/DownloadJob.ts`
- [ ] T049 [P] [US2] Create IDownloadJobRepo interface in `src/domain/offline/IDownloadJobRepo.ts`
- [ ] T050 [US2] Create useOfflineCityDownload operation in `src/domain/offline/operations/useOfflineCityDownload.ts` (verify T041 passes)
- [ ] T051 [US2] Create useDownloadAllCities operation in `src/domain/offline/operations/useDownloadAllCities.ts` (verify T042 passes)
- [ ] T052 [US2] Create useDownloadJobStatus operation in `src/domain/offline/operations/useDownloadJobStatus.ts` (verify T043 passes)

### Infrastructure Layer for User Story 2

- [ ] T053 [US2] Create RealmDownloadJob schema model in `src/infra/repositories/adapters/realm/models/RealmDownloadJob.ts`
- [ ] T054 [US2] Implement RealmDownloadJobRepo in `src/infra/repositories/adapters/realm/RealmDownloadJobRepo.ts` (verify T045 passes)
- [ ] T055 [US2] Create DownloadService for managing downloads in `src/infra/services/DownloadService.ts` (verify T044 passes)
- [ ] T056 [US2] Implement image download and caching logic using expo-file-system in DownloadService
- [ ] T057 [US2] Add resumable download logic (handle partial downloads) in DownloadService
- [ ] T058 [US2] Register RealmDownloadJobRepo in RepositoryProvider in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T059 [US2] Update Realm configuration to include DownloadJob schema in `src/infra/repositories/adapters/realm/realmConfig.ts`

### UI Layer for User Story 2

- [ ] T060 [P] [US2] Create DownloadButton component in `src/ui/components/DownloadButton.tsx` (verify T046 passes)
- [ ] T061 [P] [US2] Create DownloadProgress component in `src/ui/components/DownloadProgress.tsx` (verify T047 passes)
- [ ] T062 [US2] Add DownloadButton to city details screen in `app/(protected)/city-details/[id].tsx`
- [ ] T063 [US2] Display download progress in city details screen
- [ ] T064 [US2] Add "Downloaded" badge to city cards when download complete
- [ ] T065 [US2] Implement "Download All" button in saved cities screen in `app/(protected)/(tabs)/index.tsx`
- [ ] T066 [US2] Show overall download progress for "Download All" functionality
- [ ] T067 [US2] Handle WiFi-only download preference (check connection type before download)

### Coverage Check for User Story 2

- [ ] T068 [US2] Run coverage report for User Story 2: `npm test -- --coverage --collectCoverageFrom='src/domain/offline/operations/use*Download*' --collectCoverageFrom='src/infra/services/DownloadService*'` (verify ≥80%)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently and be tested - users can explicitly download cities

---

## Phase 5: User Story 3 - Offline Actions Sync When Online (Priority: P3)

**Goal**: Queue offline actions (save/unsave cities, add notes), automatically sync when online, handle conflicts

**Independent Test**: Go offline, save 2 new cities and remove 1 saved city, make a note on a city, go back online, verify all changes sync correctly to the server.

### Tests for User Story 3 ⚠️ WRITE TESTS FIRST

- [ ] T069 [P] [US3] Unit test for useOfflineSync operation in `src/domain/offline/operations/__tests__/useOfflineSync.test.ts`
- [ ] T070 [P] [US3] Unit test for useQueueOfflineAction operation in `src/domain/offline/operations/__tests__/useQueueOfflineAction.test.ts`
- [ ] T071 [P] [US3] Unit test for usePendingSyncCount operation in `src/domain/offline/operations/__tests__/usePendingSyncCount.test.ts`
- [ ] T072 [P] [US3] Unit test for SyncService FIFO queue in `src/infra/services/__tests__/SyncService.test.ts`
- [ ] T073 [P] [US3] Unit test for SyncService conflict resolution in `src/infra/services/__tests__/SyncService.conflict.test.ts` (last write wins)
- [ ] T074 [P] [US3] Unit test for SyncService retry logic in `src/infra/services/__tests__/SyncService.retry.test.ts` (exponential backoff)
- [ ] T075 [P] [US3] Integration test for RealmSyncActionRepo in `src/infra/repositories/adapters/realm/__tests__/RealmSyncActionRepo.test.ts`
- [ ] T076 [P] [US3] Component test for SyncPendingIndicator in `src/ui/components/__tests__/SyncPendingIndicator.test.tsx`
- [ ] T077 [P] [US3] Component test for SyncNotification in `src/ui/components/__tests__/SyncNotification.test.tsx` (success, conflict, error states)

### Domain Layer for User Story 3

- [ ] T078 [P] [US3] Create SyncAction domain entity in `src/domain/offline/SyncAction.ts`
- [ ] T079 [P] [US3] Create ISyncActionRepo interface in `src/domain/offline/ISyncActionRepo.ts`
- [ ] T080 [US3] Create useOfflineSync operation in `src/domain/offline/operations/useOfflineSync.ts` (verify T069 passes)
- [ ] T081 [US3] Create useQueueOfflineAction operation in `src/domain/offline/operations/useQueueOfflineAction.ts` (verify T070 passes)
- [ ] T082 [US3] Create usePendingSyncCount operation in `src/domain/offline/operations/usePendingSyncCount.ts` (verify T071 passes)

### Infrastructure Layer for User Story 3

- [ ] T083 [US3] Create RealmSyncAction schema model in `src/infra/repositories/adapters/realm/models/RealmSyncAction.ts`
- [ ] T084 [US3] Implement RealmSyncActionRepo in `src/infra/repositories/adapters/realm/RealmSyncActionRepo.ts` (verify T075 passes)
- [ ] T085 [US3] Create SyncService for managing sync queue in `src/infra/services/SyncService.ts` (verify T072, T073, T074 pass)
- [ ] T086 [US3] Implement FIFO sync queue processing in SyncService
- [ ] T087 [US3] Implement conflict resolution logic ("last write wins") in SyncService
- [ ] T088 [US3] Add retry logic with exponential backoff for failed syncs in SyncService
- [ ] T089 [US3] Register RealmSyncActionRepo in RepositoryProvider in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T090 [US3] Update Realm configuration to include SyncAction schema in `src/infra/repositories/adapters/realm/realmConfig.ts`
- [ ] T091 [US3] Add connectivity listener to trigger sync when online in NetworkService in `src/infra/services/NetworkService.ts`

### UI Layer for User Story 3

- [ ] T092 [P] [US3] Create SyncPendingIndicator component in `src/ui/components/SyncPendingIndicator.tsx` (verify T076 passes)
- [ ] T093 [P] [US3] Create SyncNotification component in `src/ui/components/SyncNotification.tsx` (verify T077 passes)
- [ ] T094 [US3] Queue offline actions in city operations (save/unsave) with useQueueOfflineAction
- [ ] T095 [US3] Display "Pending sync" indicator when actions are queued
- [ ] T096 [US3] Show sync success notification when sync completes
- [ ] T097 [US3] Show sync conflict notification when conflicts occur
- [ ] T098 [US3] Add "Retry" button for failed sync actions in notification
- [ ] T099 [US3] Update city list to refresh after successful sync

### Coverage Check for User Story 3

- [ ] T100 [US3] Run coverage report for User Story 3: `npm test -- --coverage --collectCoverageFrom='src/domain/offline/operations/use*Sync*' --collectCoverageFrom='src/infra/services/SyncService*'` (verify ≥80%)

**Checkpoint**: All user stories 1, 2, and 3 should now be independently functional and tested - offline actions sync when online

---

## Phase 6: User Story 4 - Offline Indicator and Data Management (Priority: P4)

**Goal**: Storage management UI, display storage usage, delete offline data, configure offline preferences

**Independent Test**: Toggle airplane mode and verify offline indicator appears, navigate to Settings > Offline Data, view storage usage, select cities to delete, confirm storage decreases.

### Tests for User Story 4 ⚠️ WRITE TESTS FIRST

- [ ] T101 [P] [US4] Unit test for useOfflineStorage operation in `src/domain/offline/operations/__tests__/useOfflineStorage.test.ts`
- [ ] T102 [P] [US4] Unit test for useOfflinePreferences operation in `src/domain/offline/operations/__tests__/useOfflinePreferences.test.ts`
- [ ] T103 [P] [US4] Unit test for useDeleteOfflineCity operation in `src/domain/offline/operations/__tests__/useDeleteOfflineCity.test.ts`
- [ ] T104 [P] [US4] Unit test for useClearAllOfflineData operation in `src/domain/offline/operations/__tests__/useClearAllOfflineData.test.ts`
- [ ] T105 [P] [US4] Integration test for RealmOfflinePreferencesRepo in `src/infra/repositories/adapters/realm/__tests__/RealmOfflinePreferencesRepo.test.ts`
- [ ] T106 [P] [US4] Unit test for LRU eviction logic in `src/infra/repositories/adapters/realm/__tests__/RealmOfflineCityRepo.lru.test.ts`
- [ ] T107 [P] [US4] Unit test for storage calculation in `src/infra/repositories/adapters/realm/__tests__/RealmOfflineCityRepo.storage.test.ts`
- [ ] T108 [P] [US4] Component test for OfflineSettingsScreen in `src/ui/screens/__tests__/OfflineSettingsScreen.test.tsx`
- [ ] T109 [P] [US4] Component test for StorageUsageDisplay in `src/ui/components/__tests__/StorageUsageDisplay.test.tsx`
- [ ] T110 [P] [US4] Component test for OfflinePreferencesForm in `src/ui/components/__tests__/OfflinePreferencesForm.test.tsx`

### Domain Layer for User Story 4

- [ ] T111 [P] [US4] Create OfflinePreferences domain entity in `src/domain/offline/OfflinePreferences.ts`
- [ ] T112 [P] [US4] Create IOfflinePreferencesRepo interface in `src/domain/offline/IOfflinePreferencesRepo.ts`
- [ ] T113 [US4] Create useOfflineStorage operation in `src/domain/offline/operations/useOfflineStorage.ts` (verify T101 passes)
- [ ] T114 [US4] Create useOfflinePreferences operation in `src/domain/offline/operations/useOfflinePreferences.ts` (verify T102 passes)
- [ ] T115 [US4] Create useDeleteOfflineCity operation in `src/domain/offline/operations/useDeleteOfflineCity.ts` (verify T103 passes)
- [ ] T116 [US4] Create useClearAllOfflineData operation in `src/domain/offline/operations/useClearAllOfflineData.ts` (verify T104 passes)

### Infrastructure Layer for User Story 4

- [ ] T117 [US4] Create RealmOfflinePreferences schema model in `src/infra/repositories/adapters/realm/models/RealmOfflinePreferences.ts`
- [ ] T118 [US4] Implement RealmOfflinePreferencesRepo in `src/infra/repositories/adapters/realm/RealmOfflinePreferencesRepo.ts` (verify T105 passes)
- [ ] T119 [US4] Implement storage calculation logic in RealmOfflineCityRepo (getTotalStorageUsed method) (verify T107 passes)
- [ ] T120 [US4] Implement LRU eviction logic in RealmOfflineCityRepo (findLRUCandidates method) (verify T106 passes)
- [ ] T121 [US4] Implement auto-prune logic for stale data (findStale method)
- [ ] T122 [US4] Register RealmOfflinePreferencesRepo in RepositoryProvider in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T123 [US4] Update Realm configuration to include OfflinePreferences schema in `src/infra/repositories/adapters/realm/realmConfig.ts`
- [ ] T124 [US4] Add background task for auto-pruning stale cities (runs daily)

### UI Layer for User Story 4

- [ ] T125 [US4] Create OfflineSettingsScreen in `src/ui/screens/OfflineSettingsScreen.tsx` (verify T108 passes)
- [ ] T126 [US4] Create StorageUsageDisplay component in `src/ui/components/StorageUsageDisplay.tsx` (verify T109 passes)
- [ ] T127 [US4] Create OfflineCityListItem component for storage management in `src/ui/components/OfflineCityListItem.tsx`
- [ ] T128 [US4] Create OfflinePreferencesForm component in `src/ui/components/OfflinePreferencesForm.tsx` (verify T110 passes)
- [ ] T129 [US4] Create offline settings route in `app/(protected)/settings/offline.tsx`
- [ ] T130 [US4] Display total storage used and per-city storage in OfflineSettingsScreen
- [ ] T131 [US4] Implement "Remove Downloaded Data" button for individual cities
- [ ] T132 [US4] Implement "Clear All Offline Data" button with confirmation dialog
- [ ] T133 [US4] Add toggle for "Auto-download saved cities" preference
- [ ] T134 [US4] Add toggle for "Download over WiFi only" preference
- [ ] T135 [US4] Add storage limit slider with current usage indicator
- [ ] T094 [US4] Add "Auto-prune after X days" setting
- [ ] T095 [US4] Display stale data warning when viewing cities >30 days old

**Checkpoint**: All user stories should now be complete - full offline mode with storage management

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, testing, documentation, and final cleanup

### Final Testing & Coverage

- [ ] T139 [P] Run full test suite: `npm test` (verify all tests pass)
- [ ] T140 Run full coverage report: `npm test -- --coverage` (verify ≥80% overall coverage for offline module)
- [ ] T141 Generate coverage HTML report: `npm test -- --coverage --coverageReporters=html` (review detailed coverage)
- [ ] T142 [P] Add E2E test for complete offline workflow in `e2e/__tests__/offline-mode.e2e.ts` (view city online → go offline → view cached city → download city → sync actions)
- [ ] T143 Fix any coverage gaps identified in T140-T141 to reach 80% threshold

### Documentation & Cleanup

- [ ] T144 [P] Update README.md with offline mode documentation
- [ ] T145 [P] Add offline mode section to quickstart.md validation checklist
- [ ] T146 Code cleanup and refactoring
  - Verify no dependency rule violations (domain importing from infra/ui)
  - Extract repeated code (DRY principle): Realm serialization/deserialization helpers
  - Improve function/variable naming for clarity
  - Break down functions exceeding 30 lines (especially in SyncService)
  - Remove unused code and commented-out blocks
- [ ] T147 Performance optimization across all stories
  - Add Realm indexes for frequently queried fields (cityId, lastAccessedAt, syncStatus)
  - Optimize image compression settings
  - Profile and optimize background sync performance
  - Implement debounce for auto-cache to avoid excessive writes
- [ ] T148 [P] Add error boundaries for offline-related components
- [ ] T149 [P] Add analytics events for offline feature usage (downloads, sync, storage)
- [ ] T150 Security hardening
  - Encrypt sensitive data in Realm (if needed)
  - Validate all input to Realm write operations
  - Sanitize sync action payloads
- [ ] T103 Constitution compliance audit (see `.specify/memory/constitution.md`)
  - Verify domain entities have no infra/ui imports
  - Verify all operations use repository interfaces
  - Verify single responsibility for each operation/service
  - Verify testability with InMemory adapters possible
  - Verify naming clarity and no premature abstraction
- [ ] T104 Add logging for debugging offline issues (connectivity changes, sync errors, storage limits)
- [ ] T105 [P] Add migration guide for existing users (explain offline feature)
- [ ] T154 Final manual testing checklist
  - Test all user stories end-to-end
  - Test edge cases (storage full, partial downloads, sync conflicts)
  - Test on both iOS and Android
  - Test airplane mode transitions
  - Test WiFi-only download preference
- [ ] T155 Final coverage validation: verify offline module achieves ≥80% coverage before marking feature complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - MVP priority
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - Can start in parallel with US1 if staffed, but US1 is MVP
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) - Can start in parallel with US1/US2 if staffed
- **User Story 4 (Phase 6)**: Depends on US1 completion (needs OfflineCity entity) - Can start in parallel with US2/US3
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: MVP - Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on OfflineCity entity from US1 but can work in parallel
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent but integrates with US1 save/unsave operations
- **User Story 4 (P4)**: Needs OfflineCity entity from US1 for storage calculations - Otherwise independent

### Within Each User Story

**Critical Path for Each Story:**

1. **Tests first** (TDD approach - write failing tests)
2. Domain entities
3. Infrastructure implementation (make tests pass)
4. Domain operations (verify tests pass)
5. UI integration

**Best Practice**: Write tests first, watch them fail, then implement to make them pass

### Parallel Opportunities

**Setup Phase (Phase 1):**

- T004 (Jest config), T005 (test deps), T006 (test utils), T007 (mock Realm), T008 (mock NetInfo) can run in parallel
- T002 (NetInfo), T003 (file-system), T011 (Realm index) can run in parallel

**Foundational Phase (Phase 2):**

- T012 (NetworkService test), T013 (RepositoryProvider test) can run in parallel (tests written first)
- T015 (domain structure), T017 (models directory) can run in parallel (after tests)

**Within User Story 1:**

- T019-T024 (all US1 tests) can be written in parallel
- T025 (OfflineCity entity), T026 (IOfflineCityRepo) can run in parallel
- T033 (OfflineIndicator), T034 (OfflineBadge) can run in parallel

**Within User Story 2:**

- T041-T047 (all US2 tests) can be written in parallel
- T048 (DownloadJob entity), T049 (IDownloadJobRepo) can run in parallel
- T060 (DownloadButton), T061 (DownloadProgress) can run in parallel

**Within User Story 3:**

- T069-T077 (all US3 tests) can be written in parallel
- T078 (SyncAction entity), T079 (ISyncActionRepo) can run in parallel
- T092 (SyncPendingIndicator), T093 (SyncNotification) can run in parallel

**Within User Story 4:**

- T101-T110 (all US4 tests) can be written in parallel
- T111 (OfflinePreferences entity), T112 (IOfflinePreferencesRepo) can run in parallel

**Cross-Story Parallelization:**

- Once Foundational is complete, multiple developers can work on different user stories in parallel
- Recommended: One developer on US1 (MVP), another on US2 (downloads), another on US3 (sync)

**Polish Phase (Phase 7):**

- T139-T143 (testing tasks) can run sequentially (depends on implementation)
- T144 (README), T145 (quickstart), T148 (error boundaries), T149 (analytics), T153 (migration guide) can run in parallel

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**MVP = User Story 1 only** (Phase 1 + Phase 2 + Phase 3)

**Tasks**: T001-T040 (40 tasks, including test setup and US1 tests)

**Why**: US1 delivers the core value of offline mode - auto-caching cities for offline access. Users can view previously loaded cities without internet. This is the essential feature that digital nomads need most.

**MVP Demo**:

1. View 3 cities while online (auto-cached)
2. Enable airplane mode
3. Navigate to those 3 cities (works offline)
4. See offline indicator in app header
5. Try to view a non-cached city (shows "requires internet" message)

### Incremental Delivery Plan

1. **Sprint 1 (MVP)**: Phase 1 + Phase 2 + Phase 3 (US1) - Auto-cache and offline viewing
2. **Sprint 2**: Phase 4 (US2) - Explicit downloads with progress
3. **Sprint 3**: Phase 5 (US3) - Offline actions sync
4. **Sprint 4**: Phase 6 (US4) - Storage management UI
5. **Sprint 5**: Phase 7 - Polish and final testing

### Total Task Count

- **Phase 1 (Setup)**: 11 tasks (includes test infrastructure setup)
- **Phase 2 (Foundational)**: 7 tasks (includes 2 test tasks)
- **Phase 3 (US1 - MVP)**: 22 tasks (includes 6 test tasks + 1 coverage check)
- **Phase 4 (US2)**: 28 tasks (includes 7 test tasks + 1 coverage check)
- **Phase 5 (US3)**: 32 tasks (includes 9 test tasks + 1 coverage check)
- **Phase 6 (US4)**: 38 tasks (includes 10 test tasks + 1 coverage check)
- **Phase 7 (Polish)**: 17 tasks (includes 5 final testing tasks)

**Total**: 155 tasks (**49 test tasks + 106 implementation tasks**)

### Estimated Effort

- **MVP (US1)**: ~3-4 weeks (1 developer, including tests)
- **Full Feature (US1-US4)**: ~8-10 weeks (1 developer, including comprehensive tests)
- **With Parallel Work**: ~5-6 weeks (2-3 developers, including tests)

### Risk Areas

1. **Realm.js integration**: First time using Realm in codebase - may need learning curve
2. **Image caching**: Large images may consume significant storage - need compression
3. **Sync conflicts**: Conflict resolution logic may need iteration based on real-world usage
4. **Background sync**: Expo background tasks have limitations - may need workarounds
5. **Storage limits**: LRU eviction needs careful testing to avoid data loss

### Success Validation

After implementation, validate against success criteria from spec.md:

- [ ] SC-001: Offline queries <1 second (measure with Realm.js profiling)
- [ ] SC-002: Downloads complete <30 seconds for 20 images
- [ ] SC-003: 95% sync success rate (track in analytics)
- [ ] SC-004: Offline indicator appears within 2 seconds
- [ ] SC-005: Storage management loads in <10 seconds
- [ ] SC-006: Auto-cached cities available for 7 days
- [ ] SC-007: Downloads consume <5% battery per city
- [ ] SC-008: 90% of users successfully use offline features
- [ ] SC-009: Test coverage achieves ≥80% for offline module (lines, branches, functions, statements)

---

## Notes

- **No contracts**: This feature doesn't define REST API contracts (mobile-only feature using existing city endpoints)
- **Tests required**: Using Jest and React Native Testing Library with 80% coverage target, TDD approach (tests written before implementation)
- **Clean Architecture compliance**: All tasks follow domain → infra → ui flow, respecting dependency rule
- **Realm.js documentation**: Refer to [Realm.js React Native docs](https://www.mongodb.com/docs/realm/sdk/react-native/) for implementation details
- **NetInfo documentation**: Refer to [NetInfo docs](https://github.com/react-native-netinfo/react-native-netinfo) for connectivity detection
- **Existing patterns**: Follow established patterns in codebase (useAppQuery/useAppMutation wrappers, RepositoryProvider, domain operations as hooks)
