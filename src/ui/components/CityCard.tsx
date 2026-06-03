import { ImageBackground, Pressable, ImageBackgroundProps } from 'react-native';
import { Link } from 'expo-router';

import { CityPreview } from '@/src/domain/city/City';
import { useCityToggleFavorite } from '@/src/domain/city/operations/useCityToggleFavorite';
import { Box, TouchableOpacityBox } from './Box';
import { Text } from './Text';
import { useAppTheme } from '../theme/useAppTheme';
import { Icon } from './Icon';

type CityCardProps = {
  city: CityPreview;
  style?: ImageBackgroundProps['style'];
};

export const CityCard = ({ city, style }: CityCardProps) => {
  const { borderRadii } = useAppTheme();
  const { mutate: toggleFavorite } = useCityToggleFavorite();
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
            <TouchableOpacityBox
              alignSelf='flex-end'
              onPress={() => {
                toggleFavorite({
                  cityId: city.id,
                  isFavorite: city.isFavorite,
                });
              }}
            >
              <Icon
                name={city.isFavorite ? 'Favorite-fill' : 'Favorite-outline'}
                color={city.isFavorite ? 'primary' : 'text'}
              />
            </TouchableOpacityBox>

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
