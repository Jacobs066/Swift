import React, { useState, useEffect } from 'react';
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

const SendSuccessScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={32} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      {/* Success Icon */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/845/845646.png' }}
        style={styles.successIcon}
      />

      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#800080' }]}>
        Transfer Successful!
      </Text>

      <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#333' }]}>
        Your money has been sent successfully.
      </Text>

        {/* Transaction Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}>
          <Text style={[styles.detailsTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
            Transaction Details
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>Amount:</Text>
            <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              {transactionDetails.amount}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>Recipient:</Text>
            <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              {transactionDetails.recipient}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>Method:</Text>
            <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              {transactionDetails.method}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>Reference:</Text>
            <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              {transactionDetails.reference}
            </Text>
      </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>Status:</Text>
            <Text style={[styles.detailValue, { color: '#00E676' }]}>
              {transactionDetails.status}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#800080' }]} 
          onPress={() => router.push('/screens/HomeScreen')}
        >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handleViewTransaction}
        >
          <Text style={styles.secondaryButtonText}>View Transaction History</Text>
        </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadReceipt}>
        <Text style={styles.secondaryButtonText}>Download Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleShareReceipt}>
        <Text style={styles.secondaryButtonText}>Share Receipt</Text>
      </TouchableOpacity>
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
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
    elevation: 2,
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
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#800080',
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#800080',
    fontWeight: '600',
  },
});
