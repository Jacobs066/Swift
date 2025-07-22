import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // Ensure correct path

const walletCards = [
  {
    id: 1,
    title: 'Euro',
    symbol: '€',
    balance: '5348.50',
    walletId: 'EUR-9938-AB12',
    currency: 'EUR',
    lastTx: 'Deposit of €200',
    colors: ['#800080', '#800080'],
  },
  {
    id: 2,
    title: 'USDT',
    symbol: '$',
    balance: '2187.30',
    walletId: 'USDT-7183-XY44',
    currency: 'USDT',
    lastTx: 'Reward of $10',
    colors: ['#e0c3f7', '#e0c3f7'],
  },
  {
    id: 3,
    title: 'British Pound',
    symbol: '£',
    balance: '3490.00',
    walletId: 'GBP-1122-ZZ90',
    currency: 'GBP',
    lastTx: 'Withdrawal of £100',
    colors: ['#FF69B4', '#8A2BE2'],
  },
];

export default function WalletScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const themedStyles = getStyles(isDarkMode);

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <TouchableOpacity style={themedStyles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={24} color="#800080" />
        </TouchableOpacity>
        <Text style={themedStyles.title}>My Wallet</Text>
      </View>

      <ScrollView contentContainerStyle={themedStyles.scrollContent}>
        {walletCards.map((card) => (
          <View key={card.id} style={[themedStyles.card, { backgroundColor: card.colors[0] }]}>
            <Text style={themedStyles.cardTitle}>{card.title}</Text>
            <Text style={themedStyles.cardBalance}>
              {card.symbol}
              {card.balance}
            </Text>
            <View style={themedStyles.cardDetails}>
              <View style={themedStyles.detailRow}>
                <Ionicons name="card-outline" size={16} color="#fff" />
                <Text style={themedStyles.detailText}>{card.walletId}</Text>
              </View>
              <View style={themedStyles.detailRow}>
                <Ionicons name="cash-outline" size={16} color="#fff" />
                <Text style={themedStyles.detailText}>{card.currency}</Text>
              </View>
              <View style={themedStyles.detailRow}>
                <Ionicons name="sync-outline" size={16} color="#fff" />
                <Text style={themedStyles.detailText}>{card.lastTx}</Text>
              </View>
            </View>

            {/* Transfer Button */}
            <TouchableOpacity
              style={themedStyles.transferButton}
              onPress={() => {
                if (card.currency === 'EUR') {
                  router.push({
                    pathname: '/screens/EuroScreen',
                    params: { walletId: card.walletId, currency: 'EUR' },
                  });
                } else if (card.currency === 'USDT') {
                  router.push({
                    pathname: '/screens/USDScreen',
                    params: { walletId: card.walletId, currency: 'USDT' },
                  });
                } else if (card.currency === 'GBP') {
                  router.push({
                    pathname: '/screens/GBPScreen',
                    params: { walletId: card.walletId, currency: 'GBP' },
                  });
                }
              }}
            >
              <Text style={themedStyles.transferButtonText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
    cardDetails: {
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
      paddingTop: 10,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    detailText: {
      marginLeft: 8,
      color: '#fff',
      fontSize: 14,
    },
    transferButton: {
      marginTop: 16,
      backgroundColor: isDarkMode ? '#ddd' : '#fff',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    transferButtonText: {
      color: '#800080',
      fontSize: 16,
      fontWeight: '600',
    },
  });
};
