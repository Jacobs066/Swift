import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TextInput = ({ label, error, secureTextEntry, style, ...rest }) => {
  const { colors, radius, spacing, typography } = useTheme();
  const [hidden, setHidden] = useState(secureTextEntry);
  const isPassword = !!secureTextEntry;

  return (
    <View style={{ marginTop: spacing.sm }}>
      {label ? (
        <Text style={[styles.label, typography.caption, { color: colors.textMuted }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          },
          style,
        ]}
      >
        <RNTextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword ? hidden : false}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setHidden(!hidden)}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default TextInput;
