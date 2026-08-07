import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, onBack, rightAction }) => {
  const router = useRouter();
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.row, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
      <TouchableOpacity onPress={onBack || (() => router.back())} style={styles.side}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text style={[typography.subtitle, styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 32,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});

export default Header;
