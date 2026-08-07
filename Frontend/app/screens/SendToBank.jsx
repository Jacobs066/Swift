import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import { getBanks } from '../utils/api';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

const SendToBankScreen = () => {
  const { send, balances } = useWallet();
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const loadBanks = async () => {
      try {
        setLoadingBanks(true);
        const response = await getBanks('bank');
        setBanks(response.banks || []);
      } finally {
        setLoadingBanks(false);
      }
    };
    loadBanks();
  }, []);

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

      const response = await send(Number(amount), 'bank', {
        fullName: accountName,
        accountNumber,
        bankCode: selectedBank.code,
      });

      if (response.success) {
        router.push({
          pathname: '/screens/SendSuccess',
          params: {
            amount: `GHS ${amount}`,
            recipient: accountName,
            method: selectedBank.name,
            reference: response.paystackResponse?.data?.reference || '',
          },
        });
      } else {
        Alert.alert('Error', response.message || 'Failed to send money');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send money: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backArrow}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Send Money to a Bank
      </Text>

      <Text style={[styles.label, { color: colors.textMuted }]}>Choose Bank</Text>
      {loadingBanks ? (
        <ActivityIndicator size="small" color={colors.accent} style={{ marginBottom: 20 }} />
      ) : (
        <FlatList
          data={banks}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.bankItem,
                { borderColor: colors.border, backgroundColor: colors.surface },
                selectedBank?.code === item.code && { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}
              onPress={() => setSelectedBank(item)}
            >
              <Ionicons
                name="business-outline"
                size={18}
                color={selectedBank?.code === item.code ? colors.accentText : colors.accent}
              />
              <Text style={{ color: selectedBank?.code === item.code ? colors.accentText : colors.textPrimary, marginLeft: 8 }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 20 }}
        />
      )}

      <TextInput
        label="Account Number"
        placeholder="Enter account number"
        keyboardType="numeric"
        value={accountNumber}
        onChangeText={setAccountNumber}
        maxLength={10}
      />

      <TextInput
        label="Account Holder Name"
        placeholder="Enter account holder name"
        value={accountName}
        onChangeText={setAccountName}
      />

      <TextInput
        label="Amount"
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Button
        title="Send"
        onPress={handleSend}
        loading={processing}
        disabled={!selectedBank || !accountNumber || !accountName || !amount}
        style={{ marginTop: 10 }}
      />
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
    marginRight: 10,
  },
});
