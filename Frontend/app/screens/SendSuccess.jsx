import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Button from '../components/Button';
import Card from '../components/Card';

const SendSuccessScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  // Get transaction details from params or use defaults
  const transactionDetails = {
    amount: params.amount || 'GHS 250.00',
    recipient: params.recipient || 'Recipient Name',
    method: params.method || 'Bank Transfer',
    reference: params.reference || 'TXN' + Date.now(),
    date: params.date || new Date().toLocaleString(),
    status: 'Successful'
  };

  const receiptContent = `Swift App
Transfer Receipt
----------------------
Date: ${transactionDetails.date}
Amount Sent: ${transactionDetails.amount}
Recipient: ${transactionDetails.recipient}
Method: ${transactionDetails.method}
Reference: ${transactionDetails.reference}
Status: ${transactionDetails.status}

Thank you for using Swift!`;

  const handleDownloadReceipt = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}receipt_${transactionDetails.reference}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, receiptContent);
      Alert.alert('Receipt Downloaded', 'Your receipt has been saved locally.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to download receipt.');
    }
  };

  const handleShareReceipt = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}receipt_${transactionDetails.reference}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, receiptContent);
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to share receipt.');
    }
  };

  const handleViewTransaction = () => {
    router.push('/screens/TransactionDetails');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={32} color={colors.accent} />
      </TouchableOpacity>

      {/* Success Icon */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/845/845646.png' }}
        style={styles.successIcon}
      />

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Transfer Successful!
      </Text>

      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Your money has been sent successfully.
      </Text>

        {/* Transaction Details Card */}
        <Card style={styles.detailsCard}>
          <Text style={[styles.detailsTitle, { color: colors.textPrimary }]}>
            Transaction Details
          </Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Amount:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {transactionDetails.amount}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Recipient:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {transactionDetails.recipient}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Method:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {transactionDetails.method}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Reference:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {transactionDetails.reference}
            </Text>
      </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Status:</Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>
              {transactionDetails.status}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <Button
          title="Back to Home"
          onPress={() => router.push('/screens/HomeScreen')}
          style={styles.button}
        />

        <Button
          title="View Transaction History"
          variant="secondary"
          onPress={handleViewTransaction}
          style={styles.secondaryButton}
        />

        <Button
          title="Download Receipt"
          variant="secondary"
          onPress={handleDownloadReceipt}
          style={styles.secondaryButton}
        />

        <Button
          title="Share Receipt"
          variant="secondary"
          onPress={handleShareReceipt}
          style={styles.secondaryButton}
        />
      </ScrollView>
    </View>
  );
};

export default SendSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  detailsCard: {
    marginBottom: 30,
    width: '100%',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
  secondaryButton: {
    width: '100%',
    marginBottom: 12,
  },
});
