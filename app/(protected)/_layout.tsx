import { useAuth } from '@/src/domain/auth/AuthContext';
import { useAuthGetUser } from '@/src/domain/auth/operations/useAuthGetUser';
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  const { isReady, authUser, removeAuthUser } = useAuth();
  const {
    data: supabaseUser,
    error,
    isLoading,
  } = useAuthGetUser({
    enabled: isReady && !!authUser,
  });

  useEffect(() => {
    if (error && authUser) {
      removeAuthUser();
    }
  }, [authUser, error, removeAuthUser]);

  if (!isReady) {
    return null;
  }

  if (!authUser) {
    return <Redirect href='/sign-in' />;
  }

  if (isLoading || !supabaseUser) {
    return null;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
    >
      <Stack.Screen name='(tabs)' />
    </Stack>
  );
}
