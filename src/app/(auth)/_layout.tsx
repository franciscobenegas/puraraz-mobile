import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@utils/theme';

export default function AuthLayout() {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (token) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
