import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // Custom theme hook

const BankWithdrawScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [fullName, setFullName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');

  const handleWithdraw = () => {
    if (!fullName || !bankName || !accountNumber || !amount || !reference) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    // Trigger backend/API call here
    Alert.alert('Success', `₵${amount} withdrawal request sent to ${bankName} (${accountNumber})`);
    router.back();
  };

  const styles = getStyles(isDarkMode);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#800080' : '#800080'} />
      </TouchableOpacity>

      <Text style={styles.title}>Withdraw to Bank Account</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Bank Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Absa, Stanbic, etc."
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={bankName}
        onChangeText={setBankName}
      />

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        placeholder="0123456789"
        keyboardType="numeric"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={accountNumber}
        onChangeText={setAccountNumber}
      />

      <Text style={styles.label}>Amount (GHS)</Text>
      <TextInput
        style={styles.input}
        placeholder="200.00"
        keyboardType="numeric"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Reference</Text>
      <TextInput
        style={styles.input}
        placeholder="Withdrawal for savings"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={reference}
        onChangeText={setReference}
      />

      <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
        <Text style={styles.buttonText}>Withdraw</Text>
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
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
