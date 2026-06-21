import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { usePesajeStore } from '@stores/pesajeStore';
import { useMortandadStore } from '@stores/mortandadStore';
import { Spacing, BorderRadius, Typography } from '@utils/theme';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

const BRAND_GREEN = '#2D6A4F';
const TOTAL_STEPS = 3;

const STEP_INFO = [
  { title: 'Identificación', subtitle: 'Fecha, número y peso del animal' },
  { title: 'Referencias', subtitle: 'Propietario y motivo del pesaje' },
  { title: 'Detalles', subtitle: 'Categoría, potrero y observaciones' },
];

type FormErrors = Record<string, string>;

export default function PesajeCrearScreen() {
  const router = useRouter();
  const { crear, isLoading, motivos, cargarMotivos } = usePesajeStore();
  const { propietarios, categorias, potreros, cargarTodo } = useMortandadStore();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    numeroAnimal: '',
    peso: '',
    propietarioId: '',
    motivoId: '',
    categoriaId: '',
    potreroId: '',
    observacion: '',
  });

  useEffect(() => { cargarTodo(); cargarMotivos(); }, []);

  const setField = (key: keyof typeof formData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const validateStep = (s: number): boolean => {
    const e: FormErrors = {};
    if (s === 1) {
      if (!formData.numeroAnimal.trim()) e.numeroAnimal = 'El número de animal es requerido';
      if (!formData.peso.trim()) e.peso = 'El peso es requerido';
    }
    if (s === 2) {
      if (!formData.propietarioId) e.propietarioId = 'El propietario es requerido';
      if (!formData.motivoId) e.motivoId = 'El motivo es requerido';
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

  const handleSubmit = async () => {
    try {
      await crear({
        fecha: formData.fecha,
        numeroAnimal: formData.numeroAnimal,
        peso: Number(formData.peso),
        propietarioId: formData.propietarioId,
        motivoId: formData.motivoId,
        categoriaId: formData.categoriaId || undefined,
        potreroId: formData.potreroId || undefined,
        observacion: formData.observacion || undefined,
      });
      Alert.alert('Éxito', 'Pesaje registrado', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Error', 'No se pudo registrar el pesaje');
    }
  };

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
      <Input
        label="Fecha"
        value={formData.fecha}
        onChangeText={setField('fecha')}
        placeholder="YYYY-MM-DD"
      />
      <Input
        label="Nº Animal"
        value={formData.numeroAnimal}
        onChangeText={setField('numeroAnimal')}
        placeholder="Identificación del animal"
        error={errors.numeroAnimal}
      />
      <Input
        label="Peso (kg)"
        value={formData.peso}
        onChangeText={setField('peso')}
        keyboardType="numeric"
        placeholder="0"
        error={errors.peso}
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
        label="Motivo"
        placeholder="Seleccionar motivo"
        options={motivos.map((m) => ({ id: m.id, label: m.nombre }))}
        value={formData.motivoId}
        onSelect={(item) => setFormData((prev) => ({ ...prev, motivoId: item.id }))}
        error={errors.motivoId}
      />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Select
        label="Categoría (opcional)"
        placeholder="Seleccionar categoría"
        options={categorias.map((c) => ({ id: c.id, label: c.nombre }))}
        value={formData.categoriaId}
        onSelect={(item) => setFormData((prev) => ({ ...prev, categoriaId: item.id }))}
      />
      <Select
        label="Potrero (opcional)"
        placeholder="Seleccionar potrero"
        options={potreros.map((p) => ({ id: p.id, label: p.nombre }))}
        value={formData.potreroId}
        onSelect={(item) => setFormData((prev) => ({ ...prev, potreroId: item.id }))}
      />
      <Input
        label="Observación (opcional)"
        value={formData.observacion}
        onChangeText={setField('observacion')}
        placeholder="Notas adicionales"
        multiline
        numberOfLines={3}
      />
    </View>
  );

  const stepContent = [renderStep1, renderStep2, renderStep3][step - 1];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        {renderProgress()}
        <Text style={styles.stepTitle}>{STEP_INFO[step - 1].title}</Text>
        <Text style={styles.stepSubtitle}>{STEP_INFO[step - 1].subtitle}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {stepContent()}
        </ScrollView>
      </KeyboardAvoidingView>

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
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.nextBtnText}>Finalizar</Text>
                <Check size={20} color="#fff" />
              </>
            )}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
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
