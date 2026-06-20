import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@utils/theme';

export default function AppLayout() {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.light.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
      <Stack.Screen
        name="mortandad/index"
        options={{ title: 'Mortandades' }}
      />
      <Stack.Screen
        name="mortandad/crear"
        options={{ title: 'Nueva Mortandad' }}
      />
    </Stack>
  );
}
