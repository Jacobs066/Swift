import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MobileMoneyOptionsScreen = () => {
  const router = useRouter();

  const handleWalletPress = (provider) => {
    // Navigate to MobileWallet with selected provider
    router.push({
      pathname: '/screens/MobileWallet',
      params: { 
        provider: provider,
        providerName: provider === 'MTN' ? 'MTN Mobile Money' : 'TELECEL CASH'
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={32} color="#800080" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Select mobile money provider</Text>

      {/* Wallet Options */}
      <TouchableOpacity
        style={styles.walletOption}
        onPress={() => handleWalletPress('MTN')}
      >
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/MTN_Logo.svg' }}
          style={styles.logo}
        />
        <Text style={styles.walletText}>MTN Mobile Money</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.walletOption}
        onPress={() => handleWalletPress('TELECEL')}
      >
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Telecel_logo.png' }}
          style={styles.logo}
        />
        <Text style={styles.walletText}>TELECEL CASH</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MobileMoneyOptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: '#800080',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 24,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#800080',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 12,
  },
  walletText: {
    fontSize: 16,
    color: '#800080',
    fontWeight: 'bold',
  },
});
