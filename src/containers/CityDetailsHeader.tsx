import { ImageBackground } from 'react-native';
import { Box } from '../components/ui/Box';
import { City } from '../types';
import { IconButton } from '../components/ui/IconButton';
import { router } from 'expo-router';
import { Icon } from '../components/ui/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CityDetailsHeaderProps = Pick<City, 'id' | 'coverImage' | 'categories'>;

export function CityDetailsHeader({ city }: { city: CityDetailsHeaderProps }) {
  const insets = useSafeAreaInsets();

  return (
    <Box>
      <ImageBackground
        style={{ width: '100%', height: 250 }}
        imageStyle={{ borderBottomRightRadius: 40 }}
        source={city.coverImage}
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
    </Box>
  );
}
