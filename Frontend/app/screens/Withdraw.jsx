import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { getWithdrawMethods, initiateWithdraw } from '../api';

const WithdrawScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [withdrawMethods, setWithdrawMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    loadWithdrawMethods();
  }, []);

  const loadWithdrawMethods = async () => {
    try {
      setLoading(true);
      const methods = await getWithdrawMethods();
      setWithdrawMethods(methods);
    } catch (error) {
      Alert.alert('Error', 'Failed to load withdraw methods: ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (method) => {
    try {
      setProcessing(true);
      
      if (method.id === 'mobile' || method.name?.toLowerCase().includes('mobile')) {
        // Navigate to mobile money provider selection
        router.push('/screens/MobileMoneyOptionsScreen');
        return;
      }
      
      if (method.id === 'bank' || method.name?.toLowerCase().includes('bank')) {
        // Navigate to bank withdrawal screen
        router.push('/screens/BankWithdraw');
        return;
      }
      
      const result = await initiateWithdraw(method.id, 50, {}); // Default amount, you can add amount input
      Alert.alert('Success', 'Withdrawal initiated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate withdrawal: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#800080" />
        <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>Loading withdraw methods...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color="#800080" />
      </TouchableOpacity>

      <Text style={styles.title}>Withdraw Funds</Text>
      <Text style={styles.subtitle}>Select a withdrawal option below.</Text>

      {/* Dynamic Withdraw Methods */}
      {withdrawMethods.length > 0 ? (
        withdrawMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.optionButton}
            onPress={() => handleWithdraw(method)}
            disabled={processing}
          >
            <Ionicons name={method.icon || 'wallet-outline'} size={22} color="#800080" style={{ marginRight: 10 }} />
            <Text style={styles.optionText}>{method.name}</Text>
            {processing && <ActivityIndicator size="small" color="#800080" style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        ))
      ) : (
        // Fallback to default options if no methods from API
        <>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleWithdraw({ id: 'mobile', name: 'Withdraw to Mobile Wallet' })}
            disabled={processing}
          >
            <Ionicons name="wallet-outline" size={22} color="#800080" style={{ marginRight: 10 }} />
            <Text style={styles.optionText}>Withdraw to Mobile Wallet</Text>
            {processing && <ActivityIndicator size="small" color="#800080" style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleWithdraw({ id: 'bank', name: 'Withdraw to Bank' })}
            disabled={processing}
          >
            <Ionicons name="cash-outline" size={22} color="#800080" style={{ marginRight: 10 }} />
            <Text style={styles.optionText}>Withdraw to Bank</Text>
            {processing && <ActivityIndicator size="small" color="#800080" style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        </>
      )}
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
    loadingText: {
      marginTop: 10,
      fontSize: 16,
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

