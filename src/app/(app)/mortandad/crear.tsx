import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Select } from '@components/Select';
import { useMortandadStore } from '@stores/mortandadStore';
import { useAuthStore } from '@stores/authStore';
import { Colors, Spacing, Typography } from '@utils/theme';

interface FormErrors {
  [key: string]: string;
}

export default function CrearMortandadScreen() {
  const router = useRouter();
  const { usuario } = useAuthStore();
  const {
    crearMortandad,
    isLoading,
    categorias,
    causasMortandad,
    potreros,
    propietarios,
    cargarTodo,
  } = useMortandadStore();

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    propietarioId: '',
    numeroAnimal: '',
    categoriaId: '',
    causaId: '',
    potreroId: '',
    ubicacionGps: '',
  });

  const [fotos, setFotos] = useState<{
    foto1?: string;
    foto2?: string;
    foto3?: string;
  }>({});

  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    cargarTodo();
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.propietarioId)
      newErrors.propietarioId = 'El propietario es requerido';
    if (!formData.numeroAnimal.trim())
      newErrors.numeroAnimal = 'El número de animal es requerido';
    if (!formData.categoriaId)
      newErrors.categoriaId = 'La categoría es requerida';
    if (!formData.causaId)
      newErrors.causaId = 'La causa de mortandad es requerida';
    if (!formData.potreroId) newErrors.potreroId = 'El potrero es requerido';
    if (!formData.ubicacionGps.trim())
      newErrors.ubicacionGps = 'La ubicación GPS es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requestLocationPermission = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere permiso de ubicación');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setFormData((prev) => ({
        ...prev,
        ubicacionGps: `${latitude},${longitude}`,
      }));

      Alert.alert('Éxito', 'Ubicación capturada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickImage = async (fotoNumber: 1 | 2 | 3) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setFotos((prev) => ({
          ...prev,
          [`foto${fotoNumber}`]: uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const takePicture = async (fotoNumber: 1 | 2 | 3) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setFotos((prev) => ({
          ...prev,
          [`foto${fotoNumber}`]: uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la imagen');
    }
  };

  const handleCreateMortandad = async () => {
    if (!validateForm()) return;

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key as keyof typeof formData]);
      });

      Object.keys(fotos).forEach((key) => {
        const fotoUri = fotos[key as keyof typeof fotos];
        if (fotoUri) {
          form.append(key, {
            uri: fotoUri,
            type: 'image/jpeg',
            name: `${key}.jpg`,
          } as any);
        }
      });

      await crearMortandad(form);
      Alert.alert('Éxito', 'Mortandad registrada correctamente');
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear mortandad';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <Input
            label="Fecha"
            value={formData.fecha}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, fecha: value }))
            }
            placeholder="YYYY-MM-DD"
            error={errors.fecha}
          />

          <Input
            label="Número de Animal (Caravana)"
            value={formData.numeroAnimal}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, numeroAnimal: value }))
            }
            placeholder="Ej: 12345"
            error={errors.numeroAnimal}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referencias</Text>

          <Select
            label="Propietario"
            placeholder="Seleccionar propietario"
            options={propietarios.map((p) => ({
              id: p.id,
              label: p.nombre,
            }))}
            value={formData.propietarioId}
            onSelect={(item) =>
              setFormData((prev) => ({ ...prev, propietarioId: item.id }))
            }
            error={errors.propietarioId}
          />

          <Select
            label="Categoría"
            placeholder="Seleccionar categoría"
            options={categorias.map((c) => ({
              id: c.id,
              label: c.nombre,
            }))}
            value={formData.categoriaId}
            onSelect={(item) =>
              setFormData((prev) => ({ ...prev, categoriaId: item.id }))
            }
            error={errors.categoriaId}
          />

          <Select
            label="Causa de Mortandad"
            placeholder="Seleccionar causa"
            options={causasMortandad.map((c) => ({
              id: c.id,
              label: c.nombre,
            }))}
            value={formData.causaId}
            onSelect={(item) =>
              setFormData((prev) => ({ ...prev, causaId: item.id }))
            }
            error={errors.causaId}
          />

          <Select
            label="Potrero"
            placeholder="Seleccionar potrero"
            options={potreros.map((p) => ({
              id: p.id,
              label: p.nombre,
            }))}
            value={formData.potreroId}
            onSelect={(item) =>
              setFormData((prev) => ({ ...prev, potreroId: item.id }))
            }
            error={errors.potreroId}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>

          <Button
            title={
              loadingLocation
                ? 'Obteniendo ubicación...'
                : 'Capturar Ubicación GPS'
            }
            onPress={requestLocationPermission}
            variant="secondary"
            disabled={loadingLocation}
          />

          <Input
            label="Coordenadas GPS"
            value={formData.ubicacionGps}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, ubicacionGps: value }))
            }
            placeholder="Ej: -25.2637, -57.5759"
            error={errors.ubicacionGps}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotografías (Opcional)</Text>

          {[1, 2, 3].map((num) => (
            <View key={num} style={styles.photoSection}>
              <Text style={styles.photoLabel}>Foto {num}</Text>
              {fotos[`foto${num}` as keyof typeof fotos] && (
                <Text style={styles.photoSelected}>
                  ✓ Foto seleccionada
                </Text>
              )}
              <View style={styles.photoButtons}>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={() => takePicture(num as 1 | 2 | 3)}
                >
                  <Text style={styles.photoButtonText}>📷 Cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={() => pickImage(num as 1 | 2 | 3)}
                >
                  <Text style={styles.photoButtonText}>📁 Galería</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            title="Registrar Mortandad"
            onPress={handleCreateMortandad}
            loading={isLoading}
            disabled={isLoading}
            variant="primary"
            size="lg"
          />
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
    paddingVertical: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
    paddingBottomSpacing: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  photoSection: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.border,
    borderRadius: 8,
  },
  photoLabel: {
    ...Typography.label,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  photoSelected: {
    ...Typography.bodySmall,
    color: Colors.light.success,
    marginBottom: Spacing.sm,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
  },
  actions: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
