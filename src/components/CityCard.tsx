import { ImageBackground } from 'react-native';
import { CityPreview } from '../types';
import { Box } from './Box';
import { Text } from './Text';

export const CityCard = ({ city }: { city: CityPreview }) => {
  return (
    <ImageBackground
      source={city.coverImage}
      style={{
        minHeight: 200,
        marginVertical: 10,
        padding: 20,
        borderRadius: 20,
        flex: 1,
      }}
    >
      <Box justifyContent='flex-end' alignItems='flex-end' flex={1}>
        <Text variant='title22'>{city.name}</Text>
        <Text variant='text16'>{city.country}</Text>
      </Box>
    </ImageBackground>
  );
};
