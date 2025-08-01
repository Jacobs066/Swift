import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
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
import { getTransferRates, performInterwalletTransfer } from '../utils/api';
import { useWallet } from '../context/WalletContext';

const wallets = ['GHS', 'USD', 'EUR', 'GBP'];

const ConvertScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
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
      const rates = await getTransferRates();
      setTransferRates(rates);
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

  const customRates = {
    USD: { GHS: 10.8 },
    EUR: { GHS: 18.5 },
    GBP: { GHS: 15 },
    GHS: { USD: 1 / 10.8, EUR: 1 / 18.5, GBP: 1 / 15 },
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
      
      // Use the new transfer function (exchange rate is calculated internally)
      transfer(fromWallet, toWallet, Number(amount));
      
      Alert.alert('Transfer Successful', `${amount} ${fromWallet} transferred to ${toWallet}!`, [
        {
          text: 'OK',
          onPress: () => router.push('/screens/HomeScreen'),
        },
      ]);
      setTimeout(() => {
        router.push('/screens/HomeScreen');
      }, 1500);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to process transfer: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const cardColor = isDarkMode ? '#1e1e1e' : '#f2f2f2';

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#800080" />
        <Text style={[styles.loadingText, { color: textColor }]}>Loading transfer rates...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back-circle" size={24} color="#800080" />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor}]}>Intertransfer Wallet</Text>

        {/* Wallet Selector */}
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.label, { color: textColor }]}>From:</Text>
          <View style={styles.row}>
            {wallets.map((wallet) =>
              wallet !== toWallet ? (
                <TouchableOpacity
                  key={wallet}
                  style={[
                    styles.walletBtn,
                    fromWallet === wallet && styles.selected,
                  ]}
                  onPress={() => setFromWallet(wallet)}
                >
                  <Text style={styles.walletText}>{wallet}</Text>
                </TouchableOpacity>
              ) : null
            )}
          </View>

          <Text style={[styles.label, { color: textColor, marginTop: 16 }]}>To:</Text>
          <View style={styles.row}>
            {wallets.map((wallet) =>
              wallet !== fromWallet ? (
                <TouchableOpacity
                  key={wallet}
                  style={[
                    styles.walletBtn,
                    toWallet === wallet && styles.selected,
                  ]}
                  onPress={() => setToWallet(wallet)}
                >
                  <Text style={styles.walletText}>{wallet}</Text>
                </TouchableOpacity>
              ) : null
            )}
          </View>

          {/* Amount input */}
          <TextInput
            placeholder="Enter amount"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={[styles.input, { color: textColor, borderColor: textColor }]}
          />

          {/* Convert Button */}
          <TouchableOpacity style={styles.convertBtn} onPress={handleConvert}>
            <Text style={styles.convertText}>Convert</Text>
          </TouchableOpacity>

          {/* Result */}
          {converted && (
            <Text style={[styles.resultText, { color: textColor }]}>
              {amount} {fromWallet} = {converted} {toWallet}
            </Text>
          )}

          {/* Transfer Button */}
          {converted && (
            <TouchableOpacity 
              style={[styles.transferBtn, processing && styles.disabledBtn]} 
              onPress={handleTransfer}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.transferText}>Transfer</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
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
  card: {
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
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
    backgroundColor: '#80008020',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#800080',
  },
  walletText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderBottomWidth: 1,
    marginTop: 20,
    fontSize: 16,
    paddingVertical: 8,
  },
  convertBtn: {
    backgroundColor: '#800080',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  convertText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  transferBtn: {
    backgroundColor: '#009900',
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#666',
  },
  transferText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ConvertScreen;
