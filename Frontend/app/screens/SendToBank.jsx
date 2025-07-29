import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';

const banks = [
  {
    name: 'Access Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/79/Access_Bank_logo.png',
  },
  {
    name: 'Zenith Bank',
    logo: 'https://seeklogo.com/images/Z/zenith-bank-plc-logo-FAF67F15CA-seeklogo.com.png',
  },
  {
    name: 'First Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f1/First_Bank_of_Nigeria_logo.png',
  },
  {
    name: 'UBA',
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/5f/United_Bank_for_Africa_logo.png',
  },
  {
    name: 'GCB',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/26/GCB_Bank_logo.png',
  },
  {
    name: 'GTBank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/70/GTBank_logo.png',
  },
  {
    name: 'Fidelity Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Fidelity_Bank_Nigeria_logo.png',
  },
  {
    name: 'Ecobank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Ecobank_logo.png',
  },
  {
    name: 'CBG',
    logo: 'https://www.cbghana.com/themes/custom/cbg/images/cbg_logo.png',
  },
  {
    name: 'Stanbic Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Stanbic_Bank_Logo.png',
  },
  {
    name: 'Union Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/44/Union_Bank_of_Nigeria_logo.png',
  },
  {
    name: 'Keystone Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/10/Keystone_Bank_logo.png',
  },
];

const SendToBankScreen = () => {
  const { sendOrWithdraw, balances } = useWallet();
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const validateForm = () => {
    if (!selectedBank) {
      Alert.alert('Error', 'Please select a bank');
      return false;
    }
    if (!accountNumber || accountNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid account number (minimum 10 digits)');
      return false;
    }
    if (!accountName.trim()) {
      Alert.alert('Error', 'Please enter the account holder name');
      return false;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    if (Number(amount) > balances.GHS) {
      Alert.alert('Insufficient funds', 'You do not have enough funds in your GHS wallet to send this amount.');
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);
      
      // Use the sendOrWithdraw function with proper parameters for transaction tracking
      sendOrWithdraw(Number(amount), 'Send', accountName);
      
      Alert.alert('Send Successful', `₵${amount} has been sent from your GHS wallet!`);
      router.push('/screens/HomeScreen');

    } catch (error) {
      Alert.alert('Error', 'Failed to send money: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backArrow}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#800080' }]}>
        Send Money to a Bank
      </Text>

      <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#800080' }]}>Choose Bank</Text>
      <FlatList
        data={banks}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.bankItem,
              selectedBank === item.name && styles.selectedBank,
            ]}
            onPress={() => setSelectedBank(item.name)}
          >
            <Image source={{ uri: item.logo }} style={styles.logo} />
            <Text style={{ color: selectedBank === item.name ? '#fff' : '#800080', marginLeft: 8 }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 20 }}
      />

      <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#800080' }]}>Account Number</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
            color: isDarkMode ? '#fff' : '#000',
          },
        ]}
        placeholder="Enter account number"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        keyboardType="numeric"
        value={accountNumber}
        onChangeText={setAccountNumber}
        maxLength={10}
      />

      <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#800080' }]}>Account Holder Name</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
            color: isDarkMode ? '#fff' : '#000',
          },
        ]}
        placeholder="Enter account holder name"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={accountName}
        onChangeText={setAccountName}
      />

      <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#800080' }]}>Amount</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
            color: isDarkMode ? '#fff' : '#000',
          },
        ]}
        placeholder="Enter amount"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={[
          styles.sendButton,
          {
            backgroundColor: selectedBank && accountNumber && accountName && amount && !processing ? '#800080' : '#ccc',
          },
        ]}
        onPress={handleSend}
        disabled={!selectedBank || !accountNumber || !accountName || !amount || processing}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
        <Text style={styles.sendText}>Send</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SendToBankScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backArrow: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#800080',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  selectedBank: {
    backgroundColor: '#800080',
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  sendButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
