# Tasks: Offline Mode for Saved Cities

**Input**: Design documents from `/specs/001-offline-mode/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Tests are NOT requested in the specification, so test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: Always `- [ ]` (markdown checkbox)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and Realm.js configuration

- [ ] T001 Install Realm.js dependencies: `npx expo install @realm/react realm`
- [ ] T002 Install NetInfo for connectivity detection: `npx expo install @react-native-community/netinfo`
- [ ] T003 [P] Install file system for image caching: `npx expo install expo-file-system`
- [ ] T004 Create Realm configuration file in `src/infra/repositories/adapters/realm/realmConfig.ts`
- [ ] T005 Wrap app with RealmProvider in `app/_layout.tsx`
- [ ] T006 [P] Create Realm adapter index file in `src/infra/repositories/adapters/realm/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create NetworkService with connectivity detection hook in `src/infra/services/NetworkService.ts`
- [ ] T008 [P] Create base offline domain directory structure `src/domain/offline/`
- [ ] T009 Update RepositoryProvider to support offline repositories in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T010 [P] Create Realm models directory `src/infra/repositories/adapters/realm/models/`
- [ ] T011 Add Realm adapter to app initialization flow (provider integration)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Downloaded Cities Offline (Priority: P1) 🎯 MVP

**Goal**: Auto-cache cities when viewed online, display cached data offline, show offline indicators

**Independent Test**: View 3 cities while online (Chiang Mai, Lisbon, Medellin), enable airplane mode, navigate to each city's details page, verify all information displays correctly without internet.

### Domain Layer for User Story 1

- [ ] T012 [P] [US1] Create OfflineCity domain entity in `src/domain/offline/OfflineCity.ts`
- [ ] T013 [P] [US1] Create IOfflineCityRepo interface in `src/domain/offline/IOfflineCityRepo.ts`
- [ ] T014 [US1] Create useOfflineCityGet operation in `src/domain/offline/operations/useOfflineCityGet.ts`
- [ ] T015 [US1] Create useOfflineCityCache operation in `src/domain/offline/operations/useOfflineCityCache.ts`

### Infrastructure Layer for User Story 1

- [ ] T016 [US1] Create RealmOfflineCity schema model in `src/infra/repositories/adapters/realm/models/RealmOfflineCity.ts`
- [ ] T017 [US1] Implement RealmOfflineCityRepo in `src/infra/repositories/adapters/realm/RealmOfflineCityRepo.ts`
- [ ] T018 [US1] Register RealmOfflineCityRepo in RepositoryProvider in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T019 [US1] Update Realm configuration to include OfflineCity schema in `src/infra/repositories/adapters/realm/realmConfig.ts`

### UI Layer for User Story 1

- [ ] T020 [P] [US1] Create OfflineIndicator component in `src/ui/components/OfflineIndicator.tsx`
- [ ] T021 [P] [US1] Create OfflineBadge component for city cards in `src/ui/components/OfflineBadge.tsx`
- [ ] T022 [US1] Integrate auto-cache in city details screen in `app/(protected)/city-details/[id].tsx`
- [ ] T023 [US1] Add OfflineIndicator to app header/layout in `app/_layout.tsx`
- [ ] T024 [US1] Add offline availability badges to saved cities list in `app/(protected)/(tabs)/index.tsx`
- [ ] T025 [US1] Implement offline fallback logic in city details screen (show cached data when offline)
- [ ] T026 [US1] Add "This city requires internet connection" message for non-cached cities when offline

**Checkpoint**: At this point, User Story 1 (MVP) should be fully functional - users can view cached cities offline

---

## Phase 4: User Story 2 - Explicit Download for Offline Access (Priority: P2)

**Goal**: Allow users to explicitly download cities with progress tracking, "Download All" functionality

**Independent Test**: View a city details page while online, tap "Download for Offline," see progress indicator reach 100%, enable airplane mode, verify the city with all images is fully accessible offline.

### Domain Layer for User Story 2

- [ ] T027 [P] [US2] Create DownloadJob domain entity in `src/domain/offline/DownloadJob.ts`
- [ ] T028 [P] [US2] Create IDownloadJobRepo interface in `src/domain/offline/IDownloadJobRepo.ts`
- [ ] T029 [US2] Create useOfflineCityDownload operation in `src/domain/offline/operations/useOfflineCityDownload.ts`
- [ ] T030 [US2] Create useDownloadAllCities operation in `src/domain/offline/operations/useDownloadAllCities.ts`
- [ ] T031 [US2] Create useDownloadJobStatus operation in `src/domain/offline/operations/useDownloadJobStatus.ts`

### Infrastructure Layer for User Story 2

- [ ] T032 [US2] Create RealmDownloadJob schema model in `src/infra/repositories/adapters/realm/models/RealmDownloadJob.ts`
- [ ] T033 [US2] Implement RealmDownloadJobRepo in `src/infra/repositories/adapters/realm/RealmDownloadJobRepo.ts`
- [ ] T034 [US2] Create DownloadService for managing downloads in `src/infra/services/DownloadService.ts`
- [ ] T035 [US2] Implement image download and caching logic using expo-file-system in DownloadService
- [ ] T036 [US2] Add resumable download logic (handle partial downloads) in DownloadService
- [ ] T037 [US2] Register RealmDownloadJobRepo in RepositoryProvider in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T038 [US2] Update Realm configuration to include DownloadJob schema in `src/infra/repositories/adapters/realm/realmConfig.ts`

### UI Layer for User Story 2

- [ ] T039 [P] [US2] Create DownloadButton component in `src/ui/components/DownloadButton.tsx`
- [ ] T040 [P] [US2] Create DownloadProgress component in `src/ui/components/DownloadProgress.tsx`
- [ ] T041 [US2] Add DownloadButton to city details screen in `app/(protected)/city-details/[id].tsx`
- [ ] T042 [US2] Display download progress in city details screen
- [ ] T043 [US2] Add "Downloaded" badge to city cards when download complete
- [ ] T044 [US2] Implement "Download All" button in saved cities screen in `app/(protected)/(tabs)/index.tsx`
- [ ] T045 [US2] Show overall download progress for "Download All" functionality
- [ ] T046 [US2] Handle WiFi-only download preference (check connection type before download)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can explicitly download cities

---

## Phase 5: User Story 3 - Offline Actions Sync When Online (Priority: P3)

**Goal**: Queue offline actions (save/unsave cities, add notes), automatically sync when online, handle conflicts

**Independent Test**: Go offline, save 2 new cities and remove 1 saved city, make a note on a city, go back online, verify all changes sync correctly to the server.

### Domain Layer for User Story 3

- [ ] T047 [P] [US3] Create SyncAction domain entity in `src/domain/offline/SyncAction.ts`
- [ ] T048 [P] [US3] Create ISyncActionRepo interface in `src/domain/offline/ISyncActionRepo.ts`
- [ ] T049 [US3] Create useOfflineSync operation in `src/domain/offline/operations/useOfflineSync.ts`
- [ ] T050 [US3] Create useQueueOfflineAction operation in `src/domain/offline/operations/useQueueOfflineAction.ts`
- [ ] T051 [US3] Create usePendingSyncCount operation in `src/domain/offline/operations/usePendingSyncCount.ts`

### Infrastructure Layer for User Story 3

- [ ] T052 [US3] Create RealmSyncAction schema model in `src/infra/repositories/adapters/realm/models/RealmSyncAction.ts`
- [ ] T053 [US3] Implement RealmSyncActionRepo in `src/infra/repositories/adapters/realm/RealmSyncActionRepo.ts`
- [ ] T054 [US3] Create SyncService for managing sync queue in `src/infra/services/SyncService.ts`
- [ ] T055 [US3] Implement FIFO sync queue processing in SyncService
- [ ] T056 [US3] Implement conflict resolution logic ("last write wins") in SyncService
- [ ] T057 [US3] Add retry logic with exponential backoff for failed syncs in SyncService
- [ ] T058 [US3] Register RealmSyncActionRepo in RepositoryProvider in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T059 [US3] Update Realm configuration to include SyncAction schema in `src/infra/repositories/adapters/realm/realmConfig.ts`
- [ ] T060 [US3] Add connectivity listener to trigger sync when online in NetworkService in `src/infra/services/NetworkService.ts`

### UI Layer for User Story 3

- [ ] T061 [P] [US3] Create SyncPendingIndicator component in `src/ui/components/SyncPendingIndicator.tsx`
- [ ] T062 [P] [US3] Create SyncNotification component in `src/ui/components/SyncNotification.tsx`
- [ ] T063 [US3] Queue offline actions in city operations (save/unsave) with useQueueOfflineAction
- [ ] T064 [US3] Display "Pending sync" indicator when actions are queued
- [ ] T065 [US3] Show sync success notification when sync completes
- [ ] T066 [US3] Show sync conflict notification when conflicts occur
- [ ] T067 [US3] Add "Retry" button for failed sync actions in notification
- [ ] T068 [US3] Update city list to refresh after successful sync

**Checkpoint**: All user stories 1, 2, and 3 should now be independently functional - offline actions sync when online

---

## Phase 6: User Story 4 - Offline Indicator and Data Management (Priority: P4)

**Goal**: Storage management UI, display storage usage, delete offline data, configure offline preferences

**Independent Test**: Toggle airplane mode and verify offline indicator appears, navigate to Settings > Offline Data, view storage usage, select cities to delete, confirm storage decreases.

### Domain Layer for User Story 4

- [ ] T069 [P] [US4] Create OfflinePreferences domain entity in `src/domain/offline/OfflinePreferences.ts`
- [ ] T070 [P] [US4] Create IOfflinePreferencesRepo interface in `src/domain/offline/IOfflinePreferencesRepo.ts`
- [ ] T071 [US4] Create useOfflineStorage operation in `src/domain/offline/operations/useOfflineStorage.ts`
- [ ] T072 [US4] Create useOfflinePreferences operation in `src/domain/offline/operations/useOfflinePreferences.ts`
- [ ] T073 [US4] Create useDeleteOfflineCity operation in `src/domain/offline/operations/useDeleteOfflineCity.ts`
- [ ] T074 [US4] Create useClearAllOfflineData operation in `src/domain/offline/operations/useClearAllOfflineData.ts`

### Infrastructure Layer for User Story 4

- [ ] T075 [US4] Create RealmOfflinePreferences schema model in `src/infra/repositories/adapters/realm/models/RealmOfflinePreferences.ts`
- [ ] T076 [US4] Implement RealmOfflinePreferencesRepo in `src/infra/repositories/adapters/realm/RealmOfflinePreferencesRepo.ts`
- [ ] T077 [US4] Implement storage calculation logic in RealmOfflineCityRepo (getTotalStorageUsed method)
- [ ] T078 [US4] Implement LRU eviction logic in RealmOfflineCityRepo (findLRUCandidates method)
- [ ] T079 [US4] Implement auto-prune logic for stale data (findStale method)
- [ ] T080 [US4] Register RealmOfflinePreferencesRepo in RepositoryProvider in `src/infra/repositories/RepositoryProvider.tsx`
- [ ] T081 [US4] Update Realm configuration to include OfflinePreferences schema in `src/infra/repositories/adapters/realm/realmConfig.ts`
- [ ] T082 [US4] Add background task for auto-pruning stale cities (runs daily)

### UI Layer for User Story 4

- [ ] T083 [US4] Create OfflineSettingsScreen in `src/ui/screens/OfflineSettingsScreen.tsx`
- [ ] T084 [US4] Create StorageUsageDisplay component in `src/ui/components/StorageUsageDisplay.tsx`
- [ ] T085 [US4] Create OfflineCityListItem component for storage management in `src/ui/components/OfflineCityListItem.tsx`
- [ ] T086 [US4] Create OfflinePreferencesForm component in `src/ui/components/OfflinePreferencesForm.tsx`
- [ ] T087 [US4] Create offline settings route in `app/(protected)/settings/offline.tsx`
- [ ] T088 [US4] Display total storage used and per-city storage in OfflineSettingsScreen
- [ ] T089 [US4] Implement "Remove Downloaded Data" button for individual cities
- [ ] T090 [US4] Implement "Clear All Offline Data" button with confirmation dialog
- [ ] T091 [US4] Add toggle for "Auto-download saved cities" preference
- [ ] T092 [US4] Add toggle for "Download over WiFi only" preference
- [ ] T093 [US4] Add storage limit slider with current usage indicator
- [ ] T094 [US4] Add "Auto-prune after X days" setting
- [ ] T095 [US4] Display stale data warning when viewing cities >30 days old

**Checkpoint**: All user stories should now be complete - full offline mode with storage management

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, documentation, and final cleanup

- [ ] T096 [P] Update README.md with offline mode documentation
- [ ] T097 [P] Add offline mode section to quickstart.md validation checklist
- [ ] T098 Code cleanup and refactoring
  - Verify no dependency rule violations (domain importing from infra/ui)
  - Extract repeated code (DRY principle): Realm serialization/deserialization helpers
  - Improve function/variable naming for clarity
  - Break down functions exceeding 30 lines (especially in SyncService)
  - Remove unused code and commented-out blocks
- [ ] T099 Performance optimization across all stories
  - Add Realm indexes for frequently queried fields (cityId, lastAccessedAt, syncStatus)
  - Optimize image compression settings
  - Profile and optimize background sync performance
  - Implement debounce for auto-cache to avoid excessive writes
- [ ] T100 [P] Add error boundaries for offline-related components
- [ ] T101 [P] Add analytics events for offline feature usage (downloads, sync, storage)
- [ ] T102 Security hardening
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
- [ ] T106 Final manual testing checklist
  - Test all user stories end-to-end
  - Test edge cases (storage full, partial downloads, sync conflicts)
  - Test on both iOS and Android
  - Test airplane mode transitions
  - Test WiFi-only download preference

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
1. Domain entities first (T012-T013 for US1, etc.)
2. Infrastructure implementation (T016-T019 for US1, etc.)
3. Domain operations (T014-T015 for US1, etc.)
4. UI integration (T020-T026 for US1, etc.)

**Best Practice**: Complete one story fully before moving to next priority

### Parallel Opportunities

**Setup Phase (Phase 1):**
- T002 (NetInfo), T003 (file-system), T006 (Realm index) can run in parallel

**Foundational Phase (Phase 2):**
- T007 (NetworkService), T008 (domain structure), T010 (models directory) can run in parallel

**Within User Story 1:**
- T012 (OfflineCity entity), T013 (IOfflineCityRepo) can run in parallel
- T020 (OfflineIndicator), T021 (OfflineBadge) can run in parallel

**Within User Story 2:**
- T027 (DownloadJob entity), T028 (IDownloadJobRepo) can run in parallel
- T039 (DownloadButton), T040 (DownloadProgress) can run in parallel

**Within User Story 3:**
- T047 (SyncAction entity), T048 (ISyncActionRepo) can run in parallel
- T061 (SyncPendingIndicator), T062 (SyncNotification) can run in parallel

**Within User Story 4:**
- T069 (OfflinePreferences entity), T070 (IOfflinePreferencesRepo) can run in parallel

**Cross-Story Parallelization:**
- Once Foundational is complete, multiple developers can work on different user stories in parallel
- Recommended: One developer on US1 (MVP), another on US2 (downloads), another on US3 (sync)

**Polish Phase (Phase 7):**
- T096 (README), T097 (quickstart), T100 (error boundaries), T101 (analytics), T105 (migration guide) can run in parallel

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**MVP = User Story 1 only** (Phase 1 + Phase 2 + Phase 3)

**Tasks**: T001-T026 (26 tasks)

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

- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **Phase 3 (US1 - MVP)**: 15 tasks
- **Phase 4 (US2)**: 20 tasks
- **Phase 5 (US3)**: 22 tasks
- **Phase 6 (US4)**: 27 tasks
- **Phase 7 (Polish)**: 11 tasks

**Total**: 106 tasks

### Estimated Effort

- **MVP (US1)**: ~2-3 weeks (1 developer)
- **Full Feature (US1-US4)**: ~6-8 weeks (1 developer)
- **With Parallel Work**: ~4-5 weeks (2-3 developers)

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

---

## Notes

- **No contracts**: This feature doesn't define REST API contracts (mobile-only feature using existing city endpoints)
- **No tests requested**: Specification doesn't request TDD approach, so test tasks are excluded
- **Clean Architecture compliance**: All tasks follow domain → infra → ui flow, respecting dependency rule
- **Realm.js documentation**: Refer to [Realm.js React Native docs](https://www.mongodb.com/docs/realm/sdk/react-native/) for implementation details
- **NetInfo documentation**: Refer to [NetInfo docs](https://github.com/react-native-netinfo/react-native-netinfo) for connectivity detection
- **Existing patterns**: Follow established patterns in codebase (useAppQuery/useAppMutation wrappers, RepositoryProvider, domain operations as hooks)
