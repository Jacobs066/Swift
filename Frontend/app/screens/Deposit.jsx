// screens/DepositScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getDepositMethods, initiateDeposit, verifyDeposit } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const DepositScreen = () => {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { refreshBalances } = useWallet();
  const [depositMethods, setDepositMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [pendingReference, setPendingReference] = useState(null);

  useEffect(() => {
    loadDepositMethods();
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const loadDepositMethods = async () => {
    try {
      setLoading(true);
      const response = await getDepositMethods();
      setDepositMethods(response.methods || []);
    } catch (error) {
      Alert.alert(t('error'), t('failedToLoadData') + ': ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  // Step 1: initialize a Paystack checkout and send the user there to pay.
  const handleDeposit = async (method) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid amount');
      return;
    }
    if (!email) {
      Alert.alert('Email required', 'Please enter the email to use for this payment.');
      return;
    }

    try {
      setProcessing(true);
      const reference = `DEP_${Date.now()}`;
      const response = await initiateDeposit(method.id, Number(amount), { email, reference });
      const authorizationUrl = response?.paystackResponse?.data?.authorization_url;

      if (!authorizationUrl) {
        Alert.alert('Error', 'Could not start payment. Please try again.');
        return;
      }

      setPendingReference(reference);
      await Linking.openURL(authorizationUrl);
    } catch (error) {
      Alert.alert('Error', 'Failed to start deposit: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  // Step 2: once the user has completed payment in the browser, confirm it -
  // the wallet is only credited if Paystack actually verifies the payment.
  const handleConfirmPayment = async () => {
    if (!pendingReference) return;
    try {
      setProcessing(true);
      const result = await verifyDeposit(pendingReference, Number(amount));
      if (result.success) {
        await refreshBalances();
        setPendingReference(null);
        setAmount('');
        Alert.alert('Deposit Successful', `Your wallet has been credited. New balance: ${result.newBalance}`, [
          { text: 'OK', onPress: () => router.push('/screens/HomeScreen') },
        ]);
      } else {
        Alert.alert('Payment not confirmed', result.message || 'Please complete payment before confirming.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify deposit: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>{t('loading')}...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{t('deposit')} {t('funds') || 'Funds'}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {t('chooseDepositMethod') || 'Choose a method to fund your wallet.'}
      </Text>

      {/* Email Input */}
      <TextInput
        label={t('email')}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Amount Input */}
      <TextInput
        label={`${t('amount')} (GHS)`}
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {pendingReference ? (
        <View style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, flexDirection: 'column', alignItems: 'stretch' }]}>
          <Text style={[styles.optionText, { color: colors.textPrimary, marginBottom: 10 }]}>
            Complete your payment in the browser, then confirm it below.
          </Text>
          <Button title="I've completed payment" onPress={handleConfirmPayment} loading={processing} />
        </View>
      ) : null}

      {/* Dynamic Deposit Methods */}
      {depositMethods.length > 0 ? (
        depositMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
            onPress={() => handleDeposit(method)}
            disabled={processing}
          >
            <Ionicons name={method.icon || 'card-outline'} size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>{method.name}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        ))
      ) : (
        // Fallback to default options if no methods from API
        <>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
            onPress={() => handleDeposit({ id: 'card', name: t('depositWithCard') || 'Deposit with Card' })}
            disabled={processing}
          >
            <Ionicons name="card-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>{t('depositWithCard') || 'Deposit with Card'}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
            onPress={() => handleDeposit({ id: 'mobile', name: t('depositWithMobile') || 'Deposit with Mobile Money' })}
            disabled={processing}
          >
            <Ionicons name="cash-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>{t('depositWithMobile') || 'Deposit with Mobile Money'}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
            onPress={() => handleDeposit({ id: 'bank', name: t('depositWithBank') || 'Deposit with Bank' })}
            disabled={processing}
          >
            <Ionicons name="business-outline" size={22} color={colors.accent} style={{ marginRight: 10 }} />
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>{t('depositWithBank') || 'Deposit with Bank'}</Text>
            {processing && <ActivityIndicator size="small" color={colors.accent} style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  backButton: {
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
  },
  optionText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default DepositScreen;
