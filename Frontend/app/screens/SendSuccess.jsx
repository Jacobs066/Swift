import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const SendSuccessScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const amount = 'GHS 250.00'; // You can pass this dynamically using params
  const receiptContent = `Swift App\nTransfer Receipt\n----------------------\nDate: ${new Date().toLocaleString()}\nAmount Sent: ${amount}\nStatus: Successful\n\nThank you for using Swift!`;

  const handleDownloadReceipt = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}receipt.txt`;
      await FileSystem.writeAsStringAsync(fileUri, receiptContent);
      Alert.alert('Receipt Downloaded', 'Your receipt has been saved locally.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to download receipt.');
    }
  };

  const handleShareReceipt = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}receipt.txt`;
      await FileSystem.writeAsStringAsync(fileUri, receiptContent);
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to share receipt.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
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

      <View style={styles.amountBox}>
        <Text style={styles.amount}>{amount}</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#800080' }]} onPress={() => router.push('/screens/HomeScreen')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

      {/* Download Receipt */}
      <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadReceipt}>
        <Text style={styles.secondaryButtonText}>Download Receipt</Text>
      </TouchableOpacity>

      {/* Share Receipt */}
      <TouchableOpacity style={styles.secondaryButton} onPress={handleShareReceipt}>
        <Text style={styles.secondaryButtonText}>Share Receipt</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30
  },
  amountBox: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 40
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#800080'
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 16
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#800080',
    marginBottom: 12
  },
  secondaryButtonText: {
    color: '#800080',
    fontWeight: '600'
  }
});
