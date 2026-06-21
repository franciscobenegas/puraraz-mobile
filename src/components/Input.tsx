import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
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
  secureTextEntry,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : styles.inputNormal,
            secureTextEntry && styles.inputWithIcon,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.placeholder}
          secureTextEntry={secureTextEntry && !visible}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setVisible((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {visible
              ? <EyeOff size={20} color={Colors.light.placeholder} />
              : <Eye size={20} color={Colors.light.placeholder} />
            }
          </TouchableOpacity>
        )}
      </View>
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
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    minHeight: 44,
  },
  inputWithIcon: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.md,
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
