import { ImageBackground } from 'react-native';
import { CityPreview } from '../types';
import { Box } from './Box';
import { Text } from './Text';

export const CityCard = ({ city }: { city: CityPreview }) => {
  return (
    <ImageBackground
      source={city.coverImage}
      style={{ minHeight: 200, marginVertical: 10, borderRadius: 20, flex: 1 }}
    >
      <Box>
        <Text>{city.name}</Text>
        <Text>{city.country}</Text>
      </Box>
    </ImageBackground>
  );
};
