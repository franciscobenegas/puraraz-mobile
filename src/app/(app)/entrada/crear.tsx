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
import { useEntradaStore } from '@stores/entradaStore';
import { useMortandadStore } from '@stores/mortandadStore';
import { Spacing, BorderRadius, Typography } from '@utils/theme';
import { ChevronLeft, ChevronRight, Check, Plus, Trash2 } from 'lucide-react-native';

const BRAND_GREEN = '#2D6A4F';
const BRAND_RED = '#B7472A';
const TOTAL_STEPS = 2;

const STEP_INFO = [
  { title: 'Cabecera', subtitle: 'Fecha, origen, propietario y motivo' },
  { title: 'Detalle', subtitle: 'Categorías y cantidades ingresadas' },
];

type FormErrors = Record<string, string>;
type ItemEntry = { categoriaId: string; cantidad: string };

export default function EntradaCrearScreen() {
  const router = useRouter();
  const { crear, isLoading, motivos, cargarMotivos } = useEntradaStore();
  const { propietarios, categorias, cargarTodo } = useMortandadStore();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    estanciaOrigen: '',
    propietarioId: '',
    motivoId: '',
  });

  const [items, setItems] = useState<ItemEntry[]>([{ categoriaId: '', cantidad: '1' }]);

  useEffect(() => { cargarTodo(); cargarMotivos(); }, []);

  const setField = (key: keyof typeof formData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const addItem = () => setItems((prev) => [...prev, { categoriaId: '', cantidad: '1' }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof ItemEntry, value: string) =>
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const validateStep = (s: number): boolean => {
    const e: FormErrors = {};
    if (s === 1) {
      if (!formData.fecha) e.fecha = 'La fecha es requerida';
      if (!formData.estanciaOrigen.trim()) e.estanciaOrigen = 'El nombre de la estancia es requerido';
      if (!formData.propietarioId) e.propietarioId = 'El propietario es requerido';
      if (!formData.motivoId) e.motivoId = 'El motivo es requerido';
    }
    if (s === 2) {
      items.forEach((item, i) => {
        if (!item.categoriaId) {
          e[`cat_${i}`] = 'Selecciona una categoría';
        }
        if (!item.cantidad || Number(item.cantidad) <= 0) {
          e[`qty_${i}`] = 'Ingresa una cantidad válida';
        }
      });
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
        NombreEstanciaOrigen: formData.estanciaOrigen,
        propietarioId: formData.propietarioId,
        motivoId: formData.motivoId,
        items: items.map((i) => ({ categoriaId: i.categoriaId, cantidad: Number(i.cantidad) })),
      });
      Alert.alert('Éxito', 'Entrada registrada', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Error', 'No se pudo registrar la entrada');
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
        error={errors.fecha}
      />
      <Input
        label="Nombre Estancia Origen"
        value={formData.estanciaOrigen}
        onChangeText={setField('estanciaOrigen')}
        placeholder="Nombre de la estancia de origen"
        error={errors.estanciaOrigen}
      />
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

  const renderStep2 = () => (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.itemCard}>
          <View style={styles.itemCardHeader}>
            <Text style={styles.itemCardTitle}>Ítem {i + 1}</Text>
            {items.length > 1 && (
              <TouchableOpacity
                onPress={() => removeItem(i)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Trash2 size={16} color={BRAND_RED} />
              </TouchableOpacity>
            )}
          </View>
          <Select
            options={categorias.map((c) => ({
              id: c.id,
              label: c.nombre,
              sublabel: String(c.cantidad),
            }))}
            value={item.categoriaId}
            onSelect={(sel) => updateItem(i, 'categoriaId', sel.id)}
            placeholder="Seleccionar categoría"
            error={errors[`cat_${i}`]}
          />
          <Input
            label="Cantidad"
            value={item.cantidad}
            onChangeText={(v) => updateItem(i, 'cantidad', v)}
            keyboardType="numeric"
            placeholder="0"
            error={errors[`qty_${i}`]}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addItemBtn} onPress={addItem}>
        <Plus size={16} color={BRAND_GREEN} />
        <Text style={styles.addItemBtnText}>Agregar Categoría</Text>
      </TouchableOpacity>
    </View>
  );

  const stepContent = [renderStep1, renderStep2][step - 1];

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
  dotActive: { backgroundColor: BRAND_GREEN },
  dotDone: { backgroundColor: BRAND_GREEN },
  dotText: { fontSize: 12, fontWeight: '700', color: '#999' },
  dotTextActive: { color: '#FFFFFF' },
  stepLabel: { fontSize: 9, color: '#999', fontWeight: '500', maxWidth: 56, textAlign: 'center' },
  stepLabelActive: { color: BRAND_GREEN, fontWeight: '700' },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E5EA',
    marginBottom: 16,
    marginHorizontal: 2,
  },
  connectorDone: { backgroundColor: BRAND_GREEN },
  stepTitle: { ...Typography.h3, color: BRAND_GREEN, marginBottom: 2 },
  stepSubtitle: { ...Typography.bodySmall, color: '#888' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  // Items
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E8F0ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_GREEN,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    borderStyle: 'dashed',
    backgroundColor: '#EAF3EE',
    marginTop: Spacing.xs,
  },
  addItemBtnText: {
    color: BRAND_GREEN,
    fontWeight: '600',
    fontSize: 14,
  },
  // Nav bar
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
  backBtnText: { color: BRAND_GREEN, fontWeight: '600', fontSize: 15 },
  backBtnPlaceholder: { width: 100 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: BRAND_GREEN,
    gap: 4,
  },
  nextBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  nextBtnDisabled: { opacity: 0.6 },
});
