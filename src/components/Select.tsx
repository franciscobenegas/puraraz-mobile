import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@utils/theme';
import { ChevronDown, Check, X } from 'lucide-react-native';

const BRAND_GREEN = '#2D6A4F';

interface SelectItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectItem[];
  value?: string;
  onSelect: (item: SelectItem) => void;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Seleccionar...',
  options,
  value,
  onSelect,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const selectedItem = options.find((o) => o.id === value);

  const handleSelect = (item: SelectItem) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : styles.triggerNormal]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, !selectedItem && styles.triggerPlaceholder]} numberOfLines={1}>
          {selectedItem?.label ?? placeholder}
        </Text>
        <ChevronDown size={18} color={selectedItem ? '#444' : Colors.light.placeholder} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label ?? placeholder}</Text>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              style={styles.list}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const selected = item.id === value;
                return (
                  <TouchableOpacity
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.6}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                    <View style={styles.optionRight}>
                      {item.sublabel !== undefined && (
                        <View style={styles.sublabelBadge}>
                          <Text style={styles.sublabelBadgeText}>{item.sublabel}</Text>
                        </View>
                      )}
                      {selected && <Check size={16} color={BRAND_GREEN} />}
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Sin opciones disponibles</Text>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
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
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    marginRight: Spacing.xs,
  },
  triggerPlaceholder: {
    color: Colors.light.placeholder,
  },
  errorText: {
    color: Colors.light.danger,
    ...Typography.label,
    marginTop: Spacing.xs,
  },
  // Modal
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
    maxHeight: '70%',
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
  list: {
    flexGrow: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginHorizontal: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  optionSelected: {
    backgroundColor: '#EAF3EE',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  optionTextSelected: {
    color: BRAND_GREEN,
    fontWeight: '600',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  sublabelBadge: {
    backgroundColor: '#D8EEE5',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sublabelBadgeText: {
    fontSize: 12,
    color: BRAND_GREEN,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.light.placeholder,
    padding: Spacing.lg,
    fontSize: 14,
  },
});
