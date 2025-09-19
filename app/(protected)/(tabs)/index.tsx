import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <Link href='/city-details/1'>City Details with link</Link>
      <Link
        href={{ pathname: '/city-details/[id]', params: { id: '2' } }}
        asChild
      >
        <ThemedText type='subtitle'>
          Navigates to city details screen with link
        </ThemedText>
      </Link>
      <ThemedText
        type='subtitle'
        onPress={() =>
          router.navigate({
            pathname: '/city-details/[id]',
            params: { id: '3' },
          })
        }
      >
        Navigates with router
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
