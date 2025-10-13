import { FlatList } from 'react-native';
import { useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CityPreview } from '../../../src/types';
import { CityCard } from '@/src/components/cards/CityCard';
import { Screen } from '@/src/components/layout/Screen';
import { useAppTheme } from '@/src/theme/useAppTheme';
import { CityFilter } from '@/src/containers/CityFilter';
import { categories } from '@/src/data/categories';
import { Box } from '@/src/components/ui/Box';
import { useCities } from '@/src/data/useCities';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { cityPreviewList } = useCities({
    search,
    categoryId: selectedCategoryId,
  });

  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  useScrollToTop(flatListRef);
  const { spacing } = useAppTheme();

  const renderItem = ({ item }: { item: CityPreview }) => (
    <Box paddingHorizontal='padding'>
      <CityCard city={item} />
    </Box>
  );

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <FlatList
        ref={flatListRef}
        data={cityPreviewList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: spacing.padding,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        ListHeaderComponent={
          <CityFilter
            categories={categories}
            search={search}
            onChangeSearch={setSearch}
            selectedCategoryId={selectedCategoryId}
            onChangeSelectedCategoryId={setSelectedCategoryId}
          />
        }
      />
    </Screen>
  );
}
