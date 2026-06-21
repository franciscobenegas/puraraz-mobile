import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuthStore } from '@stores/authStore';
import { Colors, Spacing, BorderRadius, Typography } from '@utils/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'El email es requerido';
    if (!password.trim()) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      await login(email, password);
      router.replace('/(app)');
    } catch (err) {
      Alert.alert('Error', error || 'Error al iniciar sesión');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.topSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('@assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>Pura Raza</Text>
            <Text style={styles.tagline}>Gestión de Ganadería</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>

            <Input
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
              error={errors.email}
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
              secureTextEntry
              autoComplete="password"
              editable={!isLoading}
              error={errors.password}
            />

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={isLoading}
              disabled={!email || !password || isLoading}
            />
          </View>

          <Text style={styles.version}>v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const BRAND_GREEN = '#2D6A4F';
const SURFACE = '#F8FAF9';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_GREEN,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: 'center',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 96,
    height: 96,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: BRAND_GREEN,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FFE5E5',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.danger,
  },
  errorBannerText: {
    color: Colors.light.danger,
    ...Typography.bodySmall,
  },
  version: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: Spacing.sm,
  },
});
