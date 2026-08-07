import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

const SendToMobileWalletScreen = () => {
  const { send, balances } = useWallet();
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [walletNumber, setWalletNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoadingProviders(true);
        const response = await getBanks('mobile_money');
        setProviders(response.banks || []);
      } finally {
        setLoadingProviders(false);
      }
    };
    loadProviders();
  }, []);

  const validateForm = () => {
    if (!selectedProvider) {
      Alert.alert('Error', 'Please select a mobile network');
      return false;
    }
    if (!walletNumber || walletNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid wallet number (minimum 10 digits)');
      return false;
    }
    if (!recipientName.trim()) {
      Alert.alert('Error', 'Please enter the recipient name');
      return false;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    if (Number(amount) > balances.GHS) {
      Alert.alert('Insufficient funds');
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);

      const response = await send(Number(amount), 'mobile_money', {
        fullName: recipientName,
        accountNumber: walletNumber,
        bankCode: selectedProvider.code,
      });

      if (response.success) {
        router.push({
          pathname: '/screens/SendSuccess',
          params: {
            amount: `GHS ${amount}`,
            recipient: recipientName,
            method: selectedProvider.name,
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
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={36} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Send to Mobile Wallet
      </Text>

      <Text style={[styles.label, { color: colors.textMuted }]}>
        Choose Mobile Network
      </Text>

      {loadingProviders ? (
        <ActivityIndicator size="small" color={colors.accent} style={{ marginBottom: 20 }} />
      ) : (
        <View style={styles.walletRow}>
          {providers.map((provider) => (
            <TouchableOpacity
              key={provider.code}
              style={[
                styles.walletCard,
                { borderColor: colors.border, backgroundColor: colors.surface },
                selectedProvider?.code === provider.code && { backgroundColor: colors.accent, borderColor: colors.accent }
              ]}
              onPress={() => setSelectedProvider(provider)}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color={selectedProvider?.code === provider.code ? colors.accentText : colors.accent}
                style={{ marginBottom: 6 }}
              />
              <Text
                style={[
                  styles.walletText,
                  { color: selectedProvider?.code === provider.code ? colors.accentText : colors.textPrimary }
                ]}
              >
                {provider.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TextInput
        label="Wallet Number"
        placeholder="Enter wallet number"
        keyboardType="numeric"
        value={walletNumber}
        onChangeText={setWalletNumber}
        maxLength={10}
      />

      <TextInput
        label="Recipient Name"
        placeholder="Enter recipient name"
        value={recipientName}
        onChangeText={setRecipientName}
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
        disabled={!selectedProvider || !walletNumber || !recipientName || !amount}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

export default SendToMobileWalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 60,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 6
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  walletCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: 100
  },
  walletText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600'
  },
});
