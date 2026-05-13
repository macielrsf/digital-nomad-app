import { useAuthGetUser } from '@/src/domain/auth/operations/useAuthGetUser';
import { useAuthSignOut } from '@/src/domain/auth/operations/useAuthSignOut';
import { useFindAllFavorites } from '@/src/domain/city/operations/useFindAllFavorites';
import { Box } from '@/src/ui/components/Box';
import { CityCard } from '@/src/ui/components/CityCard';
import { Icon } from '@/src/ui/components/Icon';
import { Screen } from '@/src/ui/components/Screen';
import { Text } from '@/src/ui/components/Text';
import { ProfileHeader } from '@/src/ui/containers/Profile/ProfileHeader';
import { Pressable } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { mutate: signOut } = useAuthSignOut();
  const { data: authUser } = useAuthGetUser();
  const { data: favoriteList } = useFindAllFavorites();

  return (
    <Screen>
      <SafeAreaView>
        {authUser && <ProfileHeader authUser={authUser} />}

        {favoriteList?.length > 0 ? (
          favoriteList.map(city => <CityCard key={city.id} city={city} />)
        ) : (
          <Text>Nenhuma cidade favorita encontrada.</Text>
        )}

        <Pressable onPress={signOut}>
          <Box
            mt='s24'
            flexDirection='row'
            alignItems='center'
            alignSelf='center'
          >
            <Icon name='Logout' color='fbErrorSurface' />
            <Text color='fbErrorSurface'>Sair</Text>
          </Box>
        </Pressable>
      </SafeAreaView>
    </Screen>
  );
}
