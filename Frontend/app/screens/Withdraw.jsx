import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { getWithdrawMethods } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WithdrawScreen = () => {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const [withdrawMethods, setWithdrawMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadWithdrawMethods();
    // Clear any stored payment data that might cause verification errors
    clearStoredPaymentData();
  }, []);

  const clearStoredPaymentData = async () => {
    try {
      // Clear any stored payment data that might cause verification errors
      await AsyncStorage.removeItem('pendingPayment');
      await AsyncStorage.removeItem('pendingWithdrawal');
      console.log('Cleared stored payment data');
    } catch (error) {
      console.error('Error clearing stored payment data:', error);
    }
  };

  const loadWithdrawMethods = async () => {
    try {
      setLoading(true);
      console.log('Loading withdraw methods...');
      const response = await getWithdrawMethods();
      setWithdrawMethods(response.methods || []);
    } catch (error) {
      console.error('Error loading withdraw methods:', error);
      // Don't show alert for API errors, just use fallback methods
      setWithdrawMethods([]); // This will trigger the fallback options
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (method) => {
    try {
      setProcessing(true);

      if (method.id === 'mobile_money' || method.name?.toLowerCase().includes('mobile')) {
        // Navigate to mobile money provider selection
        router.push('/screens/MobileMoneyOptionsScreen');
        return;
      }

      if (method.id === 'bank' || method.name?.toLowerCase().includes('bank')) {
        // Navigate to bank withdrawal screen
        router.push('/screens/BankWithdraw');
        return;
      }

      // For other methods, show error
      Alert.alert('Error', 'Unsupported withdrawal method');
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Loading withdraw methods...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>Withdraw Funds</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Select a withdrawal option below.</Text>

      {/* Dynamic Withdraw Methods */}
      {withdrawMethods.length > 0 ? (
        withdrawMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
            onPress={() => handleWithdraw(method)}
            disabled={processing}
          >
            <Ionicons name={method.icon || 'wallet-outline'} size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>{method.name}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        ))
      ) : (
        // Fallback to default options if no methods from API
        <>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
            onPress={() => handleWithdraw({ id: 'mobile_money', name: 'Withdraw to Mobile Wallet' })}
            disabled={processing}
          >
            <Ionicons name="wallet-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>Withdraw to Mobile Wallet</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
            onPress={() => handleWithdraw({ id: 'bank', name: 'Withdraw to Bank' })}
            disabled={processing}
          >
            <Ionicons name="cash-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>Withdraw to Bank</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default WithdrawScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
  },
  optionText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
