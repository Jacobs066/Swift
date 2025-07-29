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
import { useWallet } from '../context/WalletContext';
import { Linking } from 'react-native';

const BankWithdrawScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { sendOrWithdraw, balances } = useWallet();

  const [fullName, setFullName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid amount');
      return;
    }
    if (Number(amount) > balances.GHS) {
      Alert.alert('Insufficient funds');
      return;
    }
    
    try {
      setProcessing(true);
      
      // Use the sendOrWithdraw function with proper parameters for transaction tracking
      sendOrWithdraw(Number(amount), 'Withdraw');
      
      Alert.alert('Withdrawal Successful', `₵${amount} has been withdrawn from your GHS wallet!`);
      router.push('/screens/HomeScreen');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    subtext: isDarkMode ? '#ccc' : '#666',
    inputBg: isDarkMode ? '#1e1e1e' : '#fff',
    border: isDarkMode ? '#333' : '#ddd',
    accent: '#800080',
    placeholder: isDarkMode ? '#aaa' : '#999',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.accent }]}>Bank Withdrawal</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        Enter your bank details to receive the withdrawal.
      </Text>

      <Text style={[styles.label, { color: colors.accent }]}>Full Name</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.border, 
          color: colors.text 
        }]}
        placeholder="John Doe"
        placeholderTextColor={colors.placeholder}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={[styles.label, { color: colors.accent }]}>Bank Name</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.border, 
          color: colors.text 
        }]}
        placeholder="e.g., GCB Bank"
        placeholderTextColor={colors.placeholder}
        value={bankName}
        onChangeText={setBankName}
      />

      <Text style={[styles.label, { color: colors.accent }]}>Account Number</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.border, 
          color: colors.text 
        }]}
        placeholder="1234567890"
        placeholderTextColor={colors.placeholder}
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: colors.accent }]}>Account Name</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.border, 
          color: colors.text 
        }]}
        placeholder="Account holder name"
        placeholderTextColor={colors.placeholder}
        value={accountName}
        onChangeText={setAccountName}
      />

      <Text style={[styles.label, { color: colors.accent }]}>Amount (GHS)</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.border, 
          color: colors.text 
        }]}
        placeholder="Enter amount"
        placeholderTextColor={colors.placeholder}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: colors.accent }]}>Reference/Reason</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBg, 
          borderColor: colors.border, 
          color: colors.text 
        }]}
        placeholder="e.g., Salary withdrawal"
        placeholderTextColor={colors.placeholder}
        value={reference}
        onChangeText={setReference}
      />

      <TouchableOpacity
        style={[styles.withdrawButton, { backgroundColor: colors.accent }, processing && styles.disabledButton]}
        onPress={handleWithdraw}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.withdrawButtonText}>Withdraw to Bank</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  withdrawButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default BankWithdrawScreen;
