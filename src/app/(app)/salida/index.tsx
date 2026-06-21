import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSalidaStore } from '@stores/salidaStore';
import { Colors, Spacing, Typography, BorderRadius } from '@utils/theme';
import { Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SalidaListScreen() {
  const router = useRouter();
  const { salidas, isLoading, cargar } = useSalidaStore();

  useEffect(() => { cargar(); }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={salidas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay salidas registradas</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Salida</Text>
                <Text style={styles.date}>{format(new Date(item.fecha), 'dd/MM/yyyy', { locale: es })}</Text>
              </View>
              {item.NombreEstanciaSalida && <Text style={styles.cardText}>Destino: {item.NombreEstanciaSalida}</Text>}
              <Text style={styles.cardText}>Items: {item.items?.length ?? 0} categoría(s)</Text>
              <Text style={styles.cardText}>Total animales: {item.items?.reduce((s, i) => s + i.cantidad, 0) ?? 0}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(app)/salida/crear')}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  loader: { flex: 1 },
  list: { padding: Spacing.md },
  empty: { ...Typography.body, color: Colors.light.placeholder, textAlign: 'center', marginTop: Spacing.xl },
  card: { backgroundColor: '#fff', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.light.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  cardTitle: { ...Typography.body, fontWeight: '600', color: Colors.light.text },
  date: { ...Typography.bodySmall, color: Colors.light.placeholder },
  cardText: { ...Typography.bodySmall, color: Colors.light.placeholder, marginBottom: 2 },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.lg, backgroundColor: Colors.light.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
});
