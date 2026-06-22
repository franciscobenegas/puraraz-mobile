import React, { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { useNetworkStore } from '@stores/networkStore';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

export default function AppLayout() {
  const { token, isLoading } = useAuthStore();
  const { isOnline, isSyncing, pendingCount, setOnline, sync, refreshPendingCount } = useNetworkStore();
  const { top: topInset } = useSafeAreaInsets();

  useEffect(() => {
    refreshPendingCount();
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected;
      setOnline(online);
      if (online) sync();
    });
    return () => unsubscribe();
  }, []);

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
    <View style={{ flex: 1 }}>
      {(!isOnline || isSyncing) && (
        <View style={[isSyncing ? styles.syncBanner : styles.offlineBanner, { paddingTop: topInset + 6 }]}>
          <Text style={styles.bannerText}>
            {isSyncing
              ? `Sincronizando ${pendingCount} registro(s)...`
              : pendingCount > 0
                ? `Sin conexión — ${pendingCount} registro(s) pendiente(s)`
                : 'Sin conexión — los registros se guardarán localmente'}
          </Text>
        </View>
      )}
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#2D6A4F' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '600' },
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
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: '#B7472A',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  syncBanner: {
    backgroundColor: '#40916C',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
