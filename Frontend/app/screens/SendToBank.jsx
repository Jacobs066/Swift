import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

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
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleSend = () => {
    if (selectedBank && accountNumber && amount) {
      router.push('/screens/SendSuccess');
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
            backgroundColor: selectedBank && accountNumber && amount ? '#800080' : '#ccc',
          },
        ]}
        onPress={handleSend}
        disabled={!selectedBank || !accountNumber || !amount}
      >
        <Text style={styles.sendText}>Send</Text>
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
