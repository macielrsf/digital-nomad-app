import { ImageBackground, Pressable, ImageBackgroundProps } from 'react-native';
import { Link } from 'expo-router';

import { CityPreview } from '../../types';
import { Box } from '../ui/Box';
import { Text } from '../ui/Text';
import { useAppTheme } from '@/src/theme/useAppTheme';
import { Icon } from '../ui/Icon';

type CityCardProps = {
  city: CityPreview;
  style?: ImageBackgroundProps['style'];
};

export const CityCard = ({ city, style }: CityCardProps) => {
  const { borderRadii } = useAppTheme();
  return (
    <Link push href={`/city-details/${city.id}`} asChild>
      <Pressable>
        <ImageBackground
          source={
            typeof city.coverImage === 'number'
              ? city.coverImage
              : { uri: city.coverImage }
          }
          style={[
            {
              width: '100%',
              height: 280,
            },
            style,
          ]}
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
      </Pressable>
    </Link>
  );
};
