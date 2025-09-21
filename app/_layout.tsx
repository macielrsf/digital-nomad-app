import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ThemeProvider } from '@shopify/restyle';
import theme from '@/src/theme/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <StatusBar style='auto' />
        <Stack.Screen name='(protected)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' options={{ headerShown: false }} />
        <Stack.Screen name='sign-in' options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
