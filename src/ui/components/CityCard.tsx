import { Link } from 'expo-router';
import { ImageBackground, ImageBackgroundProps, Pressable } from 'react-native';

import { CityPreview } from '@/src/domain/city/City';
import { useAppTheme } from '../theme/useAppTheme';
import { BlackOpacity } from './BlackOpacity';
import { Box } from './Box';
import { CityFavoriteButton } from './CityFavoriteButton';
import { Text } from './Text';

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
          }}
        >
          <BlackOpacity />
          <Box justifyContent='space-between' flex={1} padding='s24'>
            <Box alignSelf='flex-end'>
              <CityFavoriteButton city={city} />
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
