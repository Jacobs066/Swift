import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const MobileWalletWithdrawScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const { withdraw, balances } = useWallet();

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

    if (Number(amount) > balances.GHS) {
      Alert.alert(t('error'), t('insufficientFunds') || 'Insufficient funds in your GHS wallet.');
      return;
    }

    try {
      setProcessing(true);

      const response = await withdraw(parseFloat(amount), 'mobile_money', {
        fullName: fullName.trim(),
        accountNumber: phoneNumber.trim(),
        bankCode: provider,
      });

      if (!response.success) {
        Alert.alert(t('error'), response.message || t('withdrawalFailed') || 'Failed to initiate withdrawal');
        return;
      }

      Alert.alert(
        t('withdrawalSuccessful'),
        `${t('withdrawalSuccessfulMessage')} ₵${amount} has been withdrawn from your GHS wallet!`,
        [
          {
            text: t('ok'),
            onPress: () => {
              // Navigate back to home screen
              router.push('/screens/HomeScreen');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('error'), t('withdrawalFailed') || 'Failed to initiate withdrawal: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={styles.title}>{t('withdrawToMobileWallet') || 'Withdraw to Mobile Wallet'}</Text>

      {/* Provider Info */}
      <View style={styles.providerInfo}>
        <Text style={styles.providerLabel}>{t('selectedProvider') || 'Selected Provider:'}</Text>
        <Text style={styles.providerName}>{providerName}</Text>
      </View>

      <TextInput
        label={t('fullName') || 'Full Name'}
        placeholder="John Doe"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        label={t('phoneNumber') || 'Phone Number'}
        placeholder="+233501234567"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        label={`${t('amount')} (GHS)`}
        placeholder="100.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        label={t('reference') || 'Reference'}
        placeholder={t('withdrawalReference') || "Withdrawal for school fees"}
        value={reference}
        onChangeText={setReference}
      />

      <Button
        title={t('withdraw') || 'Withdraw'}
        onPress={handleWithdraw}
        loading={processing}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
};

export default MobileWalletWithdrawScreen;

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    backButton: {
      marginBottom: 15,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.accent,
      marginBottom: 25,
    },
    providerInfo: {
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    providerLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 5,
    },
    providerName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.accent,
    },
  });
