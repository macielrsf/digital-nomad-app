import { Redirect, Stack } from 'expo-router';

export default function ProtectedLayout() {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Redirect href='/sign-in' />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
    >
      <Stack.Screen name='(tabs)' />
    </Stack>
  );
}
