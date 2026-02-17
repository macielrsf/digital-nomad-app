import { SupabaseRepositories } from '@/src/infra/repositories/adapters/supabase';
//import { InMemoryRepositories } from '@/src/infra/repositories/adapters/inMemory';
import { RepositoryProvider } from '@/src/infra/repositories/RepositoryProvider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ThemeProvider } from '@shopify/restyle';
import theme from '@/src/theme/theme';
import { useFonts } from 'expo-font';

if (__DEV__) {
  import('../ReactotronConfig');
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IcoMoon: require('@/assets/icons/icomoon.ttf'),
    PoppinsBlack: require('@/assets/fonts/Poppins-Black.ttf'),
    PoppinsBold: require('@/assets/fonts/Poppins-Bold.ttf'),
    PoppinsExtraBold: require('@/assets/fonts/Poppins-ExtraBold.ttf'),
    PoppinsExtraLight: require('@/assets/fonts/Poppins-ExtraLight.ttf'),
    PoppinsLight: require('@/assets/fonts/Poppins-Light.ttf'),
    PoppinsMedium: require('@/assets/fonts/Poppins-Medium.ttf'),
    PoppinsRegular: require('@/assets/fonts/Poppins-Regular.ttf'),
    PoppinsSemiBold: require('@/assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsThin: require('@/assets/fonts/Poppins-Thin.ttf'),
    PoppinsBlackItalic: require('@/assets/fonts/Poppins-BlackItalic.ttf'),
    PoppinsBoldItalic: require('@/assets/fonts/Poppins-BoldItalic.ttf'),
    PoppinsExtraBoldItalic: require('@/assets/fonts/Poppins-ExtraBoldItalic.ttf'),
    PoppinsExtraLightItalic: require('@/assets/fonts/Poppins-ExtraLightItalic.ttf'),
    PoppinsLightItalic: require('@/assets/fonts/Poppins-LightItalic.ttf'),
    PoppinsMediumItalic: require('@/assets/fonts/Poppins-MediumItalic.ttf'),
    PoppinsSemiBoldItalic: require('@/assets/fonts/Poppins-SemiBoldItalic.ttf'),
    PoppinsThinItalic: require('@/assets/fonts/Poppins-ThinItalic.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <RepositoryProvider value={SupabaseRepositories}>
      <ThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen name='(protected)' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' options={{ headerShown: false }} />
          <Stack.Screen name='sign-in' options={{ headerShown: false }} />
        </Stack>
        <StatusBar style='light' />
      </ThemeProvider>
    </RepositoryProvider>
  );
}
