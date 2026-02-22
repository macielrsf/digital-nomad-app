# Quickstart Guide: Offline Mode for Saved Cities

**Feature**: Offline Mode  
**Audience**: Developers implementing the offline feature  
**Prerequisites**: Familiarity with React Native, TypeScript, Realm.js, and the app's Clean Architecture

---

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Domain Layer Usage](#domain-layer-usage)
4. [Infrastructure Layer Implementation](#infrastructure-layer-implementation)
5. [UI Layer Integration](#ui-layer-integration)
6. [Testing](#testing)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Installation

### 1. Install Dependencies

```bash
# Install Realm.js SDK for React Native
npx expo install @realm/react realm

# Install network detection library
npx expo install @react-native-community/netinfo

# Install file system library (for image caching)
npx expo install expo-file-system
```

### 2. Update package.json

```json
{
  "dependencies": {
    "@realm/react": "^0.6.0",
    "realm": "^12.0.0",
    "@react-native-community/netinfo": "^11.0.0",
    "expo-file-system": "~16.0.0"
  }
}
```

### 3. iOS/Android Configuration

**iOS** (ios/Podfile):
```ruby
# No additional configuration needed - Realm auto-links
```

**Android** (android/app/build.gradle):
```gradle
// No additional configuration needed - Realm auto-links
```

---

## Configuration

### 1. Create Realm Configuration

**File**: `src/infra/repositories/adapters/realm/realmConfig.ts`

```typescript
import Realm from 'realm';
import {
  RealmOfflineCity,
  RealmSyncAction,
  RealmOfflinePreferences,
  RealmDownloadJob,
} from './models';

export const realmConfig: Realm.Configuration = {
  schema: [
    RealmOfflineCity,
    RealmSyncAction,
    RealmOfflinePreferences,
    RealmDownloadJob,
  ],
  schemaVersion: 1,
  path: 'digital-nomad-offline.realm', // Custom DB name
  deleteRealmIfMigrationNeeded: __DEV__, // Reset DB during development
};

// Export type-safe realm instance opener
export const openRealm = async (): Promise<Realm> => {
  return await Realm.open(realmConfig);
};
```

### 2. Wrap App with RealmProvider

**File**: `app/_layout.tsx`

```typescript
import { RealmProvider } from '@realm/react';
import { realmConfig } from '@/src/infra/repositories/adapters/realm/realmConfig';

export default function RootLayout() {
  return (
    <RealmProvider {...realmConfig} fallback={<LoadingScreen />}>
      <RepositoryProvider>
        <Stack>
          {/* Your app routes */}
        </Stack>
      </RepositoryProvider>
    </RealmProvider>
  );
}
```

---

## Domain Layer Usage

### 1. Define Domain Entities

**File**: `src/domain/offline/OfflineCity.ts`

```typescript
import { City } from '../city/City';

export interface OfflineCity {
  readonly cityId: string;
  readonly cityData: City;
  readonly images: CachedImage[];
  readonly downloadedAt: Date;
  readonly lastAccessedAt: Date;
  readonly storageSize: number;
  readonly isExplicitDownload: boolean;
  readonly version: number;
}

export interface CachedImage {
  id: string;
  url: string;
  localUri: string;
  size: number;
  type: 'hero' | 'gallery' | 'attraction';
}
```

### 2. Define Repository Interface

**File**: `src/domain/offline/IOfflineCityRepo.ts`

```typescript
import { OfflineCity } from './OfflineCity';

export interface IOfflineCityRepo {
  // Read operations
  findById(cityId: string): Promise<OfflineCity | null>;
  findAll(): Promise<OfflineCity[]>;
  getTotalStorageUsed(): Promise<number>;
  
  // Write operations
  save(offlineCity: OfflineCity): Promise<void>;
  updateLastAccessed(cityId: string): Promise<void>;
  delete(cityId: string): Promise<void>;
  deleteAll(): Promise<void>;
  
  // Queries
  findLRUCandidates(count: number): Promise<OfflineCity[]>; // For eviction
  findStale(daysOld: number): Promise<OfflineCity[]>;
}
```

### 3. Create Domain Operations (Use Cases)

**File**: `src/domain/offline/operations/useOfflineCityGet.ts`

```typescript
import { useAppQuery } from '@/src/infra/operations/useAppQuery';
import { useRepositories } from '@/src/infra/repositories/RepositoryProvider';

/**
 * Get a cached city from offline storage
 * @param cityId - City ID to retrieve
 * @returns OfflineCity or null if not cached
 */
export const useOfflineCityGet = (cityId: string) => {
  const { offlineCityRepo } = useRepositories();
  
  return useAppQuery({
    queryKey: ['offline-city', cityId],
    queryFn: async () => {
      const offlineCity = await offlineCityRepo.findById(cityId);
      
      // Update last accessed timestamp (for LRU)
      if (offlineCity) {
        await offlineCityRepo.updateLastAccessed(cityId);
      }
      
      return offlineCity;
    },
  });
};
```

**File**: `src/domain/offline/operations/useOfflineCityCache.ts`

```typescript
import { useAppMutation } from '@/src/infra/operations/useAppMutation';
import { useRepositories } from '@/src/infra/repositories/RepositoryProvider';
import { City } from '@/src/domain/city/City';

/**
 * Auto-cache a city when user views it (P1 - MVP)
 * @returns Mutation to cache city data offline
 */
export const useOfflineCityCache = () => {
  const { offlineCityRepo } = useRepositories();
  
  return useAppMutation({
    mutationFn: async ({ city, images }: { city: City; images: CachedImage[] }) => {
      const offlineCity: OfflineCity = {
        cityId: city.id,
        cityData: city,
        images,
        downloadedAt: new Date(),
        lastAccessedAt: new Date(),
        storageSize: calculateSize(city, images),
        isExplicitDownload: false, // Auto-cached
        version: 1,
      };
      
      await offlineCityRepo.save(offlineCity);
    },
    onSuccess: () => {
      console.log('City cached for offline access');
    },
  });
};

function calculateSize(city: City, images: CachedImage[]): number {
  const cityJsonSize = JSON.stringify(city).length;
  const imagesSize = images.reduce((sum, img) => sum + img.size, 0);
  return cityJsonSize + imagesSize;
}
```

---

## Infrastructure Layer Implementation

### 1. Implement Realm Repository

**File**: `src/infra/repositories/adapters/realm/RealmOfflineCityRepo.ts`

```typescript
import { IOfflineCityRepo } from '@/src/domain/offline/IOfflineCityRepo';
import { OfflineCity } from '@/src/domain/offline/OfflineCity';
import { useRealm } from '@realm/react';
import { RealmOfflineCity } from './models/RealmOfflineCity';

export class RealmOfflineCityRepo implements IOfflineCityRepo {
  constructor(private realm: Realm) {}
  
  async findById(cityId: string): Promise<OfflineCity | null> {
    const realmCity = this.realm
      .objects<RealmOfflineCity>('OfflineCity')
      .filtered('cityId == $0', cityId)[0];
    
    if (!realmCity) return null;
    
    return this.toDomain(realmCity);
  }
  
  async findAll(): Promise<OfflineCity[]> {
    const realmCities = this.realm
      .objects<RealmOfflineCity>('OfflineCity')
      .sorted('lastAccessedAt', true); // Most recent first
    
    return Array.from(realmCities).map(this.toDomain);
  }
  
  async save(offlineCity: OfflineCity): Promise<void> {
    this.realm.write(() => {
      this.realm.create<RealmOfflineCity>(
        'OfflineCity',
        {
          _id: new Realm.BSON.ObjectId(),
          cityId: offlineCity.cityId,
          cityDataJson: JSON.stringify(offlineCity.cityData),
          imagesJson: JSON.stringify(offlineCity.images),
          downloadedAt: offlineCity.downloadedAt,
          lastAccessedAt: offlineCity.lastAccessedAt,
          storageSize: offlineCity.storageSize,
          isExplicitDownload: offlineCity.isExplicitDownload,
          version: offlineCity.version,
        },
        Realm.UpdateMode.Modified // Upsert behavior
      );
    });
  }
  
  async delete(cityId: string): Promise<void> {
    this.realm.write(() => {
      const city = this.realm
        .objects<RealmOfflineCity>('OfflineCity')
        .filtered('cityId == $0', cityId)[0];
      
      if (city) {
        this.realm.delete(city);
      }
    });
  }
  
  async getTotalStorageUsed(): Promise<number> {
    const cities = this.realm.objects<RealmOfflineCity>('OfflineCity');
    return cities.sum('storageSize');
  }
  
  async findLRUCandidates(count: number): Promise<OfflineCity[]> {
    const realmCities = this.realm
      .objects<RealmOfflineCity>('OfflineCity')
      .filtered('isExplicitDownload == false')
      .sorted('lastAccessedAt', false) // Oldest first
      .slice(0, count);
    
    return Array.from(realmCities).map(this.toDomain);
  }
  
  private toDomain(realmCity: RealmOfflineCity): OfflineCity {
    return {
      cityId: realmCity.cityId,
      cityData: JSON.parse(realmCity.cityDataJson),
      images: JSON.parse(realmCity.imagesJson),
      downloadedAt: realmCity.downloadedAt,
      lastAccessedAt: realmCity.lastAccessedAt,
      storageSize: realmCity.storageSize,
      isExplicitDownload: realmCity.isExplicitDownload,
      version: realmCity.version,
    };
  }
}
```

### 2. Register Repository in Provider

**File**: `src/infra/repositories/RepositoryProvider.tsx`

```typescript
import { RealmOfflineCityRepo } from './adapters/realm/RealmOfflineCityRepo';
import { RealmSyncActionRepo } from './adapters/realm/RealmSyncActionRepo';
import { useRealm } from '@realm/react';

export const RepositoryProvider: React.FC<Props> = ({ children }) => {
  const realm = useRealm(); // Get Realm instance from RealmProvider context
  
  const repositories = useMemo(() => ({
    // Existing repos
    cityRepo: USE_SUPABASE ? new SupabaseCityRepo() : new InMemoryCityRepo(),
    
    // New offline repos (always use Realm)
    offlineCityRepo: new RealmOfflineCityRepo(realm),
    syncActionRepo: new RealmSyncActionRepo(realm),
  }), [realm]);
  
  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
};
```

### 3. Network Detection Hook

**File**: `src/infra/services/NetworkService.ts`

```typescript
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      setConnectionType(state.type);
    });
    
    // Get initial state
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected ?? false);
      setConnectionType(state.type);
    });
    
    return () => unsubscribe();
  }, []);
  
  return {
    isOnline,
    isWifi: connectionType === 'wifi',
    isCellular: connectionType === 'cellular',
  };
};
```

---

## UI Layer Integration

### 1. Auto-Cache on City View

**File**: `app/(protected)/city-details/[id].tsx`

```typescript
import { useOfflineCityCache } from '@/src/domain/offline/operations/useOfflineCityCache';
import { useCityFindById } from '@/src/domain/city/operations/useCityFindById';

export default function CityDetailsScreen() {
  const { id: cityId } = useLocalSearchParams();
  const { data: city, isLoading } = useCityFindById(cityId);
  const cacheCity = useOfflineCityCache();
  const { isOnline } = useNetworkStatus();
  
  // Auto-cache city when loaded (P1 - MVP)
  useEffect(() => {
    if (city && isOnline && !cacheCity.isPending) {
      const images = city.images.map(img => ({
        id: img.id,
        url: img.url,
        localUri: img.url, // TODO: Download and cache images
        size: 500000, // TODO: Calculate actual size
        type: 'gallery' as const,
      }));
      
      cacheCity.mutate({ city, images });
    }
  }, [city, isOnline]);
  
  return (
    <Screen>
      <CityDetailsHeader city={city} />
      <CityDetailsInfo city={city} />
    </Screen>
  );
}
```

### 2. Offline Indicator Component

**File**: `src/ui/components/OfflineIndicator.tsx`

```typescript
import { useNetworkStatus } from '@/src/infra/services/NetworkService';
import { Box, Text } from '@/src/ui/components';

export const OfflineIndicator = () => {
  const { isOnline } = useNetworkStatus();
  
  if (isOnline) return null;
  
  return (
    <Box 
      backgroundColor="warning" 
      padding="s" 
      flexDirection="row" 
      justifyContent="center"
    >
      <Icon name="wifi-off" size={16} color="white" />
      <Text variant="caption" color="white" marginLeft="xs">
        Offline - Some features unavailable
      </Text>
    </Box>
  );
};
```

### 3. Download Button Component

**File**: `src/ui/components/DownloadButton.tsx`

```typescript
import { useOfflineCityDownload } from '@/src/domain/offline/operations/useOfflineCityDownload';

interface Props {
  cityId: string;
  isDownloaded: boolean;
}

export const DownloadButton: React.FC<Props> = ({ cityId, isDownloaded }) => {
  const download = useOfflineCityDownload();
  const { isOnline, isWifi } = useNetworkStatus();
  
  if (isDownloaded) {
    return (
      <Badge variant="success">
        <Icon name="check-circle" size={16} />
        <Text>Downloaded</Text>
      </Badge>
    );
  }
  
  return (
    <Button
      variant="outline"
      onPress={() => download.mutate({ cityId })}
      disabled={!isOnline download.isPending}
      loading={download.isPending}
    >
      <Icon name="download" />
      <Text>Download for Offline</Text>
    </Button>
  );
};
```

---

## Testing

### 1. Unit Test Domain Operations

**File**: `src/domain/offline/operations/__tests__/useOfflineCityGet.test.ts`

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { useOfflineCityGet } from '../useOfflineCityGet';
import { mockOfflineCityRepo } from '@/test/mocks';

describe('useOfflineCityGet', () => {
  it('should retrieve cached city by ID', async () => {
    const mockCity = { cityId: 'city-123', cityData: { name: 'Chiang Mai' } };
    mockOfflineCityRepo.findById.mockResolvedValue(mockCity);
    
    const { result } = renderHook(() => useOfflineCityGet('city-123'));
    
    await waitFor(() => expect(result.current.data).toEqual(mockCity));
  });
  
  it('should update last accessed timestamp', async () => {
    const mockCity = { cityId: 'city-123', cityData: { name: 'Chiang Mai' } };
    mockOfflineCityRepo.findById.mockResolvedValue(mockCity);
    
    const { result } = renderHook(() => useOfflineCityGet('city-123'));
    
    await waitFor(() => {
      expect(mockOfflineCityRepo.updateLastAccessed).toHaveBeenCalledWith('city-123');
    });
  });
});
```

### 2. Integration Test Realm Repository

**File**: `src/infra/repositories/adapters/realm/__tests__/RealmOfflineCityRepo.test.ts`

```typescript
import Realm from 'realm';
import { RealmOfflineCityRepo } from '../RealmOfflineCityRepo';
import { realmConfig } from '../realmConfig';

describe('RealmOfflineCityRepo', () => {
  let realm: Realm;
  let repo: RealmOfflineCityRepo;
  
  beforeEach(async () => {
    realm = await Realm.open({ ...realmConfig, inMemory: true });
    repo = new RealmOfflineCityRepo(realm);
  });
  
  afterEach(() => {
    realm.close();
  });
  
  it('should save and retrieve offline city', async () => {
    const offlineCity = {
      cityId: 'city-123',
      cityData: { id: 'city-123', name: 'Chiang Mai' },
      images: [],
      downloadedAt: new Date(),
      lastAccessedAt: new Date(),
      storageSize: 5000,
      isExplicitDownload: false,
      version: 1,
    };
    
    await repo.save(offlineCity);
    const retrieved = await repo.findById('city-123');
    
    expect(retrieved).toMatchObject({
      cityId: 'city-123',
      cityData: { name: 'Chiang Mai' },
    });
  });
});
```

---

## Common Patterns

### Pattern 1: Offline-First Data Loading

```typescript
// Always try offline first, fallback to online
const { data: offlineCity } = useOfflineCityGet(cityId);
const { data: onlineCity } = useCityFindById(cityId, { 
  enabled: !offlineCity && isOnline 
});

const city = offlineCity?.cityData || onlineCity;
```

### Pattern 2: Optimistic Updates with Sync Queue

```typescript
const saveCity = useSaveCityOffline();

// User saves city (works offline)
saveCity.mutate({ cityId: 'city-123' }, {
  onSuccess: () => {
    // City saved locally immediately
    // Sync queued for background processing
  },
});
```

### Pattern 3: Background Sync on Reconnect

```typescript
const { isOnline } = useNetworkStatus();
const syncPending = useOfflineSync();

useEffect(() => {
  if (isOnline) {
    // Trigger sync when connectivity restored
    syncPending.mutate();
  }
}, [isOnline]);
```

---

## Troubleshooting

### Issue: Realm file too large

**Cause**: Too many cached cities or large images  
**Solution**: Implement LRU eviction

```typescript
const { offlineCityRepo } = useRepositories();
const totalStorage = await offlineCityRepo.getTotalStorageUsed();
const MAX_STORAGE = 100 * 1024 * 1024; // 100MB

if (totalStorage > MAX_STORAGE) {
  const candidates = await offlineCityRepo.findLRUCandidates(5);
  for (const city of candidates) {
    await offlineCityRepo.delete(city.cityId);
  }
}
```

### Issue: Sync conflicts

**Cause**: Same entity modified offline and online  
**Solution**: Implement "last write wins"

```typescript
// Server responds with conflict error
if (error.code === 'CONFLICT') {
  // Fetch latest from server
  const latestCity = await fetchCityFromServer(cityId);
  
  // Overwrite local with server version
  await offlineCityRepo.save(latestCity);
  
  // Notify user
  showNotification('City data was updated on server');
}
```

### Issue: Images not caching

**Cause**: Images not downloaded locally  
**Solution**: Use expo-file-system to download

```typescript
import * as FileSystem from 'expo-file-system';

async function cacheImage(url: string): Promise<string> {
  const filename = url.split('/').pop();
  const localUri = `${FileSystem.documentDirectory}${filename}`;
  
  await FileSystem.downloadAsync(url, localUri);
  return localUri;
}
```

---

## Next Steps

1. **Implement P1 (MVP)**: Auto-cache cities, offline indicator
2. **Test offline flow**: Airplane mode testing
3. **Implement P2**: Explicit downloads with progress
4. **Implement P3**: Sync queue and conflict resolution
5. **Implement P4**: Storage management UI

**Reference**:
- [Realm.js Documentation](https://www.mongodb.com/docs/realm/sdk/react-native/)
- [NetInfo Documentation](https://github.com/react-native-netinfo/react-native-netinfo)
- [Offline-First Design Patterns](https://offlinefirst.org/)
