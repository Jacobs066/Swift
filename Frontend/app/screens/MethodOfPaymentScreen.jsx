import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MethodOfPaymentScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#800080" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Method of payment</Text>

      {/* Payment Options */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push('/screens/MobileWallet')}
      >
        <Text style={styles.optionText}>Mobile Money</Text>
        <Ionicons name="chevron-forward" size={20} color="#800080" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push('/screens/BankDepositScreen')}
      >
        <Text style={styles.optionText}>Bank Deposit</Text>
        <Ionicons name="chevron-forward" size={20} color="#800080" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push('/screens/DebitCardScreen')}
      >
        <Text style={styles.optionText}>Debit Card Deposit</Text>
        <Ionicons name="chevron-forward" size={20} color="#800080" />
      </TouchableOpacity>
    </View>
  );
};

export default MethodOfPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 40,
  },
  option: {
    borderWidth: 1.2,
    borderColor: '#800080',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    color: '#800080',
    fontSize: 16,
    fontWeight: '600',
  },
}); 