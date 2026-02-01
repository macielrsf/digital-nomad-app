import { Box } from '../components/ui/Box';
import { Text } from '../components/ui/Text';
import { City } from '../domain/city/City';
import { Accordion } from '../components/ui/Accordion';

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
