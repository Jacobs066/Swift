import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import BottomNavBar from '../components/BottomNavBar';
import { useWallet } from '../context/WalletContext';

export default function WalletScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { balances } = useWallet();
  const [visible, setVisible] = useState({ USD: true, EUR: true, GBP: true });

  const themedStyles = getStyles(isDarkMode);

  const walletList = [
    { currency: 'USD', symbol: '$', display: 'US Dollar' },
    { currency: 'EUR', symbol: '€', display: 'Euro' },
    { currency: 'GBP', symbol: '£', display: 'British Pound' },
  ];

  const toggleVisibility = (currency) => {
    setVisible(prev => ({ ...prev, [currency]: !prev[currency] }));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={themedStyles.container}>
        <View style={themedStyles.header}>
          <TouchableOpacity style={themedStyles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back-circle" size={24} color="#800080" />
          </TouchableOpacity>
          <Text style={themedStyles.title}>My Wallet</Text>
        </View>
        <ScrollView contentContainerStyle={themedStyles.scrollContent}>
          {walletList.map((wallet) => (
            <View key={wallet.currency} style={[themedStyles.card, { backgroundColor: '#800080' }]}> 
              <Text style={themedStyles.cardTitle}>{wallet.display}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={themedStyles.cardBalance}>
                  {visible[wallet.currency] ? `${wallet.symbol}${balances[wallet.currency]?.toFixed(2) || '0.00'}` : '****'}
                  </Text>
                <TouchableOpacity onPress={() => toggleVisibility(wallet.currency)} style={{ marginLeft: 10 }}>
                  <Ionicons
                    name={visible[wallet.currency] ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={themedStyles.transferButton}
                    onPress={() => {
                        router.push({
                          pathname: '/screens/Convert',
                    params: { fromWallet: wallet.currency },
                        });
                    }}
                  >
                    <Text style={themedStyles.transferButtonText}>Transfer</Text>
                  </TouchableOpacity>
                </View>
          ))}
        </ScrollView>
      </View>
      <BottomNavBar />
    </View>
  );
}

const getStyles = (isDarkMode) => {
  const shadow = Platform.select({
    ios: {
      shadowColor: '#800080',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { height: 3, width: 0 },
    },
    android: {
      elevation: 4,
    },
  });

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f6f6f6',
      paddingTop: 60,
    },
    header: {
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      color: '#800080',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    scrollContent: {
      paddingBottom: 40,
      paddingHorizontal: 20,
    },
    card: {
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      ...shadow,
    },
    cardTitle: {
      color: '#f6f6f6',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    cardBalance: {
      fontSize: 28,
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 16,
    },
    transferButton: {
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginTop: 10,
    },
    transferButtonText: {
      color: '#800080',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};
