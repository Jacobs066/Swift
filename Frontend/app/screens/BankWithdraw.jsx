import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { initiateWithdraw } from '../api';

const BankWithdrawScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleWithdraw = async () => {
    // Client-side validation
    if (!fullName.trim()) {
      Alert.alert(t('error'), t('fullNameRequired') || 'Full name is required');
      return;
    }
    if (!bankName.trim()) {
      Alert.alert(t('error'), t('bankNameRequired') || 'Bank name is required');
      return;
    }
    if (!accountNumber.trim()) {
      Alert.alert(t('error'), t('accountNumberRequired') || 'Account number is required');
      return;
    }
    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert(t('error'), t('enterValidAmount') || 'Please enter a valid amount');
      return;
    }
    if (!reference.trim()) {
      Alert.alert(t('error'), t('referenceRequired') || 'Reference is required');
      return;
    }

    try {
      setProcessing(true);
      
      const withdrawData = {
        method: 'bank_transfer',
        amount: parseFloat(amount),
        recipientDetails: {
          fullName: fullName.trim(),
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          reference: reference.trim()
        }
      };

      await initiateWithdraw('bank_transfer', parseFloat(amount), withdrawData.recipientDetails);
      
      Alert.alert(
        t('success'), 
        t('bankWithdrawalInitiatedSuccess') || `₵${amount} withdrawal request sent to ${bankName} (${accountNumber})`,
        [{ text: t('continue'), onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(t('error'), t('bankWithdrawalFailed') || 'Failed to initiate bank withdrawal: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#800080' : '#800080'} />
      </TouchableOpacity>

      <Text style={styles.title}>{t('withdrawToBankAccount') || 'Withdraw to Bank Account'}</Text>

      <Text style={styles.label}>{t('fullName') || 'Full Name'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('fullNamePlaceholder') || "John Doe"}
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={fullName}
        onChangeText={setFullName}
        editable={!processing}
      />

      <Text style={styles.label}>{t('bankName') || 'Bank Name'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('bankNamePlaceholder') || "Absa, Stanbic, etc."}
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={bankName}
        onChangeText={setBankName}
        editable={!processing}
      />

      <Text style={styles.label}>{t('accountNumber') || 'Account Number'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('accountNumberPlaceholder') || "0123456789"}
        keyboardType="numeric"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={accountNumber}
        onChangeText={setAccountNumber}
        editable={!processing}
      />

      <Text style={styles.label}>{t('amount') || 'Amount (GHS)'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('amountPlaceholder') || "200.00"}
        keyboardType="numeric"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={amount}
        onChangeText={setAmount}
        editable={!processing}
      />

      <Text style={styles.label}>{t('reference') || 'Reference'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('referencePlaceholder') || "Withdrawal for savings"}
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={reference}
        onChangeText={setReference}
        editable={!processing}
      />

      <TouchableOpacity 
        style={[styles.button, processing && styles.buttonDisabled]} 
        onPress={handleWithdraw}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t('withdraw') || 'Withdraw'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BankWithdrawScreen;

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
      padding: 20,
    },
    backButton: {
      marginBottom: 15,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#800080',
      marginBottom: 25,
    },
    label: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#800080',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1.5,
      borderColor: '#800080',
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#1e1e1e' : '#fdfdfd',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#800080',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonDisabled: {
      backgroundColor: '#666',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
