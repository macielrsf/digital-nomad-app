import { AuthProvider } from '@/src/domain/auth/AuthContext';
import { Toast } from '@/src/infra/feedbackService/adapters/Toast/Toast';
import { ToastFeedback } from '@/src/infra/feedbackService/adapters/Toast/ToastFeedback';
import { FeedbackProvider } from '@/src/infra/feedbackService/FeedbackProvider';
import { InMemoryRepositories } from '@/src/infra/repositories/adapters/inMemory';
import { RepositoryProvider } from '@/src/infra/repositories/RepositoryProvider';
import { AsyncStorage } from '@/src/infra/storage/adapters/AsyncStorage';
import { StorageProvider } from '@/src/infra/storage/StorageContext';
import { AppStack } from '@/src/ui/navigation/AppStack';
import theme from '@/src/ui/theme/theme';
import { ThemeProvider } from '@shopify/restyle';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

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
    <StorageProvider storage={AsyncStorage}>
      <AuthProvider>
        <FeedbackProvider value={ToastFeedback}>
          <RepositoryProvider value={InMemoryRepositories}>
            <ThemeProvider theme={theme}>
              <Stack
                screenOptions={{
                  contentStyle: { backgroundColor: theme.colors.background },
                  headerShown: false,
                  fullScreenGestureEnabled: true,
                }}
              >
                <Stack.Screen
                  name='(protected)'
                  options={{ headerShown: false }}
                />
                <Stack.Screen name='+not-found' />
                <Stack.Screen name='sign-in' />
              </Stack>
              <StatusBar style='light' />
              <Toast />
            </ThemeProvider>
          </RepositoryProvider>
        </FeedbackProvider>
      </AuthProvider>
    </StorageProvider>
  );
}
