import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@utils/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  placeholder,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : styles.inputNormal,
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.placeholder}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    minHeight: 44,
  },
  inputNormal: {
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  inputError: {
    borderColor: Colors.light.danger,
    backgroundColor: '#FFE5E5',
    color: Colors.light.text,
  },
  errorText: {
    color: Colors.light.danger,
    ...Typography.label,
    marginTop: Spacing.xs,
  },
});
