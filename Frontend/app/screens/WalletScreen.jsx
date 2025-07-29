import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { getUserWallets } from '../api';
import BottomNavBar from '../components/BottomNavBar';

export default function WalletScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallets();
  }, []);

  // Refresh wallets when screen comes into focus (e.g., after deposit)
  useFocusEffect(
    React.useCallback(() => {
      loadWallets();
    }, [])
  );

  const loadWallets = async () => {
    try {
      setLoading(true);
      
      // Default wallets with 0.00 values
      const defaultWallets = [
        { id: 2, currency: 'USD', balance: 0.00, isPrimary: false },
        { id: 3, currency: 'EUR', balance: 0.00, isPrimary: false },
        { id: 4, currency: 'GBP', balance: 0.00, isPrimary: false },
      ];
      
      // Set default wallets first
      setWallets(defaultWallets);
      
      // Try to fetch real values from backend
      try {
        const walletData = await getUserWallets();
        console.log('Fetched real wallet data:', walletData);
        
        if (walletData && walletData.length > 0) {
          // Update wallets with real values from backend
          const updatedWallets = defaultWallets.map(defaultWallet => {
            const realWallet = walletData.find(w => w.currency === defaultWallet.currency);
            if (realWallet) {
              return {
                ...defaultWallet,
                id: realWallet.id,
                balance: realWallet.balance || 0.00,
                isPrimary: realWallet.isPrimary || defaultWallet.isPrimary
              };
            }
            return defaultWallet;
          });
          
          setWallets(updatedWallets);
        }
      } catch (backendError) {
        console.log('Failed to fetch real wallet data:', backendError);
        // Keep default wallets if backend fails
      }
      
    } catch (error) {
      console.log('Failed to load wallets:', error);
      Alert.alert('Error', 'Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrencyDisplayName = (currency) => {
    switch (currency) {
      case 'EUR':
        return 'Euro';
      case 'USD':
        return 'US Dollar';
      case 'GBP':
        return 'British Pound';
      case 'GHS':
        return 'Ghana Cedi';
      default:
        return currency;
    }
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'USD':
        return '$';
      case 'GBP':
        return '£';
      case 'GHS':
        return '₵';
      default:
        return currency;
    }
  };

  const getWalletColors = (currency) => {
    switch (currency) {
      case 'EUR':
        return ['#800080', '#800080'];
      case 'USD':
        return ['#e0c3f7', '#e0c3f7'];
      case 'GBP':
        return ['#FF69B4', '#8A2BE2'];
      case 'GHS':
        return ['#4CAF50', '#45a049'];
      default:
        return ['#800080', '#800080'];
    }
  };

  const getLastTransaction = (wallet) => {
    // This would ideally come from the backend with recent transaction info
    // For now, we'll show a placeholder
    return 'No recent transactions';
  };

  const themedStyles = getStyles(isDarkMode);

  if (loading) {
    return (
      <View style={[themedStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#800080" />
        <Text style={[themedStyles.loadingText, { color: isDarkMode ? '#fff' : '#333' }]}>
          Loading wallets...
        </Text>
        <BottomNavBar />
      </View>
    );
  }

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
          {wallets.length > 0 ? (
            wallets.map((wallet) => {
              const colors = getWalletColors(wallet.currency);
              const symbol = getCurrencySymbol(wallet.currency);
              const displayName = getCurrencyDisplayName(wallet.currency);
              
              return (
                <View key={wallet.id} style={[themedStyles.card, { backgroundColor: colors[0] }]}>
                  <Text style={themedStyles.cardTitle}>{displayName}</Text>
                  <Text style={themedStyles.cardBalance}>
                    {symbol}{wallet.balance?.toFixed(2) || '0.00'}
                  </Text>
                  <View style={themedStyles.cardDetails}>
                    <View style={themedStyles.detailRow}>
                      <Ionicons name="card-outline" size={16} color="#fff" />
                      <Text style={themedStyles.detailText}>Wallet ID: {wallet.id}</Text>
                    </View>
                    <View style={themedStyles.detailRow}>
                      <Ionicons name="cash-outline" size={16} color="#fff" />
                      <Text style={themedStyles.detailText}>{wallet.currency}</Text>
                    </View>
                    <View style={themedStyles.detailRow}>
                      <Ionicons name="sync-outline" size={16} color="#fff" />
                      <Text style={themedStyles.detailText}>{getLastTransaction(wallet)}</Text>
                    </View>
                    {wallet.isPrimary && (
                      <View style={themedStyles.detailRow}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={[themedStyles.detailText, { color: '#FFD700' }]}>Primary Wallet</Text>
                      </View>
                    )}
                  </View>

                  {/* Transfer Button */}
                  <TouchableOpacity
                    style={themedStyles.transferButton}
                    onPress={() => {
                      if (wallet.currency === 'EUR') {
                        router.push({
                          pathname: '/screens/EuroScreen',
                          params: { walletId: wallet.id, currency: wallet.currency },
                        });
                      } else if (wallet.currency === 'USD') {
                        router.push({
                          pathname: '/screens/USDScreen',
                          params: { walletId: wallet.id, currency: wallet.currency },
                        });
                      } else if (wallet.currency === 'GBP') {
                        router.push({
                          pathname: '/screens/GBPScreen',
                          params: { walletId: wallet.id, currency: wallet.currency },
                        });
                      } else if (wallet.currency === 'GHS') {
                        router.push({
                          pathname: '/screens/Convert',
                          params: { walletId: wallet.id, currency: wallet.currency },
                        });
                      }
                    }}
                  >
                    <Text style={themedStyles.transferButtonText}>Transfer</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={themedStyles.emptyContainer}>
              <Ionicons name="wallet-outline" size={64} color="#999" />
              <Text style={[themedStyles.emptyTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                No Wallets Found
              </Text>
              <Text style={[themedStyles.emptyText, { color: isDarkMode ? '#ccc' : '#666' }]}>
                You don't have any wallets yet. Contact support to create your first wallet.
              </Text>
            </View>
          )}
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
    loadingText: {
      marginTop: 10,
      fontSize: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      marginTop: 50,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    emptyText: {
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
};
