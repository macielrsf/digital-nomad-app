import { ImageBackground } from 'react-native';

import { CityPreview } from '../types';
import { Box } from './Box';
import { Text } from './Text';
import { useAppTheme } from '@/src/theme/useAppTheme';
import { Icon } from './Icon';

export const CityCard = ({ city }: { city: CityPreview }) => {
  const { borderRadii } = useAppTheme();
  return (
    <ImageBackground
      source={city.coverImage}
      style={{
        width: '100%',
        height: 280,
      }}
      imageStyle={{
        borderRadius: borderRadii.default,
        opacity: 0.75,
      }}
    >
      <Box justifyContent='space-between' flex={1} padding='s24'>
        <Box alignSelf='flex-end'>
          <Icon name='Favorite-outline' color='text' />
        </Box>
        <Box>
          <Text variant='title22'>{city.name}</Text>
          <Text variant='text16'>{city.country}</Text>
        </Box>
      </Box>
    </ImageBackground>
  );
};
