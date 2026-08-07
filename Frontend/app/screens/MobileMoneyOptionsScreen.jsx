import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { getBanks } from '../utils/api';
import Card from '../components/Card';

const MobileMoneyOptionsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);
        const response = await getBanks('mobile_money');
        setProviders(response.banks || []);
      } finally {
        setLoading(false);
      }
    };
    loadProviders();
  }, []);

  const handleProviderSelect = (provider) => {
    router.push({
      pathname: '/screens/MobileWallet',
      params: { provider: provider.code, providerName: provider.name }
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>Select Mobile Money Provider</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Choose your mobile money provider to receive the withdrawal.
      </Text>

      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : (
        providers.map((provider) => (
          <TouchableOpacity key={provider.code} onPress={() => handleProviderSelect(provider)}>
            <Card style={styles.providerCard}>
              <View style={styles.providerInfo}>
                <Ionicons name="phone-portrait-outline" size={24} color={colors.accent} />
                <View style={styles.providerDetails}>
                  <Text style={[styles.providerName, { color: colors.textPrimary }]}>{provider.name}</Text>
                  <Text style={[styles.providerDescription, { color: colors.textMuted }]}>Send to {provider.name}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Card>
          </TouchableOpacity>
        ))
      )}
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
    marginBottom: 15,
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
