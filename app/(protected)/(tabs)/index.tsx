import { FlatList } from 'react-native';

import { cities } from '@/src/data/cities';
import { CityPreview } from '../../../src/types';
import { CityCard } from '@/src/components/CityCard';
import { Screen } from '@/src/components/Screen';

export default function HomeScreen() {
  const renderItem = ({ item }: { item: CityPreview }) => (
    <CityCard city={item} />
  );

  return (
    <Screen>
      <FlatList data={cities} renderItem={renderItem} />
    </Screen>
  );
}
