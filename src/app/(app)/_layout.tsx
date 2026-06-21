import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2D6A4F" />
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
          backgroundColor: '#2D6A4F',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="mortandad/index" options={{ title: 'Mortandades' }} />
      <Stack.Screen name="mortandad/crear" options={{ title: 'Nueva Mortandad' }} />
      <Stack.Screen name="nacimiento/index" options={{ title: 'Nacimientos' }} />
      <Stack.Screen name="nacimiento/crear" options={{ title: 'Nuevo Nacimiento' }} />
      <Stack.Screen name="entrada/index" options={{ title: 'Entradas' }} />
      <Stack.Screen name="entrada/crear" options={{ title: 'Nueva Entrada' }} />
      <Stack.Screen name="salida/index" options={{ title: 'Salidas' }} />
      <Stack.Screen name="salida/crear" options={{ title: 'Nueva Salida' }} />
      <Stack.Screen name="pesaje/index" options={{ title: 'Pesajes' }} />
      <Stack.Screen name="pesaje/crear" options={{ title: 'Nuevo Pesaje' }} />
    </Stack>
  );
}
