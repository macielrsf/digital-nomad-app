import { router } from 'expo-router';
import { ImageBackground, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { City } from '@/src/domain/city/City';
import { BadgeHeight } from '../components/Badge';
import { BlackOpacity } from '../components/BlackOpacity';
import { Box } from '../components/Box';
import { CategoryBadge } from '../components/CategoryBadge';
import { CityFavoriteButton } from '../components/CityFavoriteButton';
import { IconButton } from '../components/IconButton';

type CityDetailsHeaderProps = Pick<
  City,
  'id' | 'coverImage' | 'categories' | 'isFavorite'
>;

export function CityDetailsHeader({ city }: { city: CityDetailsHeaderProps }) {
  const insets = useSafeAreaInsets();

  return (
    <Box>
      <ImageBackground
        style={{ width: '100%', height: 250 }}
        imageStyle={{ borderBottomRightRadius: 40 }}
        source={
          typeof city.coverImage === 'number'
            ? city.coverImage
            : { uri: city.coverImage }
        }
      >
        <BlackOpacity />
        <Box
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
          padding='padding'
          style={{ paddingTop: insets.top }}
        >
          <IconButton iconName='Chevron-left' onPress={router.back} />
          <CityFavoriteButton
            size={30}
            city={{ id: city.id, isFavorite: city.isFavorite }}
          />
        </Box>
      </ImageBackground>
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: -BadgeHeight / 2 }}
      >
        <Box flexDirection='row' gap='s8' paddingHorizontal='padding'>
          {city.categories.map(category => (
            <CategoryBadge key={category.id} category={category} active />
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
