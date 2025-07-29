import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const MobileMoneyOptionsScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const mobileProviders = [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      icon: 'phone-portrait-outline',
      description: 'Send to MTN Mobile Money'
    },
    {
      id: 'vodafone',
      name: 'Vodafone Cash',
      icon: 'phone-portrait-outline',
      description: 'Send to Vodafone Cash'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      icon: 'phone-portrait-outline',
      description: 'Send to Airtel Money'
    }
  ];

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    subtext: isDarkMode ? '#ccc' : '#666',
    card: isDarkMode ? '#1f1f1f' : '#f2e6f7',
    accent: '#800080',
    border: isDarkMode ? '#333' : '#ddd',
  };

  const handleProviderSelect = (provider) => {
    router.push({
      pathname: '/screens/MobileWallet',
      params: { provider: provider.id, providerName: provider.name }
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.accent }]}>Select Mobile Money Provider</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        Choose your mobile money provider to receive the withdrawal.
      </Text>

      {mobileProviders.map((provider) => (
        <TouchableOpacity
          key={provider.id}
          style={[styles.providerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => handleProviderSelect(provider)}
        >
          <View style={styles.providerInfo}>
            <Ionicons name={provider.icon} size={24} color={colors.accent} />
            <View style={styles.providerDetails}>
              <Text style={[styles.providerName, { color: colors.text }]}>{provider.name}</Text>
              <Text style={[styles.providerDescription, { color: colors.subtext }]}>{provider.description}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerDetails: {
    marginLeft: 15,
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerDescription: {
    fontSize: 14,
  },
});

export default MobileMoneyOptionsScreen;
