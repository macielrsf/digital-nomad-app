import { FlatList } from 'react-native';
import { useRef } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cities } from '@/src/data/cities';
import { CityPreview } from '../../../src/types';
import { CityCard } from '@/src/components/CityCard';
import { Screen } from '@/src/components/Screen';
import { useAppTheme } from '@/src/theme/useAppTheme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  useScrollToTop(flatListRef);

  const { spacing } = useAppTheme();
  const renderItem = ({ item }: { item: CityPreview }) => (
    <CityCard city={item} />
  );

  return (
    <Screen>
      <FlatList
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
      />
    </Screen>
  );
}
