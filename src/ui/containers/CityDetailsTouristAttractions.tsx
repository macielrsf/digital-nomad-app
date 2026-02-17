import { City } from '@/src/domain/city/City';
import { Accordion } from '../components/Accordion';
import { Box } from '../components/Box';
import { Text } from '../components/Text';

type Props = Pick<City, 'touristAttractions'>;

export function CityDetailsTouristAttractions({ touristAttractions }: Props) {
  return (
    <Box padding='padding'>
      <Text variant='title22' mb='s16'>
        Pontos Turísticos
      </Text>
      <Box gap='s12'>
        {touristAttractions.map((attraction, index) => (
          <Accordion
            key={index}
            title={attraction.name}
            description={attraction.description}
          />
        ))}
      </Box>
    </Box>
  );
}
