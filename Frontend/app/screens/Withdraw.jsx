import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // 🌙 Dark mode hook

const WithdrawScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color="#800080" />
      </TouchableOpacity>

      <Text style={styles.title}>Withdraw Funds</Text>
      <Text style={styles.subtitle}>Select a withdrawal option below.</Text>

      {/* ✅ Mobile Wallet */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push('/screens/MobileWallet')}
      >
        <Ionicons name="wallet-outline" size={22} color="#800080" style={{ marginRight: 10 }} />
        <Text style={styles.optionText}>Withdraw to Mobile Wallet</Text>
      </TouchableOpacity>

      {/* ✅ Bank Withdraw */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push('/screens/BankWithdraw')}
      >
        <Ionicons name="cash-outline" size={22} color="#800080" style={{ marginRight: 10 }} />
        <Text style={styles.optionText}>Withdraw to Bank</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WithdrawScreen;

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#fff',
    },
    backButton: {
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#800080',
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? '#aaa' : '#666',
      marginBottom: 30,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1e1e1e' : '#f2e6f7',
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
    },
    optionText: {
      color: '#800080',
      fontWeight: '600',
      fontSize: 16,
    },
  });

