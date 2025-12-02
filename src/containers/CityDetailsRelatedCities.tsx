import { Box } from '../components/ui/Box';
import { Text } from '../components/ui/Text';
import { City } from '../types';
import { useRelatedCities } from '../data/useRelatedCities';
import { ScrollView, useWindowDimensions } from 'react-native';
import { CityCard } from '../components/cards/CityCard';
import { useAppTheme } from '../theme/useAppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = Pick<City, 'relatedCitiesIds'>;

export function CityDetailsRelatedCities({ relatedCitiesIds }: Props) {
  const cities = useRelatedCities(relatedCitiesIds);
  const { spacing } = useAppTheme();
  const { bottom } = useSafeAreaInsets();

  const { width } = useWindowDimensions();

  const cardWidth = width * 0.5;
  const cardHeight = cardWidth * 0.9;

  return (
    <Box padding='padding' style={{ paddingBottom: bottom }}>
      <Text variant='title22' mb='s16' paddingHorizontal='padding'>
        Veja Também
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: spacing.padding,
          paddingHorizontal: spacing.padding,
        }}
      >
        {cities.map(city => (
          <CityCard
            key={city.id}
            city={city}
            style={{ height: cardHeight, width: cardWidth }}
          />
        ))}
      </ScrollView>
    </Box>
  );
}
