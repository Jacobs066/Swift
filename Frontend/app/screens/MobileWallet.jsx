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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { initiateWithdraw } from '../api';

const MobileWalletWithdrawScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const { isDarkMode } = useTheme();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [processing, setProcessing] = useState(false);

  // Get provider info from navigation params
  const provider = params.provider || 'MTN';
  const providerName = params.providerName || 'MTN Mobile Money';

  const handleWithdraw = async () => {
    if (!fullName || !phoneNumber || !amount || !reference) {
      Alert.alert(t('error'), t('allFieldsRequired') || 'All fields are required');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert(t('error'), t('enterValidAmount') || 'Please enter a valid amount');
      return;
    }

    try {
      setProcessing(true);
      
      const withdrawData = {
        method: 'mobile_money',
        provider: provider,
        amount: parseFloat(amount),
        recipientDetails: {
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          reference: reference.trim(),
          provider: providerName
        }
      };

      await initiateWithdraw('mobile_money', parseFloat(amount), withdrawData.recipientDetails);
      
      Alert.alert(
        t('success'), 
        t('withdrawalInitiatedSuccess') || `₵${amount} withdrawal request sent to ${phoneNumber}`,
        [
          { 
            text: t('continue'), 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('error'), t('withdrawalFailed') || 'Failed to initiate withdrawal: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#800080' : '#800080'} />
      </TouchableOpacity>

      <Text style={styles.title}>{t('withdrawToMobileWallet') || 'Withdraw to Mobile Wallet'}</Text>
      
      {/* Provider Info */}
      <View style={styles.providerInfo}>
        <Text style={styles.providerLabel}>{t('selectedProvider') || 'Selected Provider:'}</Text>
        <Text style={styles.providerName}>{providerName}</Text>
      </View>

      <Text style={styles.label}>{t('fullName') || 'Full Name'}</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>{t('phoneNumber') || 'Phone Number'}</Text>
      <TextInput
        style={styles.input}
        placeholder="+233501234567"
        keyboardType="phone-pad"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Text style={styles.label}>{t('amount')} (GHS)</Text>
      <TextInput
        style={styles.input}
        placeholder="100.00"
        keyboardType="numeric"
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>{t('reference') || 'Reference'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('withdrawalReference') || "Withdrawal for school fees"}
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        value={reference}
        onChangeText={setReference}
      />

      <TouchableOpacity 
        style={[styles.button, processing && styles.disabledButton]} 
        onPress={handleWithdraw}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t('withdraw') || 'Withdraw'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MobileWalletWithdrawScreen;

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
    providerInfo: {
      backgroundColor: isDark ? '#1e1e1e' : '#f2e6f7',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    providerLabel: {
      fontSize: 12,
      color: isDark ? '#ccc' : '#666',
      marginBottom: 5,
    },
    providerName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#800080',
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
    disabledButton: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
