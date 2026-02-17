import { City } from '@/src/domain/city/City';
import { Box } from '../components/Box';
import { Text } from '../components/Text';

type Props = Pick<City, 'name' | 'description' | 'country'>;

export function CityDetailsInfo({ name, description, country }: Props) {
  return (
    <Box padding='padding' pt='s24'>
      <Text variant='title22'>{name}</Text>
      <Text variant='text16' pt='s4'>
        {country}
      </Text>
      <Text variant='text14' pt='s8'>
        {description}
      </Text>
    </Box>
  );
}
