import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEntradaStore } from '@stores/entradaStore';
import { useNetworkStore } from '@stores/networkStore';

import { Colors, Spacing, Typography, BorderRadius } from '@utils/theme';
import { Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EntradaListScreen() {
  const router = useRouter();
  const { entradas, isLoading, cargar } = useEntradaStore();
  const { pendingOperations } = useNetworkStore();
  const pending = pendingOperations.filter((op) => op.module === 'entrada');

  useEffect(() => { cargar(); }, []);

  const formatFecha = (fecha: string) => {
    try { return format(new Date(fecha), 'dd/MM/yyyy', { locale: es }); } catch { return fecha; }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={entradas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            pending.length === 0
              ? <Text style={styles.empty}>No hay entradas registradas</Text>
              : null
          }
          ListHeaderComponent={
            pending.length > 0 ? (
              <>
                {pending.map((op) => (
                  <View key={op.id} style={[styles.card, styles.cardPending]}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>Entrada</Text>
                      <Text style={styles.date}>{formatFecha(op.body.fecha)}</Text>
                    </View>
                    {op.body.NombreEstanciaOrigen ? (
                      <Text style={styles.cardText}>Origen: {op.body.NombreEstanciaOrigen}</Text>
                    ) : null}
                    <Text style={styles.cardText}>
                      Items: {Array.isArray(op.body.items) ? op.body.items.length : 0} categoría(s)
                    </Text>
                    <Text style={styles.pendingLabel}>Pendiente de sincronización</Text>
                  </View>
                ))}
              </>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Entrada</Text>
                <Text style={styles.date}>{formatFecha(item.fecha)}</Text>
              </View>
              {item.NombreEstanciaOrigen && (
                <Text style={styles.cardText}>Origen: {item.NombreEstanciaOrigen}</Text>
              )}
              <Text style={styles.cardText}>Items: {item.items?.length ?? 0} categoría(s)</Text>
              <Text style={styles.cardText}>
                Total animales: {item.items?.reduce((s, i) => s + i.cantidad, 0) ?? 0}
              </Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(app)/entrada/crear')}>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardPending: {
    backgroundColor: '#FFFBF0',
    borderColor: '#E8D080',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: { ...Typography.body, fontWeight: '600', color: Colors.light.text },
  date: { ...Typography.bodySmall, color: Colors.light.placeholder },
  cardText: { ...Typography.bodySmall, color: Colors.light.placeholder, marginBottom: 2 },
  pendingLabel: {
    fontSize: 11,
    color: '#B8860B',
    fontStyle: 'italic',
    marginTop: 4,
  },
  syncRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    backgroundColor: Colors.light.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
