import { StyleSheet } from 'react-native';

export const Colors = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    border: '#E5E5EA',
    primary: '#007AFF',
    secondary: '#5AC8FA',
    danger: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    placeholder: '#C7C7CC',
  },
  dark: {
    background: '#1C1C1E',
    text: '#FFFFFF',
    border: '#3A3A3C',
    primary: '#0A84FF',
    secondary: '#00C7FF',
    danger: '#FF453A',
    success: '#32AE5E',
    warning: '#FF9500',
    placeholder: '#8E8E93',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 38,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
