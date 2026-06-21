import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '@stores/authStore';
import { useMortandadStore } from '@stores/mortandadStore';
import { Spacing, BorderRadius, Typography } from '@utils/theme';
import { Menu, X, LogOut, Skull, Baby, Download, Upload, Scale } from 'lucide-react-native';

const BRAND_GREEN = '#2D6A4F';
const BRAND_GREEN_MID = '#40916C';
const BRAND_RED = '#B7472A';
const SURFACE = '#F8FAF9';
const DRAWER_WIDTH = 300;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const NAV_ITEMS = [
  { icon: Skull,    label: 'Mortandad',  route: '/(app)/mortandad'  as const },
  { icon: Baby,     label: 'Nacimiento', route: '/(app)/nacimiento' as const },
  { icon: Download, label: 'Entrada',    route: '/(app)/entrada'    as const },
  { icon: Upload,   label: 'Salida',     route: '/(app)/salida'     as const },
  { icon: Scale,    label: 'Pesaje',     route: '/(app)/pesaje'     as const },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { usuario, logout } = useAuthStore();
  const { mortandades, categorias, isLoading, cargarTodo } = useMortandadStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      cargarTodo();
    }, [])
  );

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setShowLoading(false));
    } else {
      setShowLoading(true);
      loadingOpacity.setValue(1);
    }
  }, [isLoading]);

  const openMenu = () => {
    setMenuOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0,            duration: 260, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 1,          duration: 260, useNativeDriver: true }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0,           duration: 220, useNativeDriver: true }),
    ]).start(() => setMenuOpen(false));
  };

  const navigateTo = (route: string) => {
    closeMenu();
    setTimeout(() => router.push(route as any), 240);
  };

  const handleLogout = () => {
    closeMenu();
    setTimeout(() => {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cerrar Sesión', style: 'destructive', onPress: async () => { await logout(); } },
        ]
      );
    }, 260);
  };

  const totalAnimales = categorias.reduce((sum, c) => sum + (c.cantidad ?? 0), 0);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_GREEN} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.hamburger} onPress={openMenu} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Menu size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>{usuario?.usuario}</Text>
          <Text style={styles.headerSub}>{usuario?.establesimiento}</Text>
        </View>
      </View>

      {/* Main content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: BRAND_GREEN }]}>
            <Text style={styles.statNumber}>{totalAnimales}</Text>
            <Text style={styles.statLabel}>Total{'\n'}Animales</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: BRAND_GREEN_MID }]}>
            <Text style={styles.statNumber}>{categorias.length}</Text>
            <Text style={styles.statLabel}>Clasifi-{'\n'}caciones</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: BRAND_RED }]}>
            <Text style={styles.statNumber}>{mortandades.length}</Text>
            <Text style={styles.statLabel}>Mortan-{'\n'}dades</Text>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickGrid}>
            {NAV_ITEMS.map(({ icon: Icon, label, route }) => (
              <TouchableOpacity
                key={route}
                style={styles.quickCard}
                onPress={() => router.push(route as any)}
              >
                <View style={styles.quickIconWrap}>
                  <Icon size={24} color={BRAND_GREEN} />
                </View>
                <Text style={styles.quickLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Clasificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clasificaciones</Text>
          {categorias.length === 0 ? (
            <Text style={styles.noData}>No hay clasificaciones registradas</Text>
          ) : (
            categorias.map((cat) => (
              <View key={cat.id} style={styles.clsCard}>
                <View style={styles.clsLeft}>
                  <Text style={styles.clsName}>{cat.nombre}</Text>
                  <Text style={styles.clsMeta}>{cat.sexo} · {cat.edad} · {cat.pelaje}</Text>
                </View>
                <View style={[styles.clsBadge, { backgroundColor: cat.cantidad > 0 ? BRAND_GREEN : '#C7C7CC' }]}>
                  <Text style={styles.clsCount}>{cat.cantidad}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Drawer overlay + panel */}
      {menuOpen && (
        <>
          <Animated.View
            style={[styles.overlay, { opacity: overlayAnim }]}
            pointerEvents="auto"
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
          </Animated.View>

          <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
            {/* Drawer header */}
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerUser}>{usuario?.usuario}</Text>
                <Text style={styles.drawerEstab}>{usuario?.establesimiento}</Text>
              </View>
              <TouchableOpacity onPress={closeMenu} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={22} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>

            {/* Nav items */}
            <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
              {NAV_ITEMS.map(({ icon: Icon, label, route }) => (
                <TouchableOpacity
                  key={route}
                  style={styles.navItem}
                  onPress={() => navigateTo(route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.navIconWrap}>
                    <Icon size={20} color={BRAND_GREEN} />
                  </View>
                  <Text style={styles.navLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Logout */}
            <View style={styles.drawerFooter}>
              <TouchableOpacity style={styles.logoutItem} onPress={handleLogout} activeOpacity={0.7}>
                <View style={[styles.navIconWrap, { backgroundColor: '#FFE5E5' }]}>
                  <LogOut size={20} color={BRAND_RED} />
                </View>
                <Text style={[styles.navLabel, { color: BRAND_RED }]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}

      {/* Loading overlay */}
      {showLoading && (
        <Animated.View style={[styles.loadingOverlay, { opacity: loadingOpacity }]} pointerEvents={isLoading ? 'auto' : 'none'}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Cargando información</Text>
            <Text style={styles.loadingSubText}>
              Estamos obteniendo los datos de tu establecimiento.{'\n'}Por favor aguarda un momento…
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BRAND_GREEN,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  hamburger: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: SURFACE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    ...Typography.h2,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: BRAND_GREEN,
    marginBottom: Spacing.md,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EAF3EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  clsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  clsLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  clsName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  clsMeta: {
    fontSize: 12,
    color: '#888',
  },
  clsBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clsCount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  noData: {
    ...Typography.body,
    color: '#888',
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(45, 106, 79, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Drawer
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 16,
  },
  drawerHeader: {
    backgroundColor: BRAND_GREEN,
    paddingTop: Spacing.xl + Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  drawerUser: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  drawerEstab: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  drawerScroll: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  navIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EAF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
});
