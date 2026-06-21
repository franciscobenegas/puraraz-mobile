import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { usePesajeStore } from '@stores/pesajeStore';
import { Colors, Spacing, Typography, BorderRadius } from '@utils/theme';
import { Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PesajeListScreen() {
  const router = useRouter();
  const { pesajes, isLoading, cargar } = usePesajeStore();

  useEffect(() => { cargar(); }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={pesajes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay pesajes registrados</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Animal Nº {item.numeroAnimal}</Text>
                <Text style={styles.date}>{format(new Date(item.fecha), 'dd/MM/yyyy', { locale: es })}</Text>
              </View>
              <Text style={styles.weight}>{item.peso} kg</Text>
              {item.observacion && <Text style={styles.cardText}>Obs: {item.observacion}</Text>}
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(app)/pesaje/crear')}>
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
  weight: { fontSize: 22, fontWeight: '700', color: Colors.light.primary, marginBottom: Spacing.xs },
  cardText: { ...Typography.bodySmall, color: Colors.light.placeholder, marginBottom: 2 },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.lg, backgroundColor: Colors.light.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
});
