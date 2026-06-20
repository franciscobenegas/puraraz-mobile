import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuthStore } from '@stores/authStore';
import { Colors, Spacing, Typography } from '@utils/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(username, password);
      router.replace('/(app)');
    } catch (err) {
      Alert.alert('Error', error || 'Error al iniciar sesión');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Puraraz Mobile</Text>
          <Text style={styles.subtitle}>Gestión de Ganadería</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Usuario"
            placeholder="Tu usuario"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
            error={errors.username}
          />

          <Input
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            error={errors.password}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          )}

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!username || !password}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Versión 1.0.0
          </Text>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.light.placeholder,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.danger,
  },
  errorMessage: {
    color: Colors.light.danger,
    ...Typography.bodySmall,
  },
  footer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  footerText: {
    color: Colors.light.placeholder,
    ...Typography.bodySmall,
  },
});
