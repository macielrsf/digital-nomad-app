# Data Model: Offline Mode for Saved Cities

**Feature**: Offline Mode  
**Date**: 2026-02-22  
**Storage**: Realm.js (local), Supabase (remote sync)

## Entity Overview

This feature introduces 4 new entities for offline functionality:

1. **OfflineCity** - Cached city data available offline
2. **SyncAction** - Pending actions requiring server sync
3. **OfflinePreferences** - User settings for offline behavior
4. **DownloadJob** - Active/queued download tasks

All entities stored in Realm.js for offline-first access with automatic sync to Supabase when online.

---

## Entity Definitions

### 1. OfflineCity

**Purpose**: Represents a complete city record cached for offline access, including all associated data (description, images, amenities, cost information).

**Domain Entity** (`src/domain/offline/OfflineCity.ts`):

```typescript
export interface OfflineCity {
  readonly cityId: string; // Foreign key to City entity
  readonly cityData: CityData; // Complete city information (JSON)
  readonly images: CachedImage[]; // Cached images (base64 or file URLs)
  readonly downloadedAt: Date; // When city was cached
  readonly lastAccessedAt: Date; // Last view/access time (for LRU)
  readonly storageSize: number; // Total size in bytes
  readonly isExplicitDownload: boolean; // True if user explicitly downloaded
  readonly version: number; // Data version for staleness detection
}

export interface CityData {
  // Matches existing City entity structure
  id: string;
  name: string;
  country: string;
  description: string;
  costOfLiving: number;
  internetSpeed: number;
  safetyRating: number;
  climate: string;
  touristAttractions: TouristAttraction[];
  categories: Category[];
  relatedCities: string[]; // City IDs only (lightweight)
}

export interface CachedImage {
  id: string;
  url: string; // Original URL
  localUri: string; // Local file path or base64
  size: number; // Size in bytes
  type: 'hero' | 'gallery' | 'attraction';
  width: number;
  height: number;
}

export interface TouristAttraction {
  id: string;
  name: string;
  description: string;
  location: { lat: number; lng: number };
}
```

**Realm Schema** (`src/infra/repositories/adapters/realm/models/RealmOfflineCity.ts`):

```typescript
import Realm from 'realm';

export class RealmOfflineCity extends Realm.Object<RealmOfflineCity> {
  _id!: Realm.BSON.ObjectId;
  cityId!: string;
  cityDataJson!: string; // CityData serialized as JSON
  imagesJson!: string; // CachedImage[] serialized as JSON
  downloadedAt!: Date;
  lastAccessedAt!: Date;
  storageSize!: number;
  isExplicitDownload!: boolean;
  version!: number;

  static schema: Realm.ObjectSchema = {
    name: 'OfflineCity',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      cityId: { type: 'string', indexed: true }, // Index for fast lookups
      cityDataJson: 'string',
      imagesJson: 'string',
      downloadedAt: 'date',
      lastAccessedAt: { type: 'date', indexed: true }, // Index for LRU
      storageSize: 'int',
      isExplicitDownload: 'bool',
      version: { type: 'int', default: 1 },
    },
  };
}
```

**Validation Rules**:

- `cityId` must reference a valid City in the system
- `storageSize` must be > 0
- `version` increments on each update
- `lastAccessedAt` automatically updated on read
- `cityDataJson` must be valid JSON

**Relationships**:

- **City (1:1)**: One OfflineCity maps to one City entity (via `cityId`)
- Foreign key relationship (not enforced by Realm, handled in repository layer)

**Storage Estimates**:

- Minimal city (text only): ~50 KB
- Average city (text + 10 images): ~5 MB
- Large city (text + 20 images): ~10 MB

---

### 2. SyncAction

**Purpose**: Represents a user action performed offline that must be synchronized to the server when connectivity is restored.

**Domain Entity** (`src/domain/offline/SyncAction.ts`):

```typescript
export interface SyncAction {
  readonly id: string; // Unique ID (UUID)
  readonly actionType: SyncActionType;
  readonly entityId: string; // ID of affected entity (cityId, noteId, etc.)
  readonly actionData: Record<string, any>; // Action-specific payload
  readonly timestamp: Date; // When action was performed locally
  readonly syncStatus: SyncStatus;
  readonly retryCount: number; // Number of sync attempts
  readonly lastAttemptAt?: Date; // Last sync attempt time
  readonly errorMessage?: string; // If sync failed, error details
}

export enum SyncActionType {
  SAVE_CITY = 'SAVE_CITY',
  UNSAVE_CITY = 'UNSAVE_CITY',
  ADD_NOTE = 'ADD_NOTE',
  UPDATE_NOTE = 'UPDATE_NOTE',
  DELETE_NOTE = 'DELETE_NOTE',
  UPDATE_PREFERENCES = 'UPDATE_PREFERENCES',
}

export enum SyncStatus {
  PENDING = 'PENDING', // Not yet synced
  SYNCING = 'SYNCING', // Sync in progress
  SUCCESS = 'SUCCESS', // Successfully synced
  FAILED = 'FAILED', // Sync failed, will retry
  CONFLICT = 'CONFLICT', // Conflict detected, needs resolution
}
```

**Realm Schema** (`src/infra/repositories/adapters/realm/models/RealmSyncAction.ts`):

```typescript
export class RealmSyncAction extends Realm.Object<RealmSyncAction> {
  _id!: Realm.BSON.ObjectId;
  id!: string; // UUID for idempotency
  actionType!: string; // Enum as string
  entityId!: string;
  actionDataJson!: string; // Payload serialized as JSON
  timestamp!: Date;
  syncStatus!: string; // Enum as string
  retryCount!: number;
  lastAttemptAt?: Date;
  errorMessage?: string;

  static schema: Realm.ObjectSchema = {
    name: 'SyncAction',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      id: { type: 'string', indexed: true }, // UUID indexed
      actionType: 'string',
      entityId: { type: 'string', indexed: true }, // Index for filtering
      actionDataJson: 'string',
      timestamp: { type: 'date', indexed: true }, // Index for FIFO sorting
      syncStatus: { type: 'string', indexed: true }, // Index for pending query
      retryCount: { type: 'int', default: 0 },
      lastAttemptAt: 'date?',
      errorMessage: 'string?',
    },
  };
}
```

**Validation Rules**:

- `id` must be a valid UUID v4
- `actionType` must be one of the enum values
- `syncStatus` must be one of the enum values
- `retryCount` must be >= 0, max 5
- `timestamp` must not be in the future

**Relationships**:

- **Entity (1:1)**: One SyncAction references one entity (City, Note, etc.) via `entityId`
- Relationship type depends on `actionType`

**Example Action Data**:

```typescript
// SAVE_CITY action
{
  actionType: 'SAVE_CITY',
  entityId: 'city-uuid-123',
  actionData: {
    userId: 'user-uuid-456',
    cityId: 'city-uuid-123',
  },
  timestamp: new Date('2026-02-22T10:30:00Z'),
  syncStatus: 'PENDING',
}

// ADD_NOTE action
{
  actionType: 'ADD_NOTE',
  entityId: 'note-uuid-789',
  actionData: {
    cityId: 'city-uuid-123',
    content: 'Great coffee shops in Old Town!',
    createdBy: 'user-uuid-456',
  },
  timestamp: new Date('2026-02-22T11:00:00Z'),
  syncStatus: 'PENDING',
}
```

---

### 3. OfflinePreferences

**Purpose**: User-configurable settings controlling offline behavior (auto-download, WiFi-only, storage limits).

**Domain Entity** (`src/domain/offline/OfflinePreferences.ts`):

```typescript
export interface OfflinePreferences {
  readonly userId: string; // User who owns these preferences
  readonly autoDownloadEnabled: boolean; // Auto-download saved cities
  readonly wifiOnlyDownload: boolean; // Download only on WiFi
  readonly maxStorageLimit: number; // Max storage in bytes (default: 100MB)
  readonly autoSync: boolean; // Auto-sync when online (default: true)
  readonly showStaleDataWarning: boolean; // Warn for data >30 days old
  readonly pruneAfterDays: number; // Auto-delete cities not accessed (default: 7)
  readonly updatedAt: Date;
}
```

**Realm Schema** (`src/infra/repositories/adapters/realm/models/RealmOfflinePreferences.ts`):

```typescript
export class RealmOfflinePreferences extends Realm.Object<RealmOfflinePreferences> {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  autoDownloadEnabled!: boolean;
  wifiOnlyDownload!: boolean;
  maxStorageLimit!: number;
  autoSync!: boolean;
  showStaleDataWarning!: boolean;
  pruneAfterDays!: number;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'OfflinePreferences',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: { type: 'string', indexed: true }, // One pref set per user
      autoDownloadEnabled: { type: 'bool', default: false },
      wifiOnlyDownload: { type: 'bool', default: true },
      maxStorageLimit: { type: 'int', default: 100 * 1024 * 1024 }, // 100MB
      autoSync: { type: 'bool', default: true },
      showStaleDataWarning: { type: 'bool', default: true },
      pruneAfterDays: { type: 'int', default: 7 },
      updatedAt: 'date',
    },
  };
}
```

**Validation Rules**:

- `userId` must be unique (one preferences object per user)
- `maxStorageLimit` must be between 50MB - 500MB
- `pruneAfterDays` must be between 1 - 90 days

**Default Values**:

- `autoDownloadEnabled`: false (opt-in)
- `wifiOnlyDownload`: true (protect cellular data)
- `maxStorageLimit`: 100 MB
- `autoSync`: true
- `showStaleDataWarning`: true
- `pruneAfterDays`: 7 days

**Relationships**:

- **User (1:1)**: One OfflinePreferences per user

---

### 4. DownloadJob

**Purpose**: Tracks active, queued, or completed download tasks with progress information.

**Domain Entity** (`src/domain/offline/DownloadJob.ts`):

```typescript
export interface DownloadJob {
  readonly id: string; // Unique job ID (UUID)
  readonly cityId: string; // City being downloaded
  readonly status: DownloadStatus;
  readonly progress: number; // 0-100 percentage
  readonly currentStep: string; // "Downloading images (5/10)"
  readonly totalBytes: number; // Total size to download
  readonly downloadedBytes: number; // Bytes downloaded so far
  readonly startedAt: Date;
  readonly completedAt?: Date;
  readonly errorMessage?: string;
}

export enum DownloadStatus {
  QUEUED = 'QUEUED', // Waiting to start
  DOWNLOADING = 'DOWNLOADING', // In progress
  PAUSED = 'PAUSED', // User paused or connection lost
  COMPLETED = 'COMPLETED', // Successfully completed
  FAILED = 'FAILED', // Failed with error
  CANCELLED = 'CANCELLED', // User cancelled
}
```

**Realm Schema** (`src/infra/repositories/adapters/realm/models/RealmDownloadJob.ts`):

```typescript
export class RealmDownloadJob extends Realm.Object<RealmDownloadJob> {
  _id!: Realm.BSON.ObjectId;
  id!: string;
  cityId!: string;
  status!: string;
  progress!: number;
  currentStep!: string;
  totalBytes!: number;
  downloadedBytes!: number;
  startedAt!: Date;
  completedAt?: Date;
  errorMessage?: string;

  static schema: Realm.ObjectSchema = {
    name: 'DownloadJob',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      id: { type: 'string', indexed: true },
      cityId: { type: 'string', indexed: true },
      status: { type: 'string', indexed: true }, // Index for filtering active jobs
      progress: { type: 'int', default: 0 },
      currentStep: { type: 'string', default: 'Initializing...' },
      totalBytes: { type: 'int', default: 0 },
      downloadedBytes: { type: 'int', default: 0 },
      startedAt: 'date',
      completedAt: 'date?',
      errorMessage: 'string?',
    },
  };
}
```

**Validation Rules**:

- `progress` must be between 0-100
- `downloadedBytes` <= `totalBytes`
- `status` must be one of the enum values
- If `status` is COMPLETED, `completedAt` must be set
- If `status` is FAILED, `errorMessage` must be set

**Lifecycle**:

1. **QUEUED** → User taps "Download for Offline" → Create job
2. **DOWNLOADING** → Download manager picks up job → Updates progress
3. **COMPLETED** / **FAILED** / **CANCELLED** → Terminal state

**Cleanup**:

- Completed jobs deleted after 24 hours
- Failed jobs kept for 7 days (user can retry)
- Cancelled jobs deleted immediately

---

## Entity Relationships Diagram

```
┌─────────────────┐
│  OfflinePreferences │  (1 per user)
└─────────────────┘
         │
         │ userId
         ▼
┌─────────────────┐       cityId        ┌─────────────┐
│   OfflineCity   │◄────────────────────│   City      │
│                 │                     │  (existing) │
│  - cityId       │  1:1 relationship   └─────────────┘
│  - cityData     │
│  - images[]     │
│  - downloadedAt │
│  - storageSize  │
└─────────────────┘
         │
         │ referenced by
         ▼
┌─────────────────┐
│  DownloadJob    │  (0..n jobs per city)
│                 │
│  - cityId       │
│  - status       │
│  - progress     │
└─────────────────┘

┌─────────────────┐       entityId       ┌─────────────┐
│   SyncAction    │────────────────────▶ │   Entity    │
│                 │                     │  (City/Note) │
│  - actionType   │  1:1 relationship   └─────────────┘
│  - entityId     │
│  - syncStatus   │
└─────────────────┘
```

## Storage Estimates

| Entity             | Typical Size | Max Size | Count per User   |
| ------------------ | ------------ | -------- | ---------------- |
| OfflineCity        | 5 MB         | 15 MB    | 20-100 cities    |
| SyncAction         | 1 KB         | 10 KB    | 0-500 actions    |
| OfflinePreferences | 500 bytes    | 1 KB     | 1                |
| DownloadJob        | 500 bytes    | 1 KB     | 0-10 active jobs |

**Total Storage Example** (50 cached cities):

- Cities: 50 × 5 MB = 250 MB (within 100MB limit via LRU pruning)
- Sync actions: 100 × 1 KB = 100 KB
- Preferences: 1 × 500 bytes = 500 bytes
- Download jobs: 5 × 500 bytes = 2.5 KB
- **Total: ~250 MB** (managed via automatic pruning)

## Migration Strategy

**Version 1.0.0** (Initial):

- Create all 4 schemas
- No migration needed (new feature)

**Future Migrations**:

- Realm supports automatic migrations for additive changes (new properties)
- Breaking changes require manual migration functions
- Store schema version in Realm config: `schemaVersion: 1`

**Example Future Migration** (v2 - add `priority` to SyncAction):

```typescript
const realmConfig: Realm.Configuration = {
  schema: [
    RealmOfflineCity,
    RealmSyncAction,
    RealmOfflinePreferences,
    RealmDownloadJob,
  ],
  schemaVersion: 2,
  onMigration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const oldObjects = oldRealm.objects('SyncAction');
      const newObjects = newRealm.objects('SyncAction');

      for (let i = 0; i < oldObjects.length; i++) {
        newObjects[i].priority = 'NORMAL'; // Default value
      }
    }
  },
};
```

## Query Patterns

### Common Queries

**Get offline city by ID**:

```typescript
realm.objectForPrimaryKey('OfflineCity', cityId);
```

**Get all offline cities (sorted by last accessed)**:

```typescript
realm.objects('OfflineCity').sorted('lastAccessedAt', true); // descending
```

**Get pending sync actions (FIFO order)**:

```typescript
realm
  .objects('SyncAction')
  .filtered('syncStatus == "PENDING"')
  .sorted('timestamp', false); // ascending (oldest first)
```

**Get active download jobs**:

```typescript
realm
  .objects('DownloadJob')
  .filtered('status == "DOWNLOADING" OR status == "QUEUED"');
```

**Calculate total storage used**:

```typescript
const cities = realm.objects('OfflineCity');
const totalBytes = cities.sum('storageSize');
```

**LRU eviction candidates**:

```typescript
realm
  .objects('OfflineCity')
  .filtered('isExplicitDownload == false')
  .sorted('lastAccessedAt', false) // ascending (oldest first)
  .slice(0, numToEvict);
```

## Indexing Strategy

Indexes improve query performance for frequently-searched fields:

- **OfflineCity**: `cityId` (lookup by ID), `lastAccessedAt` (LRU sorting)
- **SyncAction**: `id` (idempotency check), `entityId` (filter by entity), `timestamp` (FIFO), `syncStatus` (pending query)
- **OfflinePreferences**: `userId` (one per user)
- **DownloadJob**: `id`, `cityId`, `status` (filter active jobs)

## Data Integrity

**Constraints**:

- Realm does not enforce foreign key constraints (handled in repository layer)
- Repository methods must validate references before writes
- Cascade deletes implemented manually in repository

**Example**: When deleting an OfflineCity:

```typescript
async deleteCity(cityId: string): Promise<void> {
  const realm = await Realm.open(realmConfig);

  realm.write(() => {
    // Delete city
    const city = realm.objectForPrimaryKey('OfflineCity', cityId);
    if (city) realm.delete(city);

    // Delete related download jobs (cascade)
    const jobs = realm.objects('DownloadJob').filtered('cityId == $0', cityId);
    realm.delete(jobs);

    // NOTE: Do NOT delete SyncActions (pending sync must complete)
  });
}
```

**Backup Strategy**:

- Realm file stored in app's documents directory
- iOS: Backed up to iCloud by default
- Android: Backed up via Auto Backup (API 23+)
- Manual export available in Offline Settings (future enhancement)
