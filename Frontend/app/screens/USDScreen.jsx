import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { getTransferRates, initiateTransfer } from '../api';

const toWallets = ['GHS', 'EUR', 'GBP'];

const ConvertFromUSDScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [toWallet, setToWallet] = useState('GHS');
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
        USD: { GHS: 11.50, EUR: 0.91, GBP: 0.77 },
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
    const rate = transferRates['USD']?.[toWallet] || 1;
    const result = (parseFloat(amount) * rate).toFixed(2);
    setConverted(result);
  };

  const handleTransfer = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!converted) {
      Alert.alert('Error', 'Please convert the amount first');
      return;
    }

    try {
      setProcessing(true);
      const result = await initiateTransfer('USD', toWallet, parseFloat(amount));
      Alert.alert('Success', 'Transfer initiated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate transfer: ' + error.toString());
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
    <KeyboardAvoidingView style={[styles.container, { backgroundColor }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back-circle" size={24} color="#800080" />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]}>Transfer from USD</Text>

        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.label, { color: textColor }]}>To:</Text>
          <View style={styles.row}>
            {toWallets.map((wallet) => (
              <TouchableOpacity
                key={wallet}
                style={[styles.walletBtn, toWallet === wallet && styles.selected]}
                onPress={() => setToWallet(wallet)}
              >
                <Text style={styles.walletText}>{wallet}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Enter amount"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={[styles.input, { color: textColor, borderColor: textColor }]}
          />

          <TouchableOpacity style={styles.convertBtn} onPress={handleConvert}>
            <Text style={styles.convertText}>Convert</Text>
          </TouchableOpacity>

          {converted && (
            <Text style={[styles.resultText, { color: textColor }]}>
              {amount} USD = {converted} {toWallet}
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  back: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  loadingText: { marginTop: 10, fontSize: 16 },
  card: {
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
      android: { elevation: 4 },
    }),
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  walletBtn: {
    backgroundColor: '#80008020',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selected: { backgroundColor: '#800080' },
  walletText: { color: '#fff', fontWeight: '600' },
  input: { borderBottomWidth: 1, marginTop: 20, fontSize: 16, paddingVertical: 8 },
  convertBtn: {
    backgroundColor: '#800080',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  convertText: { color: '#fff', fontWeight: 'bold' },
  resultText: { marginTop: 20, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
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

export default ConvertFromUSDScreen;
