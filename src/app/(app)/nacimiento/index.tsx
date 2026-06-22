import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNacimientoStore } from '@stores/nacimientoStore';
import { useMortandadStore } from '@stores/mortandadStore';
import { useNetworkStore } from '@stores/networkStore';

import { Spacing, Typography, BorderRadius } from '@utils/theme';
import { Plus, Trash2, RefreshCw } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BRAND_GREEN = '#2D6A4F';
const BRAND_RED = '#B7472A';

export default function NacimientoListScreen() {
  const router = useRouter();
  const { nacimientos, isLoading, error, cargar, eliminar } = useNacimientoStore();
  const { propietarios, potreros, cargarTodo } = useMortandadStore();
  const { pendingOperations } = useNetworkStore();
  const pending = pendingOperations.filter((op) => op.module === 'nacimiento');

  useEffect(() => {
    cargar();
    cargarTodo();
  }, []);

  const getPropietario = (id: string) => propietarios.find((p) => p.id === id)?.nombre ?? id;
  const getPotrero = (id: string) => potreros.find((p) => p.id === id)?.nombre ?? id;

  const formatFecha = (fecha: string) => {
    try { return format(new Date(fecha), 'dd/MM/yyyy', { locale: es }); } catch { return fecha; }
  };

  const handleDelete = (id: string, label: string) => {
    Alert.alert(
      'Eliminar Nacimiento',
      `¿Estás seguro de que deseas eliminar el registro "${label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminar(id);
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el nacimiento');
            }
          },
        },
      ]
    );
  };

  if (isLoading && nacimientos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BRAND_GREEN} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={cargar}>
          <RefreshCw size={16} color="#fff" />
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={nacimientos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={cargar} colors={[BRAND_GREEN]} tintColor={BRAND_GREEN} />
        }
        ListEmptyComponent={
          pending.length === 0
            ? <Text style={styles.empty}>No hay nacimientos registrados</Text>
            : null
        }
        ListHeaderComponent={
          pending.length > 0 ? (
            <>
              {pending.map((op) => (
                <View key={op.id} style={[styles.card, styles.cardPending]}>
                  <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>
                        {op.body.sexo} — {op.body.pelaje}
                      </Text>
                      <Text style={styles.badge}>{op.body.sexo === 'Macho' ? '♂' : '♀'}</Text>
                    </View>
                    <Text style={styles.cardText}>Fecha: {formatFecha(op.body.fecha)}</Text>
                    {op.body.numeroTernero ? (
                      <Text style={styles.cardText}>Ternero Nº: {op.body.numeroTernero}</Text>
                    ) : null}
                    {op.body.numeroVaca ? (
                      <Text style={styles.cardText}>Vaca Nº: {op.body.numeroVaca}</Text>
                    ) : null}
                    {op.body.peso ? (
                      <Text style={styles.cardText}>Peso: {op.body.peso} kg</Text>
                    ) : null}
                    <Text style={styles.pendingLabel}>Pendiente de sincronización</Text>
                  </View>
                </View>
              ))}
            </>
          ) : null
        }
        renderItem={({ item }) => {
          const label = [item.sexo, item.pelaje, item.numeroTernero].filter(Boolean).join(' — ');
          return (
            <View style={styles.card}>
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {item.sexo} — {item.pelaje}
                  </Text>
                  <Text style={styles.badge}>{item.sexo === 'Macho' ? '♂' : '♀'}</Text>
                </View>
                <Text style={styles.cardText}>
                  Fecha: {formatFecha(item.fecha)}
                </Text>
                {item.numeroTernero && (
                  <Text style={styles.cardText}>Ternero Nº: {item.numeroTernero}</Text>
                )}
                {item.numeroVaca && (
                  <Text style={styles.cardText}>Vaca Nº: {item.numeroVaca}</Text>
                )}
                {item.peso && (
                  <Text style={styles.cardText}>Peso: {item.peso} kg</Text>
                )}
                <Text style={styles.cardText}>
                  Propietario: {getPropietario(item.propietarioId)}
                </Text>
                <Text style={styles.cardText}>
                  Potrero: {getPotrero(item.potreroId)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, label)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Trash2 size={18} color={BRAND_RED} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(app)/nacimiento/crear')}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF9' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  list: { padding: Spacing.md, paddingBottom: 80 },
  empty: { ...Typography.body, color: '#888', textAlign: 'center', marginTop: Spacing.xl },
  errorText: { ...Typography.body, color: BRAND_RED, textAlign: 'center', marginBottom: Spacing.sm },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  retryBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E8F0ED',
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPending: {
    backgroundColor: '#FFFBF0',
    borderColor: '#E8D080',
  },
  cardBody: { flex: 1 },
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
  cardTitle: { ...Typography.body, fontWeight: '600', color: '#1A1A1A' },
  badge: { fontSize: 18 },
  cardText: { ...Typography.bodySmall, color: '#666', marginBottom: 2 },
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
  deleteBtn: { marginLeft: Spacing.sm, padding: 4 },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    backgroundColor: BRAND_GREEN,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
