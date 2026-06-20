import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@stores/authStore';

export default function RootLayout() {
  const { restoreToken } = useAuthStore();

  useEffect(() => {
    restoreToken();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
