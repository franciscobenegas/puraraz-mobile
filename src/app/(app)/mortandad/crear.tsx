import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { DatePicker } from '@components/DatePicker';
import { useMortandadStore } from '@stores/mortandadStore';
import { Spacing, BorderRadius, Typography, Colors } from '@utils/theme';
import { Camera, ImageIcon, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

const BRAND_GREEN = '#2D6A4F';
const TOTAL_STEPS = 4;

const STEP_INFO = [
  { title: 'Identificación', subtitle: 'Fecha y número de caravana' },
  { title: 'Referencias',    subtitle: 'Propietario, categoría y causa' },
  { title: 'Ubicación',      subtitle: 'Potrero y coordenadas GPS' },
  { title: 'Fotografías',    subtitle: 'Evidencia fotográfica (opcional)' },
];

type Fotos = { foto1?: string; foto2?: string; foto3?: string };
type FormErrors = Record<string, string>;

export default function CrearMortandadScreen() {
  const router = useRouter();
  const { crearMortandad, isLoading, categorias, causasMortandad, potreros, propietarios, cargarTodo } =
    useMortandadStore();

  const [step, setStep] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    numeroAnimal: '',
    propietarioId: '',
    categoriaId: '',
    causaId: '',
    potreroId: '',
    ubicacionGps: '',
  });

  const [fotos, setFotos] = useState<Fotos>({});

  useEffect(() => { cargarTodo(); }, []);

  const set = (key: keyof typeof formData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const validateStep = (s: number): boolean => {
    const e: FormErrors = {};
    if (s === 1) {
      if (!formData.fecha) e.fecha = 'La fecha es requerida';
      if (!formData.numeroAnimal.trim()) e.numeroAnimal = 'El número de caravana es requerido';
    }
    if (s === 2) {
      if (!formData.propietarioId) e.propietarioId = 'El propietario es requerido';
      if (!formData.categoriaId) e.categoriaId = 'La categoría es requerida';
      if (!formData.causaId) e.causaId = 'La causa de mortandad es requerida';
    }
    if (s === 3) {
      if (!formData.potreroId) e.potreroId = 'El potrero es requerido';
      if (!formData.ubicacionGps.trim()) e.ubicacionGps = 'La ubicación GPS es requerida';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const captureLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere permiso de ubicación');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setFormData((prev) => ({
        ...prev,
        ubicacionGps: `${loc.coords.latitude.toFixed(6)},${loc.coords.longitude.toFixed(6)}`,
      }));
    } catch {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickImage = async (num: 1 | 2 | 3, fromCamera: boolean) => {
    try {
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.7 });
      if (!result.canceled) {
        setFotos((prev) => ({ ...prev, [`foto${num}`]: result.assets[0].uri }));
      }
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const removePhoto = (num: 1 | 2 | 3) =>
    setFotos((prev) => { const n = { ...prev }; delete n[`foto${num}` as keyof Fotos]; return n; });

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      (Object.keys(formData) as (keyof typeof formData)[]).forEach((k) => form.append(k, formData[k]));
      (Object.keys(fotos) as (keyof Fotos)[]).forEach((k) => {
        const uri = fotos[k];
        if (uri) form.append(k, { uri, type: 'image/jpeg', name: `${k}.jpg` } as any);
      });
      await crearMortandad(form);
      Alert.alert('Éxito', 'Mortandad registrada correctamente', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Error al registrar');
    }
  };

  // ── Render helpers ──────────────────────────────────────────────────────────

  const renderProgress = () => (
    <View style={styles.progressWrapper}>
      {STEP_INFO.map((info, idx) => {
        const num = idx + 1;
        const done = num < step;
        const active = num === step;
        return (
          <React.Fragment key={num}>
            <View style={styles.stepDot}>
              <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                {done
                  ? <Check size={12} color="#fff" />
                  : <Text style={[styles.dotText, active && styles.dotTextActive]}>{num}</Text>}
              </View>
              <Text style={[styles.stepLabel, active && styles.stepLabelActive]} numberOfLines={1}>
                {info.title}
              </Text>
            </View>
            {num < TOTAL_STEPS && (
              <View style={[styles.connector, num < step && styles.connectorDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <DatePicker
        label="Fecha"
        value={formData.fecha}
        onChange={set('fecha')}
        error={errors.fecha}
      />
      <Input
        label="Número de Caravana"
        value={formData.numeroAnimal}
        onChangeText={set('numeroAnimal')}
        placeholder="Ej: 12345"
        keyboardType="numeric"
        error={errors.numeroAnimal}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Select
        label="Propietario"
        placeholder="Seleccionar propietario"
        options={propietarios.map((p) => ({ id: p.id, label: p.nombre }))}
        value={formData.propietarioId}
        onSelect={(item) => setFormData((prev) => ({ ...prev, propietarioId: item.id }))}
        error={errors.propietarioId}
      />
      <Select
        label="Categoría"
        placeholder="Seleccionar categoría"
        options={categorias.map((c) => ({ id: c.id, label: c.nombre }))}
        value={formData.categoriaId}
        onSelect={(item) => setFormData((prev) => ({ ...prev, categoriaId: item.id }))}
        error={errors.categoriaId}
      />
      <Select
        label="Causa de Mortandad"
        placeholder="Seleccionar causa"
        options={causasMortandad.map((c) => ({ id: c.id, label: c.nombre }))}
        value={formData.causaId}
        onSelect={(item) => setFormData((prev) => ({ ...prev, causaId: item.id }))}
        error={errors.causaId}
      />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Select
        label="Potrero"
        placeholder="Seleccionar potrero"
        options={potreros.map((p) => ({ id: p.id, label: p.nombre }))}
        value={formData.potreroId}
        onSelect={(item) => setFormData((prev) => ({ ...prev, potreroId: item.id }))}
        error={errors.potreroId}
      />

      <TouchableOpacity
        style={styles.gpsButton}
        onPress={captureLocation}
        disabled={loadingLocation}
      >
        {loadingLocation
          ? <ActivityIndicator size="small" color="#fff" />
          : <MapPin size={18} color="#fff" />}
        <Text style={styles.gpsButtonText}>
          {loadingLocation ? 'Obteniendo ubicación…' : 'Capturar ubicación GPS'}
        </Text>
      </TouchableOpacity>

      <Input
        label="Coordenadas GPS"
        value={formData.ubicacionGps}
        onChangeText={set('ubicacionGps')}
        placeholder="-25.2637, -57.5759"
        error={errors.ubicacionGps}
      />
    </View>
  );

  const renderStep4 = () => (
    <View>
      {([1, 2, 3] as const).map((num) => {
        const uri = fotos[`foto${num}` as keyof Fotos];
        return (
          <View key={num} style={styles.photoCard}>
            <Text style={styles.photoCardTitle}>Foto {num}</Text>
            {uri ? (
              <View>
                <Image source={{ uri }} style={styles.photoPreview} resizeMode="cover" />
                <TouchableOpacity style={styles.removePhotoBtn} onPress={() => removePhoto(num)}>
                  <Text style={styles.removePhotoBtnText}>Quitar foto</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoActions}>
                <TouchableOpacity style={styles.photoBtn} onPress={() => pickImage(num, true)}>
                  <Camera size={20} color={BRAND_GREEN} />
                  <Text style={styles.photoBtnText}>Cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={() => pickImage(num, false)}>
                  <ImageIcon size={20} color={BRAND_GREEN} />
                  <Text style={styles.photoBtnText}>Galería</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4][step - 1];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Step header */}
      <View style={styles.header}>
        {renderProgress()}
        <Text style={styles.stepTitle}>{STEP_INFO[step - 1].title}</Text>
        <Text style={styles.stepSubtitle}>{STEP_INFO[step - 1].subtitle}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {stepContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom navigation */}
      <View style={styles.navBar}>
        {step > 1 ? (
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <ChevronLeft size={20} color={BRAND_GREEN} />
            <Text style={styles.backBtnText}>Anterior</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}

        {step < TOTAL_STEPS ? (
          <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
            <Text style={styles.nextBtnText}>Siguiente</Text>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, isLoading && styles.nextBtnDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator size="small" color="#fff" />
              : <>
                  <Text style={styles.nextBtnText}>Finalizar</Text>
                  <Check size={20} color="#fff" />
                </>
            }
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0ED',
  },
  // Progress
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepDot: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: BRAND_GREEN,
  },
  dotDone: {
    backgroundColor: BRAND_GREEN,
  },
  dotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
  },
  dotTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 9,
    color: '#999',
    fontWeight: '500',
    maxWidth: 56,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: BRAND_GREEN,
    fontWeight: '700',
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E5EA',
    marginBottom: 16,
    marginHorizontal: 2,
  },
  connectorDone: {
    backgroundColor: BRAND_GREEN,
  },
  stepTitle: {
    ...Typography.h3,
    color: BRAND_GREEN,
    marginBottom: 2,
  },
  stepSubtitle: {
    ...Typography.bodySmall,
    color: '#888',
  },
  // Scroll content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  // GPS
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_GREEN,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  gpsButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  // Photos
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E8F0ED',
  },
  photoCardTitle: {
    ...Typography.label,
    color: BRAND_GREEN,
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  removePhotoBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  removePhotoBtnText: {
    color: Colors.light.danger,
    fontWeight: '600',
    fontSize: 13,
  },
  photoActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    backgroundColor: '#EAF3EE',
  },
  photoBtnText: {
    color: BRAND_GREEN,
    fontWeight: '600',
    fontSize: 14,
  },
  // Bottom nav
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8F0ED',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    gap: 4,
  },
  backBtnText: {
    color: BRAND_GREEN,
    fontWeight: '600',
    fontSize: 15,
  },
  backBtnPlaceholder: {
    width: 100,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: BRAND_GREEN,
    gap: 4,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  nextBtnDisabled: {
    opacity: 0.6,
  },
});
