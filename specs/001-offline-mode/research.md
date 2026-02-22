# Research: Offline Mode for Saved Cities

**Feature**: Offline Mode  
**Date**: 2026-02-22  
**Context**: Enable digital nomads to access city information without internet connectivity using Realm.js for local storage

## Research Questions Resolved

### 1. Local Storage Solution: Realm.js

**Decision**: Use @realm/react (Realm.js SDK for React Native)

**Rationale**:

- **Object-oriented database**: Store complex city objects with relationships (city → tourist attractions → images)
- **Reactive architecture**: Realm hooks (`useQuery`, `useObject`) integrate seamlessly with React Native
- **Automatic change tracking**: Live objects update UI automatically when data changes
- **Efficient queries**: Query capabilities far superior to AsyncStorage (which is key-value only)
- **Binary format**: Faster than JSON serialization/deserialization in AsyncStorage
- **File-based**: Each Realm file is ~1KB overhead minimum, perfect for mobile apps
- **Well-maintained**: Official MongoDB support, actively updated for Expo compatibility

**Alternatives Considered**:

- **AsyncStorage**: Rejected - Key-value store inadequate for complex city objects, no query capabilities, slower for large datasets
- **SQLite (expo-sqlite)**: Rejected - More boilerplate than Realm, no reactive updates, requires manual SQL queries
- **WatermelonDB**: Rejected - Less mature ecosystem than Realm, more complex setup
- **IndexedDB (web)**: N/A - Not available in React Native

**Implementation Notes**:

- Use `@realm/react` package (version 0.6.0+)
- Configuration: `realmConfig.ts` with schema definitions
- Schemas: `RealmOfflineCity`, `RealmSyncAction`, `RealmDownloadJob`
- Provider: Wrap app with `<RealmProvider>` for context access
- Hooks: `useQuery()`, `useObject()`, `useRealm()` for CRUD operations

### 2. Offline-First Architecture Pattern

**Decision**: Implement "Sync Later" pattern with eventual consistency

**Rationale**:

- **Local-first writes**: All user actions write to Realm immediately (instant feedback)
- **Background sync**: Queue actions (save/unsave city, add notes) when offline
- **Automatic sync**: Detect connectivity restoration and sync pending actions
- **Conflict resolution**: "Latest write wins" strategy (timestamp-based)
- **User transparency**: Show "Pending sync" indicators, notify on sync success/failure

**Patterns Evaluated**:

- **Sync Later (Chosen)**: Optimistic updates, queue for background sync
  - ✅ Pro: Best UX - instant local updates, works offline
  - ✅ Pro: Simple conflict resolution (timestamp-based)
  - ✅ Pro: Matches user expectations for mobile apps
- **Sync Now**: Immediate remote sync required
  - ❌ Con: Blocks user when offline
  - ❌ Con: Poor UX in areas with flaky connectivity
- **CRDT (Conflict-free Replicated Data Types)**: Complex merge logic
  - ❌ Con: Overkill for this use case (city data is mostly read-only)
  - ❌ Con: Significant implementation overhead

**Implementation Strategy**:

1. **Write path**: User action → Realm write → Queue sync action (if online → sync immediately)
2. **Read path**: Always read from Realm first (cached data) → Show immediately → Optionally fetch fresh data in background
3. **Sync queue**: Store sync actions in `RealmSyncAction` with status (pending/syncing/success/failed)
4. **Connectivity monitor**: Use `@react-native-community/netinfo` to detect online/offline
5. **Background sync**: Trigger on connectivity restoration via NetInfo listener

### 3. Automatic City Caching Strategy

**Decision**: Cache-on-view with 7-day TTL (time-to-live)

**Rationale**:

- **Implicit caching**: When user views a city details page → automatically cache to Realm
- **No user action needed**: Zero friction for basic offline access
- **TTL expiration**: Auto-prune cities not accessed for 7 days (configurable)
- **Storage limits**: Implement 100MB max (configurable) with LRU eviction

**Caching Flow**:

1. User navigates to city details page (online)
2. City data fetched from Supabase (existing flow unchanged)
3. `useOfflineCityCache` operation writes city + images to Realm
4. Metadata tracked: `downloadedAt`, `lastAccessedAt`, `storageSize`
5. Background: Periodic pruning job removes expired/excess cached cities

**Cache Invalidation Rules**:

- **Stale data**: City older than 30 days → show "Data may be outdated" warning
- **LRU eviction**: When storage limit exceeded → remove least recently accessed cities
- **Manual deletion**: User can remove cities via Offline Settings screen

### 4. Explicit Download Implementation

**Decision**: Foreground download with progress tracking

**Rationale**:

- **User control**: "Download for Offline" button on city details page
- **Progress feedback**: Show percentage (0-100%) and current step
- **Resumable downloads**: Track `DownloadJob` in Realm, resume partial downloads
- **Image optimization**: Compress images to balance quality vs. storage (WebP format preferred)
- **Background continuation**: Use background tasks for downloads >30s

**Download Process**:

1. User taps "Download for Offline" → Create `DownloadJob` in Realm (status: pending)
2. Fetch city data from Supabase → Store in Realm
3. Download images sequentially:
   - Update progress: `downloadedImages / totalImages * 100`
   - Store compressed images as base64 or file URLs in Realm
4. Mark `DownloadJob` as complete → Show "Downloaded" badge on city card

**"Download All" Implementation**:

- Queue multiple `DownloadJob` entries for each saved city
- Process sequentially (avoid overwhelming network)
- Show overall progress: "Downloading 3 of 10 cities..."
- WiFi-only option: Check `NetInfo.type === 'wifi'` before starting

### 5. Sync Queue and Conflict Resolution

**Decision**: FIFO queue with timestamp-based conflict resolution

**Rationale**:

- **Queue structure**: `RealmSyncAction` entries with `timestamp`, `actionType`, `entityId`, `actionData`, `syncStatus`
- **Action types**: `SAVE_CITY`, `UNSAVE_CITY`, `ADD_NOTE`, `UPDATE_PREFERENCES`
- **Processing order**: FIFO (first-in, first-out) to preserve user intent
- **Conflict strategy**: Last write wins (server timestamp comparison)
- **Idempotency**: Each action has unique ID to prevent duplicate processing

**Conflict Resolution Example**:

```
Scenario: User saves CityX offline, then another device unsaves it online
1. User's device: Queue SAVE_CITY action (timestamp: T1)
2. Another device: UNSAVE_CITY synced to server (timestamp: T2, T2 > T1)
3. Connectivity restored: Sync queue processes SAVE_CITY
4. Server detects conflict: Compare timestamps (T2 > T1)
5. Server responds: "Conflict - city already unsaved"
6. Client: Update local state to match server (unsave city locally)
7. Notify user: "City X was unsaved on another device"
```

**Sync Flow**:

1. NetInfo detects online status
2. `useSyncPending` operation triggers
3. Fetch all `SyncAction` with status=pending
4. Process each action:
   - Send HTTP request to Supabase
   - If success: Mark status=success, remove from queue after 24h
   - If conflict: Resolve per "last write wins", notify user
   - If failure: Mark status=failed, retry with exponential backoff
5. Show sync summary notification

### 6. Network Detection and Connectivity Handling

**Decision**: Use @react-native-community/netinfo with custom hook

**Rationale**:

- **Real-time detection**: Subscribe to connectivity changes
- **Connection types**: Detect WiFi vs. cellular (for WiFi-only downloads)
- **Offline indicator**: Show banner when offline
- **Auto-sync trigger**: Listener triggers sync when online status changes

**Implementation**:

```typescript
// useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      setConnectionType(state.type);

      if (state.isConnected && !isOnline) {
        // Connectivity restored → trigger sync
        triggerBackgroundSync();
      }
    });

    return () => unsubscribe();
  }, [isOnline]);

  return { isOnline, connectionType };
};
```

### 7. Integration with Existing Architecture

**Decision**: Realm adapter alongside InMemory/Supabase adapters

**Rationale**:

- **Repository pattern**: Create `RealmOfflineCityRepo` implementing `IOfflineCityRepo`
- **Adapter switching**: Provider determines which adapter to use (Realm for offline, Supabase for online)
- **Unified interface**: Domain operations remain unchanged, consume `IOfflineCityRepo`
- **Separation of concerns**: Realm code isolated in `src/infra/repositories/adapters/realm/`

**Adapter Integration**:

```typescript
// src/infra/repositories/RepositoryProvider.tsx
export const RepositoryProvider: React.FC<Props> = ({ children }) => {
  const repositories = useMemo(() => ({
    // Existing adapters
    cityRepo: USE_SUPABASE ? new SupabaseCityRepo() : new InMemoryCityRepo(),
    categoryRepo: USE_SUPABASE ? new SupabaseCategoryRepo() : new InMemoryCategoryRepo(),

    // New offline adapter
    offlineCityRepo: new RealmOfflineCityRepo(),  // Always use Realm for offline
    syncActionRepo: new RealmSyncActionRepo(),
  }), []);

  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>;
};
```

**Domain Operations Pattern**:

```typescript
// src/domain/offline/operations/useOfflineCityGet.ts
export const useOfflineCityGet = (cityId: string) => {
  const { offlineCityRepo } = useRepositories();

  return useAppQuery({
    queryKey: ['offline-city', cityId],
    queryFn: () => offlineCityRepo.findById(cityId),
  });
};
```

### 8. Storage Management and Optimization

**Decision**: Implement storage quotas with LRU eviction

**Rationale**:

- **Default limit**: 100MB max offline storage (configurable in settings)
- **Per-city tracking**: Store `storageSize` for each cached city
- **LRU eviction**: Automatically remove least recently accessed cities when approaching limit
- **User control**: UI to view storage, manually delete cities

**Storage Calculation**:

```
City Storage = JSON size + compressed image sizes
- City JSON: ~50-100 KB (description, amenities, cost data)
- Images: ~200-500 KB each compressed (WebP at 80% quality)
- Average city: 5-10 MB (1 hero image + 10-20 photos)
```

**Optimization Strategies**:

1. **Progressive image loading**: Download low-res previews first, full-res on demand
2. **Image compression**: Convert to WebP format, 80% quality, max 1920px width
3. **Selective caching**: Only cache images above the fold on initial view
4. **Lazy pruning**: Check storage limits weekly via background task, not on every access

### 9. Error Handling and Edge Cases

**Decision**: Graceful degradation with user notifications

**Error Scenarios**:

1. **Storage full**:
   - Show warning: "Storage almost full. Remove downloaded cities?"
   - Offer quick action: Navigate to Offline Settings
   - Auto-prune if user ignores warning (LRU eviction)

2. **Download interrupted**:
   - Mark `DownloadJob` as paused/failed
   - Offer "Resume Download" button
   - Store partial progress (downloaded image count)

3. **Sync failure**:
   - Retry with exponential backoff (1s → 2s → 4s → 8s, max 5 retries)
   - Show notification: "Sync failed. Retry?"
   - Keep failed actions in queue (don't lose user data)

4. **Corrupted Realm file**:
   - Detect on app launch (Realm throws error)
   - Backup current file, create new Realm
   - Log error to monitoring service
   - Notify user: "Offline data reset due to error"

5. **City data outdated**:
   - Show badge: "Updated 45 days ago"
   - Offer refresh: "Download latest data?"
   - Auto-refresh if Wi-Fi and storage available

### 10. Testing Strategy

**Decision**: Unit tests with in-memory Realm, integration tests with real Realm

**Testing Approach**:

1. **Unit Tests** (Domain Operations):
   - Mock `IOfflineCityRepo` interface
   - Test business logic independently
   - Example: `useOfflineCityCache` queues download job correctly

2. **Integration Tests** (Realm Adapter):
   - Use Realm in-memory configuration (`inMemory: true`)
   - Test CRUD operations against real Realm instance
   - Example: Write city to Realm, verify it's readable

3. **E2E Tests** (React Native Testing Library):
   - Test full offline flow: view city online → go offline → view cached city
   - Mock NetInfo for connectivity simulation
   - Example: Toggle airplane mode, verify offline indicator appears

**Test File Structure**:

```
src/domain/offline/operations/__tests__/
  useOfflineCityGet.test.ts
  useOfflineCityCache.test.ts
  useOfflineSync.test.ts

src/infra/repositories/adapters/realm/__tests__/
  RealmOfflineCityRepo.test.ts
  RealmSyncActionRepo.test.ts
```

## Technology Stack Summary

| Component         | Technology                      | Version           | Purpose                           |
| ----------------- | ------------------------------- | ----------------- | --------------------------------- |
| Local Database    | @realm/react                    | ^0.6.0            | Offline storage, reactive queries |
| Network Detection | @react-native-community/netinfo | ^11.0.0           | Connectivity monitoring           |
| Remote Sync       | Supabase                        | ^2.91.0           | Server-side data (existing)       |
| State Management  | React Query                     | (via useAppQuery) | Query caching, mutations          |
| Image Handling    | expo-image                      | ~3.0.8            | Optimized image loading           |
| File System       | expo-file-system                | Latest            | Image caching, file operations    |

## Implementation Phases

### Phase 0: Foundation ✅

- Research completed
- Technical decisions documented
- Architecture validated

### Phase 1: Core Offline Storage (P1 - MVP)

- Set up Realm configuration and schemas
- Implement `RealmOfflineCityRepo`
- Create auto-cache operation (`useOfflineCityCache`)
- Build offline read operation (`useOfflineCityGet`)
- Add offline indicator UI component

### Phase 2: Explicit Downloads (P2)

- Implement download job management
- Create download progress tracking
- Build "Download for Offline" button
- Implement "Download All" for saved cities
- Add storage management UI

### Phase 3: Sync Queue (P3)

- Implement `RealmSyncActionRepo`
- Build sync queue processing
- Create conflict resolution logic
- Add connectivity listener
- Implement background sync

### Phase 4: Management & Polish (P4)

- Build Offline Settings screen
- Implement storage usage display
- Add manual delete functionality
- Create auto-prune logic
- Polish error handling
