import { ImageBackground, ScrollView } from 'react-native';
import { Box } from '../components/ui/Box';
import { City } from '../types';
import { IconButton } from '../components/ui/IconButton';
import { router } from 'expo-router';
import { Icon } from '../components/ui/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryBadge } from '../components/category/CategoryBadge';
import { BadgeHeight } from '../components/ui/Badge';

type CityDetailsHeaderProps = Pick<City, 'id' | 'coverImage' | 'categories'>;

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
        <Box
          flexDirection='row'
          justifyContent='space-between'
          padding='padding'
          style={{ paddingTop: insets.top }}
        >
          <IconButton iconName='Chevron-left' onPress={router.back} />
          <Icon name='Favorite-outline' size={30} color='pureWhite' />
        </Box>
      </ImageBackground>
      <ScrollView
        horizontal
        bounces={false}
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
