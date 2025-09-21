import { Box } from '@/src/components/Box';
import { FlatList } from 'react-native';

import { cities } from '@/src/data/cities';
import { CityPreview } from '../../../src/types';
import { CityCard } from '@/src/components/CityCard';

export default function HomeScreen() {
  const renderItem = ({ item }: { item: CityPreview }) => (
    <CityCard city={item} />
  );

  return (
    <Box flex={1} backgroundColor='mainBackground'>
      <FlatList data={cities} renderItem={renderItem} />
    </Box>
  );
}
