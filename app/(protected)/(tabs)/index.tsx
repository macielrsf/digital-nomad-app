import { useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadingTransition } from 'react-native-reanimated';

import { useCategoryFindAll } from '@/src/domain/category/operations/useCategoryFindAll';
import { CityPreview } from '@/src/domain/city/City';
import { Box } from '@/src/ui/components/Box';
import { CityCard } from '@/src/ui/components/CityCard';
import { Screen } from '@/src/ui/components/Screen';
import { CityFilter } from '@/src/ui/containers/CityFilter';

import { useCityFindAll } from '@/src/domain/city/operations/useCityFindAll';
import { useAppTheme } from '@/src/ui/theme/useAppTheme';
import { useDebounce } from '@/src/utils/hooks/useDebounce';

import { Text } from '@/src/ui/components/Text';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const debouncedCityName = useDebounce(name, 500);

  const {
    data: cities,
    isLoading,
    error,
  } = useCityFindAll({
    name: debouncedCityName,
    categoryId: selectedCategoryId,
  });

  const { data: categories } = useCategoryFindAll();

  const insets = useSafeAreaInsets();
  const flatListRef = useRef<Animated.FlatList>(null);
  useScrollToTop(flatListRef);
  const { spacing } = useAppTheme();

  const renderItem = ({ item }: { item: CityPreview }) => (
    <Box paddingHorizontal='padding'>
      <CityCard city={item} />
    </Box>
  );

  function renderEmptyComponent() {
    let Content;

    if (isLoading) {
      Content = <Text>carregando cidades...</Text>;
    } else if (error) {
      Content = <Text>erro ao carregar cidades. {error.message}</Text>;
    } else {
      Content = <Text>não há cidades no momento</Text>;
    }

    return (
      <Box alignSelf='center' mt='s32'>
        {Content}
      </Box>
    );
  }

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <Animated.FlatList
        itemLayoutAnimation={FadingTransition.duration(500)}
        ref={flatListRef}
        data={cities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: spacing.padding,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        ListEmptyComponent={renderEmptyComponent()}
        ListHeaderComponent={
          <CityFilter
            categories={categories}
            search={name}
            onChangeSearch={setName}
            selectedCategoryId={selectedCategoryId}
            onChangeSelectedCategoryId={setSelectedCategoryId}
          />
        }
      />
    </Screen>
  );
}
