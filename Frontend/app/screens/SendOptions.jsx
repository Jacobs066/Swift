import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getSendMethods } from '../utils/api';

const SendOptionsScreen = () => {
  const router = useRouter();
  const { colors, radius } = useTheme();
  const [sendMethods, setSendMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSendMethods();
  }, []);

  const loadSendMethods = async () => {
    try {
      setLoading(true);
      const methods = await getSendMethods();
      setSendMethods(methods);
    } catch (error) {
      Alert.alert('Error', 'Failed to load send methods: ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleSendToBank = () => {
    router.push('/screens/SendToBank');
  };

  const handleSendToMobile = () => {
    router.push('/screens/SendToWallet');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Loading send methods...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        How would you like to send money?
      </Text>

      {/* Send to Bank Account */}
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
        onPress={handleSendToBank}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4334/4334959.png' }}
          style={styles.icon}
        />
        <Text style={[styles.optionText, { color: colors.textPrimary }]}>
          Send to Bank Account
        </Text>
        <Ionicons name="chevron-forward" size={20} color={colors.accent} />
      </TouchableOpacity>

      {/* Send to Mobile Wallet */}
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
        onPress={handleSendToMobile}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png' }}
          style={styles.icon}
        />
        <Text style={[styles.optionText, { color: colors.textPrimary }]}>
          Send to Mobile Wallet
        </Text>
        <Ionicons name="chevron-forward" size={20} color={colors.accent} />
      </TouchableOpacity>
    </View>
  );
};

export default SendOptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 50,
    justifyContent: 'flex-start',
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
});
