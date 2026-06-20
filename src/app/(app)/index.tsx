import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { useMortandadStore } from '@stores/mortandadStore';
import { Button } from '@components/Button';
import { Colors, Spacing, Typography, BorderRadius } from '@utils/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { usuario, logout } = useAuthStore();
  const { mortandades, cargarTodo, isLoading } = useMortandadStore();

  useEffect(() => {
    cargarTodo();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {usuario?.username}</Text>
            <Text style={styles.subtitle}>{usuario?.establecimiento}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mortandades.length}</Text>
            <Text style={styles.statLabel}>Mortandades</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSecondary]}>
            <Text style={[styles.statNumber, styles.statNumberSecondary]}>
              {usuario?.rol}
            </Text>
            <Text style={styles.statLabel}>Rol</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <Button
            title="Registrar Mortandad"
            onPress={() => router.push('/(app)/mortandad/crear')}
            variant="primary"
          />
          <Button
            title="Ver Mortandades"
            onPress={() => router.push('/(app)/mortandad')}
            variant="secondary"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Mortandades</Text>
          {mortandades.slice(0, 3).map((mortandad) => (
            <View key={mortandad.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  Animal: {mortandad.numeroAnimal}
                </Text>
              </View>
              <Text style={styles.cardText}>
                Fecha: {new Date(mortandad.fecha).toLocaleDateString()}
              </Text>
              <Text style={styles.cardText}>
                Potrero: {mortandad.potreroId}
              </Text>
            </View>
          ))}
          {mortandades.length === 0 && (
            <Text style={styles.noDataText}>
              No hay mortandades registradas
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.light.text,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.light.placeholder,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    backgroundColor: Colors.light.danger,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  statCardSecondary: {
    backgroundColor: Colors.light.secondary,
  },
  statNumber: {
    ...Typography.h2,
    color: '#FFFFFF',
  },
  statNumberSecondary: {
    fontSize: 18,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: '#FFFFFF',
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.light.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.light.text,
  },
  cardText: {
    ...Typography.bodySmall,
    color: Colors.light.placeholder,
    marginBottom: Spacing.xs,
  },
  noDataText: {
    ...Typography.body,
    color: Colors.light.placeholder,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
