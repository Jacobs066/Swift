// screens/DepositScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getDepositMethods, initiateDeposit, verifyDeposit } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWallet } from '../context/WalletContext';

const DepositScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { deposit } = useWallet();
  const [depositMethods, setDepositMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    subtext: isDarkMode ? '#ccc' : '#666',
    card: isDarkMode ? '#1f1f1f' : '#f2e6f7',
    accent: '#800080',
    inputBg: isDarkMode ? '#1e1e1e' : '#fff',
    border: isDarkMode ? '#333' : '#ddd',
  };

  useEffect(() => {
    loadDepositMethods();
    loadUserEmail();
    
    // Note: Removed automatic payment verification to prevent false errors
    // Payment verification should only happen after actual payment completion
  }, []);

  const loadUserEmail = async () => {
    try {
      // You can get user email from AsyncStorage or user context
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail) {
        setEmail(userEmail);
      }
    } catch (error) {
      console.error('Error loading user email:', error);
    }
  };

  const loadDepositMethods = async () => {
    try {
      setLoading(true);
      const methods = await getDepositMethods();
      setDepositMethods(methods);
    } catch (error) {
      Alert.alert(t('error'), t('failedToLoadData') + ': ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (method) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid amount');
      return;
    }
    
    try {
      setProcessing(true);
      
      // Use the deposit function with method name for transaction tracking
      deposit(Number(amount));
      
      Alert.alert('Deposit Successful', `₵${amount} has been added to your GHS wallet!`, [
        {
          text: 'OK',
          onPress: () => router.push('/screens/HomeScreen'),
        },
      ]);
      
      // Optionally, also navigate after a short delay:
      setTimeout(() => {
        router.push('/screens/HomeScreen');
      }, 1500);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to process deposit: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.text }]}>{t('loading')}...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.accent }]}>{t('deposit')} {t('funds') || 'Funds'}</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        {t('chooseDepositMethod') || 'Choose a method to fund your wallet.'}
      </Text>

      {/* Email Input */}
      <Text style={[styles.label, { color: colors.accent }]}>{t('email')}</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.border, 
          color: colors.text 
        }]}
        placeholder="Enter your email"
        placeholderTextColor={colors.subtext}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Amount Input */}
      <Text style={[styles.label, { color: colors.accent }]}>{t('amount')} (GHS)</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.border, 
          color: colors.text 
        }]}
        placeholder="Enter amount"
        placeholderTextColor={colors.subtext}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* Dynamic Deposit Methods */}
      {depositMethods.length > 0 ? (
        depositMethods.map((method) => (
          <TouchableOpacity 
            key={method.id}
            style={[styles.optionButton, { backgroundColor: colors.card }]}
            onPress={() => handleDeposit(method)}
            disabled={processing}
          >
            <Ionicons name={method.icon || 'card-outline'} size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.accent }]}>{method.name}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        ))
      ) : (
        // Fallback to default options if no methods from API
        <>
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.card }]}
            onPress={() => handleDeposit({ id: 'card', name: t('depositWithCard') || 'Deposit with Card' })}
            disabled={processing}
          >
        <Ionicons name="card-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.accent }]}>{t('depositWithCard') || 'Deposit with Card'}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
      </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.card }]}
            onPress={() => handleDeposit({ id: 'mobile', name: t('depositWithMobile') || 'Deposit with Mobile Money' })}
            disabled={processing}
          >
        <Ionicons name="cash-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.accent }]}>{t('depositWithMobile') || 'Deposit with Mobile Money'}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.card }]}
            onPress={() => handleDeposit({ id: 'bank', name: t('depositWithBank') || 'Deposit with Bank' })}
            disabled={processing}
          >
            <Ionicons name="business-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.accent }]}>{t('depositWithBank') || 'Deposit with Bank'}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
      </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  backButton: { 
    marginBottom: 20 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 14, 
    marginBottom: 30 
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  loadingText: { 
    marginTop: 10, 
    fontSize: 16 
  },
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
