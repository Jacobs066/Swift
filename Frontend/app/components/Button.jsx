import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// variant: 'primary' | 'secondary' | 'danger'
const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style, textStyle }) => {
  const { colors, radius, spacing } = useTheme();

  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      backgroundColor: isDisabled ? colors.disabled : colors.accent,
      textColor: colors.accentText,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: 'transparent',
      textColor: isDisabled ? colors.disabled : colors.accent,
      borderWidth: 1,
      borderColor: isDisabled ? colors.disabled : colors.accent,
    },
    danger: {
      backgroundColor: isDisabled ? colors.disabled : colors.error,
      textColor: colors.accentText,
      borderWidth: 0,
    },
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderWidth: variantStyles.borderWidth,
          borderColor: variantStyles.borderColor,
          borderRadius: radius.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <Text style={[styles.text, { color: variantStyles.textColor }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
