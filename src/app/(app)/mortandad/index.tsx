import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMortandadStore } from '@stores/mortandadStore';
import { useNetworkStore } from '@stores/networkStore';

import { Colors, Spacing, Typography, BorderRadius } from '@utils/theme';
import { Plus, Trash2, X, Camera } from 'lucide-react-native';

const BRAND_GREEN = '#2D6A4F';
const BRAND_RED = '#B7472A';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MortandadesListScreen() {
  const router = useRouter();
  const { mortandades, potreros, cargarMortandades, cargarPotreros, isLoading, eliminarMortandad } =
    useMortandadStore();
  const { pendingOperations } = useNetworkStore();
  const pending = pendingOperations.filter((op) => op.module === 'mortandad');

  const [fotosModal, setFotosModal] = useState<{ visible: boolean; fotos: string[] }>({
    visible: false,
    fotos: [],
  });

  useEffect(() => {
    cargarMortandades();
    cargarPotreros();
  }, []);

  const getPotrero = (id: string) => potreros.find((p) => p.id === id)?.nombre ?? id;

  const openMaps = (coords: string) => {
    const url = `https://maps.google.com/?q=${coords}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir Google Maps')
    );
  };

  const openFotos = (item: any) => {
    const fotos = [item.foto1, item.foto2, item.foto3].filter(Boolean) as string[];
    setFotosModal({ visible: true, fotos });
  };

  const closeFotos = () => setFotosModal({ visible: false, fotos: [] });

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
        <Text style={styles.cardText}>Potrero: {getPotrero(item.potreroId)}</Text>
        {item.ubicacionGps ? (
          <TouchableOpacity onPress={() => openMaps(item.ubicacionGps)}>
            <Text style={[styles.cardText, styles.gpsLink]}>📍 {item.ubicacionGps}</Text>
          </TouchableOpacity>
        ) : null}
        {item.foto1 && (
          <TouchableOpacity onPress={() => openFotos(item)}>
            <Text style={[styles.cardText, styles.fotosLink]}>📷 Ver fotos</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id, item.numeroAnimal)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Trash2 size={18} color={BRAND_RED} />
      </TouchableOpacity>
    </View>
  );

  const renderPendingCard = (op: (typeof pending)[0]) => (
    <View key={op.id} style={[styles.card, styles.cardPending]}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Animal: {op.body.numeroAnimal}</Text>
        <Text style={styles.cardText}>
          Fecha: {new Date(op.body.fecha).toLocaleDateString()}
        </Text>
        {op.body.potreroId ? (
          <Text style={styles.cardText}>Potrero: {getPotrero(op.body.potreroId)}</Text>
        ) : null}
        {op.body.ubicacionGps ? (
          <Text style={styles.cardText}>📍 {op.body.ubicacionGps}</Text>
        ) : null}
        <Text style={styles.pendingLabel}>Pendiente de sincronización</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={BRAND_GREEN} />
        </View>
      ) : (
        <FlatList
          data={mortandades}
          keyExtractor={(item) => item.id}
          renderItem={renderMortandadCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            pending.length > 0 ? (
              <>{pending.map(renderPendingCard)}</>
            ) : null
          }
          ListEmptyComponent={
            pending.length === 0 ? (
              <View style={styles.centerContent}>
                <Text style={styles.emptyText}>No hay mortandades registradas</Text>
              </View>
            ) : null
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(app)/mortandad/crear')}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal de fotos */}
      <Modal
        visible={fotosModal.visible}
        transparent
        animationType="fade"
        onRequestClose={closeFotos}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Camera size={18} color={BRAND_GREEN} />
                <Text style={styles.modalTitle}>Fotografías Mortandad</Text>
              </View>
              <TouchableOpacity onPress={closeFotos} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={22} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Fotos */}
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {fotosModal.fotos.map((uri, idx) => (
                <View key={idx} style={styles.photoWrapper}>
                  <Text style={styles.photoLabel}>Foto {idx + 1}</Text>
                  <Image
                    source={{ uri }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>

            {/* Footer */}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeFotos}>
              <Text style={styles.modalCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: 80,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E8F0ED',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: Spacing.xs,
  },
  cardText: {
    ...Typography.bodySmall,
    color: '#666',
    marginBottom: Spacing.xs,
  },
  gpsLink: {
    color: BRAND_GREEN,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  fotosLink: {
    color: BRAND_GREEN,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardPending: {
    backgroundColor: '#FFFBF0',
    borderColor: '#E8D080',
  },
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
  deleteBtn: {
    marginLeft: Spacing.sm,
    padding: 4,
  },
  emptyText: {
    ...Typography.body,
    color: '#888',
    textAlign: 'center',
  },
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0ED',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  photoWrapper: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8F0ED',
  },
  photoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_GREEN,
    backgroundColor: '#EAF3EE',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  photo: {
    width: '100%',
    height: SCREEN_WIDTH * 0.6,
  },
  modalCloseBtn: {
    margin: Spacing.md,
    backgroundColor: BRAND_GREEN,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
