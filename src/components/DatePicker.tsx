import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@utils/theme';

const BRAND_GREEN = '#2D6A4F';

interface DatePickerProps {
  label?: string;
  value: string; // stored as YYYY-MM-DD
  onChange: (isoDate: string) => void;
  error?: string;
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toDisplay(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, error }) => {
  const [show, setShow] = useState(false);
  const currentDate = value ? parseISO(value) : new Date();

  const handleChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selected) {
      onChange(toISO(selected));
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : styles.triggerNormal]}
        onPress={() => setShow(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]}>
          {value ? toDisplay(value) : 'DD-MM-AAAA'}
        </Text>
        <CalendarDays size={18} color={value ? '#444' : Colors.light.placeholder} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Android: dialog nativo aparece directamente */}
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="calendar"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}

      {/* iOS: calendario embebido en modal */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={() => setShow(false)}
          statusBarTranslucent
        >
          <Pressable style={styles.overlay} onPress={() => setShow(false)}>
            <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{label ?? 'Seleccionar fecha'}</Text>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.doneText}>Listo</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="inline"
                onChange={handleChange}
                maximumDate={new Date()}
                style={styles.iosPicker}
                accentColor={BRAND_GREEN}
                themeVariant="light"
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    minHeight: 48,
    backgroundColor: '#FFFFFF',
  },
  triggerNormal: {
    borderColor: Colors.light.border,
  },
  triggerError: {
    borderColor: Colors.light.danger,
    backgroundColor: '#FFE5E5',
  },
  triggerText: {
    fontSize: 15,
    color: Colors.light.text,
  },
  triggerPlaceholder: {
    color: Colors.light.placeholder,
  },
  errorText: {
    color: Colors.light.danger,
    ...Typography.label,
    marginTop: Spacing.xs,
  },
  // iOS Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  doneText: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND_GREEN,
  },
  iosPicker: {
    width: '100%',
  },
});
