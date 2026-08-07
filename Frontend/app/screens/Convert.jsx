import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { getTransferRates } from '../utils/api';
import { useWallet } from '../context/WalletContext';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Card from '../components/Card';

const wallets = ['GHS', 'USD', 'EUR', 'GBP'];

const ConvertScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { transfer, balances } = useWallet();

  const [fromWallet, setFromWallet] = useState('GHS');
  const [toWallet, setToWallet] = useState('USD');
  const [amount, setAmount] = useState('');
  const [converted, setConverted] = useState(null);
  const [transferRates, setTransferRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadTransferRates();
  }, []);

  const loadTransferRates = async () => {
    try {
      setLoading(true);
      const response = await getTransferRates();
      const nested = {};
      (response.rates || []).forEach((r) => {
        if (!nested[r.fromCurrency]) nested[r.fromCurrency] = {};
        nested[r.fromCurrency][r.toCurrency] = r.rate;
      });
      setTransferRates(nested);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transfer rates: ' + error.toString());
      // Fallback to hardcoded rates if API fails
      setTransferRates({
        GHS: { USD: 0.086, EUR: 0.078, GBP: 0.066 },
        USD: { GHS: 11.63, EUR: 0.91, GBP: 0.77 },
        EUR: { GHS: 12.80, USD: 1.10, GBP: 0.85 },
        GBP: { GHS: 15.13, USD: 1.30, EUR: 1.17 },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    const rate = transferRates[fromWallet]?.[toWallet] || 1;
    const result = (parseFloat(amount) * rate).toFixed(2);
    setConverted(result);
  };

  const handleTransfer = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid amount');
      return;
    }
    if (Number(amount) > balances[fromWallet]) {
      Alert.alert('Insufficient funds');
      return;
    }

    try {
      setProcessing(true);

      const response = await transfer(fromWallet, toWallet, Number(amount));

      if (response.success) {
        Alert.alert('Transfer Successful', `${amount} ${fromWallet} transferred to ${toWallet}!`, [
          { text: 'OK', onPress: () => router.push('/screens/HomeScreen') },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to process transfer');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process transfer: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Loading transfer rates...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Intertransfer Wallet</Text>

        {/* Wallet Selector */}
        <Card>
          <Text style={[styles.label, { color: colors.textPrimary }]}>From:</Text>
          <View style={styles.row}>
            {wallets.map((wallet) =>
              wallet !== toWallet ? (
                <TouchableOpacity
                  key={wallet}
                  style={[
                    styles.walletBtn,
                    { backgroundColor: colors.border },
                    fromWallet === wallet && { backgroundColor: colors.accent },
                  ]}
                  onPress={() => setFromWallet(wallet)}
                >
                  <Text style={[styles.walletText, { color: fromWallet === wallet ? colors.accentText : colors.textPrimary }]}>{wallet}</Text>
                </TouchableOpacity>
              ) : null
            )}
          </View>

          <Text style={[styles.label, { color: colors.textPrimary, marginTop: 16 }]}>To:</Text>
          <View style={styles.row}>
            {wallets.map((wallet) =>
              wallet !== fromWallet ? (
                <TouchableOpacity
                  key={wallet}
                  style={[
                    styles.walletBtn,
                    { backgroundColor: colors.border },
                    toWallet === wallet && { backgroundColor: colors.accent },
                  ]}
                  onPress={() => setToWallet(wallet)}
                >
                  <Text style={[styles.walletText, { color: toWallet === wallet ? colors.accentText : colors.textPrimary }]}>{wallet}</Text>
                </TouchableOpacity>
              ) : null
            )}
          </View>

          {/* Amount input */}
          <TextInput
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          {/* Convert Button */}
          <Button title="Convert" onPress={handleConvert} style={{ marginTop: 24 }} />

          {/* Result */}
          {converted && (
            <Text style={[styles.resultText, { color: colors.textPrimary }]}>
              {amount} {fromWallet} = {converted} {toWallet}
            </Text>
          )}

          {/* Transfer Button */}
          {converted && (
            <Button
              title="Transfer"
              onPress={handleTransfer}
              loading={processing}
              style={[{ backgroundColor: colors.success }, { marginTop: 16 }]}
            />
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  back: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  walletBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  walletText: {
    fontWeight: '600',
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ConvertScreen;
