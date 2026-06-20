import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMortandadStore } from '@stores/mortandadStore';
import { Button } from '@components/Button';
import { Colors, Spacing, Typography, BorderRadius } from '@utils/theme';

export default function MortandadesListScreen() {
  const router = useRouter();
  const { mortandades, cargarMortandades, isLoading, eliminarMortandad } =
    useMortandadStore();

  useEffect(() => {
    cargarMortandades();
  }, []);

  const handleDelete = (id: string, numeroAnimal: string) => {
    Alert.alert(
      'Eliminar Mortandad',
      `¿Estás seguro de que deseas eliminar el registro del animal ${numeroAnimal}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarMortandad(id);
              Alert.alert('Éxito', 'Mortandad eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la mortandad');
            }
          },
        },
      ]
    );
  };

  const renderMortandadCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Animal: {item.numeroAnimal}</Text>
        <Text style={styles.cardText}>
          Fecha: {new Date(item.fecha).toLocaleDateString()}
        </Text>
        <Text style={styles.cardText}>Potrero: {item.potreroId}</Text>
        <Text style={styles.cardText}>
          GPS: {item.ubicacionGps}
        </Text>
        {item.foto1 && (
          <Text style={[styles.cardText, styles.hasPhotos]}>
            📷 Tiene fotos
          </Text>
        )}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.numeroAnimal)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="+ Nueva Mortandad"
          onPress={() => router.push('/(app)/mortandad/crear')}
          variant="primary"
        />
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Cargando mortandades...</Text>
        </View>
      ) : mortandades.length > 0 ? (
        <FlatList
          data={mortandades}
          keyExtractor={(item) => item.id}
          renderItem={renderMortandadCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No hay mortandades registradas</Text>
          <Button
            title="Crear Primera Mortandad"
            onPress={() => router.push('/(app)/mortandad/crear')}
            variant="primary"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  card: {
    backgroundColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  cardText: {
    ...Typography.bodySmall,
    color: Colors.light.placeholder,
    marginBottom: Spacing.xs,
  },
  hasPhotos: {
    color: Colors.light.primary,
    fontWeight: '500',
  },
  cardActions: {
    marginLeft: Spacing.md,
  },
  deleteButton: {
    backgroundColor: Colors.light.danger,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    ...Typography.label,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.light.placeholder,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.light.placeholder,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
});
