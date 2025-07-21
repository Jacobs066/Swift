// screens/DepositScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const DepositScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    subtext: isDarkMode ? '#ccc' : '#666',
    card: isDarkMode ? '#1f1f1f' : '#f2e6f7',
    accent: '#800080',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.accent }]}>Deposit Funds</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        Choose a method to fund your wallet.
      </Text>

      {/* Option Buttons */}
      <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]}>
        <Ionicons name="card-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
        <Text style={[styles.optionText, { color: colors.accent }]}>Deposit with Card</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.card }]}>
        <Ionicons name="cash-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
        <Text style={[styles.optionText, { color: colors.accent }]}>Deposit with MobileWallet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 30 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  optionText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default DepositScreen;
