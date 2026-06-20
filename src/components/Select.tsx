import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@utils/theme';

interface SelectItem {
  id: string;
  label: string;
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
  placeholder,
  options,
  value,
  onSelect,
  error,
}) => {
  const selectedLabel = options.find((o) => o.id === value)?.label || placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.selectButton,
          error ? styles.selectError : styles.selectNormal,
        ]}
      >
        <Text
          style={[
            styles.selectText,
            !value && styles.selectPlaceholder,
          ]}
        >
          {selectedLabel || placeholder}
        </Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              value === item.id && styles.optionSelected,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.optionText,
                value === item.id && styles.optionTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.sm,
    color: Colors.light.text,
  },
  selectButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  selectNormal: {
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  selectError: {
    borderColor: Colors.light.danger,
    backgroundColor: '#FFE5E5',
  },
  selectText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  selectPlaceholder: {
    color: Colors.light.placeholder,
  },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionSelected: {
    backgroundColor: Colors.light.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorText: {
    color: Colors.light.danger,
    ...Typography.label,
    marginTop: Spacing.xs,
  },
});
