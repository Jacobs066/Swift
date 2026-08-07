import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../context/WalletContext';
import { getBanks } from '../utils/api';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

const BankWithdrawScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { withdraw, balances } = useWallet();

  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [fullName, setFullName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [processing, setProcessing] = useState(false);

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

  const handleWithdraw = async () => {
    if (!selectedBank) {
      Alert.alert('Error', 'Please select a bank');
      return;
    }
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

      const response = await withdraw(Number(amount), 'bank', {
        fullName,
        accountNumber,
        bankCode: selectedBank.code,
        reason: reference,
      });

      if (response.success) {
        Alert.alert('Withdrawal Successful', `₵${amount} has been withdrawn from your GHS wallet!`, [
          { text: 'OK', onPress: () => router.push('/screens/HomeScreen') },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>Bank Withdrawal</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Enter your bank details to receive the withdrawal.
      </Text>

      <TextInput
        label="Full Name"
        placeholder="John Doe"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={[styles.label, { color: colors.textMuted }]}>Bank</Text>
      {loadingBanks ? (
        <ActivityIndicator size="small" color={colors.accent} style={{ marginBottom: 16 }} />
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
          contentContainerStyle={{ marginBottom: 16 }}
        />
      )}

      <TextInput
        label="Account Number"
        placeholder="1234567890"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
      />

      <TextInput
        label="Account Name"
        placeholder="Account holder name"
        value={accountName}
        onChangeText={setAccountName}
      />

      <TextInput
        label="Amount (GHS)"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInput
        label="Reference/Reason"
        placeholder="e.g., Salary withdrawal"
        value={reference}
        onChangeText={setReference}
      />

      <Button
        title="Withdraw to Bank"
        onPress={handleWithdraw}
        loading={processing}
        disabled={!selectedBank || !accountNumber || !amount}
        style={{ marginTop: 24 }}
      />
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
    fontSize: 14,
    fontWeight: '600',
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

export default BankWithdrawScreen;
