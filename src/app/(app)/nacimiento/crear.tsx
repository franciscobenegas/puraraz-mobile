import React, { useState, useEffect, useRef } from 'react';
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
import { DatePicker } from '@components/DatePicker';
import { useNacimientoStore } from '@stores/nacimientoStore';
import { useMortandadStore } from '@stores/mortandadStore';
import { Spacing, BorderRadius, Typography } from '@utils/theme';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

const BRAND_GREEN = '#2D6A4F';
const TOTAL_STEPS = 3;

const SEXOS = [{ id: 'Macho', label: 'Macho' }, { id: 'Hembra', label: 'Hembra' }];
const PELAJES = ['Negro', 'Colorado', 'Blanco', 'Bayo', 'Barcino', 'Overo', 'Hosco', 'Pampa'].map(
  (p) => ({ id: p, label: p })
);

const STEP_INFO = [
  { title: 'Identificación', subtitle: 'Fecha y números de caravana' },
  { title: 'Características', subtitle: 'Sexo, pelaje y peso del ternero' },
  { title: 'Ubicación', subtitle: 'Propietario y potrero' },
];

type FormErrors = Record<string, string>;

export default function NacimientoCrearScreen() {
  const router = useRouter();
  const { crear, isLoading } = useNacimientoStore();
  const { propietarios, potreros, cargarTodo } = useMortandadStore();

  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    numeroTernero: '',
    numeroVaca: '',
    sexo: 'Macho',
    pelaje: 'Negro',
    peso: '',
    propietarioId: '',
    potreroId: '',
  });

  useEffect(() => { cargarTodo(); }, []);

  const setField = (key: keyof typeof formData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const validateStep = (s: number): boolean => {
    const e: FormErrors = {};
    if (s === 1) {
      if (!formData.fecha) e.fecha = 'La fecha es requerida';
    }
    if (s === 3) {
      if (!formData.propietarioId) e.propietarioId = 'El propietario es requerido';
      if (!formData.potreroId) e.potreroId = 'El potrero es requerido';
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
    if (!validateStep(step)) return;
    try {
      await crear({
        fecha: formData.fecha,
        numeroVaca: formData.numeroVaca || undefined,
        numeroTernero: formData.numeroTernero || undefined,
        sexo: formData.sexo,
        pelaje: formData.pelaje,
        peso: formData.peso ? Number(formData.peso) : undefined,
        propietarioId: formData.propietarioId,
        potreroId: formData.potreroId,
      });
      Alert.alert('Éxito', 'Nacimiento registrado', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Error', 'No se pudo registrar el nacimiento');
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
      <DatePicker
        label="Fecha"
        value={formData.fecha}
        onChange={setField('fecha')}
        error={errors.fecha}
      />
      <Input
        label="Nº Ternero"
        value={formData.numeroTernero}
        onChangeText={setField('numeroTernero')}
        placeholder="Opcional"
      />
      <Input
        label="Nº Vaca"
        value={formData.numeroVaca}
        onChangeText={setField('numeroVaca')}
        placeholder="Opcional"
        onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150)}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Select
        label="Sexo"
        options={SEXOS}
        value={formData.sexo}
        onSelect={(item) => setFormData((prev) => ({ ...prev, sexo: item.id }))}
        placeholder="Seleccionar sexo"
      />
      <Select
        label="Pelaje"
        options={PELAJES}
        value={formData.pelaje}
        onSelect={(item) => setFormData((prev) => ({ ...prev, pelaje: item.id }))}
        placeholder="Seleccionar pelaje"
      />
      <Input
        label="Peso (kg)"
        value={formData.peso}
        onChangeText={setField('peso')}
        keyboardType="numeric"
        placeholder="Opcional"
      />
    </View>
  );

  const renderStep3 = () => (
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
        label="Potrero"
        placeholder="Seleccionar potrero"
        options={potreros.map((p) => ({ id: p.id, label: p.nombre }))}
        value={formData.potreroId}
        onSelect={(item) => setFormData((prev) => ({ ...prev, potreroId: item.id }))}
        error={errors.potreroId}
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

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          ref={scrollRef}
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
