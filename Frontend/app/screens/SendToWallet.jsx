import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { initiateSend } from '../api';

const mobileWallets = [
  {
    name: 'MTN Mobile Money',
    value: 'MTN',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/MTN_Logo.svg'
  },
  {
    name: 'Telecel Cash',
    value: 'Telecel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Telecel_logo_2024.svg'
  },
  {
    name: 'AirtelTigo Money',
    value: 'AirtelTigo',
    logo: 'https://seeklogo.com/images/A/airteltigo-logo-1DB0B75CD3-seeklogo.com.png'
  }
];

const SendToMobileWalletScreen = () => {
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const validateForm = () => {
    if (!selectedWallet) {
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
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);
      
      const sendData = {
        method: 'mobile',
        amount: parseFloat(amount),
        recipientDetails: {
          network: selectedWallet,
          walletNumber: walletNumber,
          recipientName: recipientName,
        }
      };

      const result = await initiateSend('mobile', parseFloat(amount), sendData.recipientDetails);
      
      Alert.alert('Success', 'Money sent successfully!', [
        { 
          text: 'OK', 
          onPress: () => router.push('/screens/SendSuccess') 
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to send money: ' + error.toString());
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={36} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#800080' }]}>
        Send to Mobile Wallet
      </Text>

      <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#800080' }]}>
        Choose Mobile Network
      </Text>

      <View style={styles.walletRow}>
        {mobileWallets.map((wallet) => (
          <TouchableOpacity
            key={wallet.value}
            style={[
              styles.walletCard,
              selectedWallet === wallet.value && styles.walletCardSelected
            ]}
            onPress={() => setSelectedWallet(wallet.value)}
          >
            <Image source={{ uri: wallet.logo }} style={styles.walletLogo} />
            <Text
              style={[
                styles.walletText,
                { color: selectedWallet === wallet.value ? '#fff' : '#800080' }
              ]}
            >
              {wallet.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#800080' }]}>
        Wallet Number
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
            color: isDarkMode ? '#fff' : '#000'
          }
        ]}
        placeholder="Enter wallet number"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        keyboardType="numeric"
        value={walletNumber}
        onChangeText={setWalletNumber}
        maxLength={10}
      />

      <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#800080' }]}>
        Recipient Name
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
            color: isDarkMode ? '#fff' : '#000'
          }
        ]}
        placeholder="Enter recipient name"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={recipientName}
        onChangeText={setRecipientName}
      />

      <Text style={[styles.label, { color: isDarkMode ? '#ccc' : '#800080' }]}>
        Amount
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
            color: isDarkMode ? '#fff' : '#000'
          }
        ]}
        placeholder="Enter amount"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={[
          styles.sendButton,
          {
            backgroundColor:
              selectedWallet && walletNumber && recipientName && amount && !processing ? '#800080' : '#ccc'
          }
        ]}
        onPress={handleSend}
        disabled={!selectedWallet || !walletNumber || !recipientName || !amount || processing}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.sendText}>Send</Text>
        )}
      </TouchableOpacity>
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
    borderColor: '#800080',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: 100
  },
  walletCardSelected: {
    backgroundColor: '#800080'
  },
  walletLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 6
  },
  walletText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600'
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 20
  },
  sendButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
